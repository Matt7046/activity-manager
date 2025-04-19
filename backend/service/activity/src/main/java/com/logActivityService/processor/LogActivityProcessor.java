package com.logActivityService.processor;

import com.common.configurations.structure.NotificationComponent;
import com.common.configurations.rabbitmq.RabbitMQProducer;
import com.common.data.family.OperationTypeLogFamily;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.dto.family.LogFamilyDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.logActivityService.service.LogActivityService;
import com.common.data.activity.LogActivity;
import com.common.mapper.LogActivityMapper;
import com.logActivityService.service.LogActivityWebService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class LogActivityProcessor {

    @Autowired
    private LogActivityWebService logActivityWebService;
    @Autowired
    private LogActivityService logActivityService;
    @Autowired
    private RabbitMQProducer notificationPublisher;
    @Autowired
    private NotificationComponent notificationComponent;
    @Value("${app.rabbitmq.exchange.point.exchangeName}")
    private String exchangePoint;
    @Value("${app.rabbitmq.exchange.point.routingKey.logActivity}")
    private String routingKeyLogActivity;
    @Value("${app.rabbitmq.exchange.point.routingKey.logFamily}")
    private String routingKeyLogFamily;


    public Mono<ResponseDTO> logAttivitaByEmail(UserPointDTO userPointDTO) {
        Integer page = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? 0 : userPointDTO.getPage();
        Integer size = userPointDTO.getUnpaged() != null && userPointDTO.getUnpaged() ? Integer.MAX_VALUE : userPointDTO.getSize();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Order.desc(userPointDTO.getField())));
        List<LogActivityDTO> logAttivitaUnica =  logActivityService.logAttivitaByEmail(userPointDTO, pageable).stream()
                .map(LogActivityMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
        return Mono.just(new ResponseDTO(logAttivitaUnica, ActivityHttpStatus.OK.value(), new ArrayList<>()));
    }

    public Mono<ResponseDTO> savePoints(LogActivityDTO logActivityDTO) {
        return processPoints(logActivityDTO);
    }

    private Mono<ResponseDTO> processPoints(LogActivityDTO logActivityDTO) {
        UserPointDTO userPointDTO = new UserPointDTO(logActivityDTO);
        userPointDTO.setOperation(false);
        LogFamilyDTO logFamilyDTO = new LogFamilyDTO();
        logFamilyDTO.setOperations(OperationTypeLogFamily.OPERATIVE);
        logFamilyDTO.setDate(new Date());
        logFamilyDTO.setPerformedByEmail(logActivityDTO.getEmailUserCurrent());
        logFamilyDTO.setReceivedByEmail(logActivityDTO.getEmail());
        return logActivityWebService.savePoints(userPointDTO)
                .flatMap(response ->
                        saveLog(userPointDTO, logActivityDTO)
                )
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(response -> {
                    logFamilyDTO.setPoint(userPointDTO);
                    return saveLogFamily(response, logFamilyDTO)
                            .subscribeOn(Schedulers.boundedElastic());
                });
    }

    public Mono<ResponseDTO> saveLog(UserPointDTO point, LogActivityDTO logActivityDTO) {
        logActivityDTO.setPoint(point);
        return Mono.fromCallable(() -> {
            LogActivity sub = logActivityService.saveLogActivity(logActivityDTO);
            return new ResponseDTO(LogActivityMapper.INSTANCE.toDTO(sub), ActivityHttpStatus.OK.value(), new ArrayList<>());
        }).doOnError(response1 -> {
            // Invia l'evento dopo il salvataggio del log in modo asincrono
            Mono.fromRunnable(() -> {
                notificationComponent.inviaNotifica(logActivityDTO.getPoint(), exchangePoint, routingKeyLogActivity);
            }).subscribe();  // Avvia il runnable senza bloccare il flusso
        });
    }

    private Mono<ResponseDTO> saveLogFamily(ResponseDTO response, LogFamilyDTO logFamilyDTO) {
        if (logFamilyDTO.getReceivedByEmail().equals(logFamilyDTO.getPerformedByEmail())) {
            return Mono.just(new ResponseDTO(logFamilyDTO, ActivityHttpStatus.OK.value(), new ArrayList<>()));
        }
        StringBuilder builder = new StringBuilder();
        return logActivityWebService.saveLogFamily(logFamilyDTO)
                .doOnSuccess(response1 -> {
                    // Azioni con la response
                    if (!response1.getErrors().isEmpty()) {
                        notificationComponent.inviaNotifica(logFamilyDTO.getPoint(), exchangePoint, routingKeyLogActivity);
                        ObjectMapper mapper = new ObjectMapper();
                        LogActivityDTO dto = mapper.convertValue(response.getJsonText(), LogActivityDTO.class);
                        logActivityService.deleteLogActivity(dto);
                    }
                })
                .subscribeOn(Schedulers.boundedElastic());
    }
}



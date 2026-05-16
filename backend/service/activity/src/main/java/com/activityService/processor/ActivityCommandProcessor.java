package com.activityService.processor;

import com.activityService.service.ActivityService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.configurations.rabbitmq.RabbitMQSearchPublisher;
import com.common.data.activity.Activity;
import com.common.data.activity.event.ActivityCreateEvent;
import com.activityService.dto.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.security.ResourceAccessClient;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;

@Service
public class ActivityCommandProcessor {
    @Autowired
    private ActivityService activityService;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    private RabbitMQSearchPublisher commandSearchPublisher;
    @Autowired
    private ResourceAccessClient resourceAccessClient;
    @Value("${app.rabbitmq.exchange.point.exchangeName}")
    private String exchangePoint;
    @Value("${app.rabbitmq.exchange.point.routingKey.commandSaveActivity}")
    private String routingKeySaveActivity;
    @Value("${app.rabbitmq.exchange.point.routingKey.commandDeleteActivity}")
    private String routingKeyDeleteActivity;

    public Mono<ResponseDTO> saveActivity(ActivityDTO activityDTO) {
        return resourceAccessClient.assertCanAccess(activityDTO.getEmail())
                .then(Mono.fromCallable(() -> {
                    activityDTO.setEmail(encryptDecryptConverter.storageForm(activityDTO.getEmail()));
                    Activity activity = activityService.saveActivity(activityDTO);
                    return new ResponseDTO(activity, ActivityHttpStatus.OK.value(), new ArrayList<>());
                }))
                .doOnSuccess(response1 -> {
                    Mono.fromRunnable(() -> {
                        ActivityCreateEvent event = new ActivityCreateEvent(response1.getJsonText());
                        commandSearchPublisher.publishCreate(event);

                    }).subscribe();
                });
    }

    public Mono<ResponseDTO> deleteByIdentificativo(String identificativo) {
        String _id = encryptDecryptConverter.safeDecrypt(identificativo);
        return Mono.fromCallable(() -> activityService.findByIdentificativo(_id))
                .flatMap(existing -> {
                    if (existing != null) {
                        String ownerPlain = encryptDecryptConverter.decrypt(existing.getEmail());
                        return resourceAccessClient.assertCanAccess(ownerPlain).thenReturn(_id);
                    }
                    return Mono.just(_id);
                })
                .flatMap(id -> Mono.fromCallable(() -> {
                    Long _idL = activityService.deleteByIdentificativo(id);
                    return new ResponseDTO(_idL, ActivityHttpStatus.OK.value(), new ArrayList<>());
                }))
                .doOnSuccess(response1 -> {
                    Mono.fromRunnable(() -> {
                        commandSearchPublisher.publishDeleteEnriched(_id);
                    }).subscribe();
                });

    }
}

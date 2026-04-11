package com.activityService.processor;

import com.activityService.service.ActivityService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.configurations.rabbitmq.RabbitMQProducer;
import com.common.configurations.rabbitmq.RabbitMQSearchPublisher;
import com.common.data.activity.Activity;
import com.common.data.activity.event.ActivityCreateEvent;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
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
    @Value("${app.rabbitmq.exchange.point.exchangeName}")
    private String exchangePoint;
    @Value("${app.rabbitmq.exchange.point.routingKey.commandSaveActivity}")
    private String routingKeySaveActivity;
    @Value("${app.rabbitmq.exchange.point.routingKey.commandDeleteActivity}")
    private String routingKeyDeleteActivity;
    @Value("${rabbitmq.exchange.name.activity.search.exchangeName}")
    private String exchangeActivitySearch;
    @Value("${error.document.notFound}")
    private String errorDocument;

    public Mono<ResponseDTO> saveActivity(ActivityDTO activityDTO) {
        String emailCriypt = encryptDecryptConverter.convert(activityDTO.getEmail());
        activityDTO.setEmail(emailCriypt);
        return Mono.fromCallable(() -> {
            Activity activity = activityService.saveActivity(activityDTO);
            return new ResponseDTO(activity, ActivityHttpStatus.OK.value(), new ArrayList<>());
        }).doOnSuccess(response1 -> {
            // Invia l'evento dopo il salvataggio del log in modo asincrono
            Mono.fromRunnable(() -> {
                ActivityCreateEvent event = new ActivityCreateEvent(response1.getJsonText());
                commandSearchPublisher.publishCreate(event); // usa il tuo RabbitMQSearchPublisher

            }).subscribe(); // Avvia il runnable senza bloccare il flusso
        });
    }

    public Mono<ResponseDTO> deleteByIdentificativo(String identificativo) {
        String _id = encryptDecryptConverter.decrypt(identificativo);
        return Mono.fromCallable(() -> {
            Long _idL = activityService.deleteByIdentificativo(_id);
            return new ResponseDTO(_idL, ActivityHttpStatus.OK.value(), new ArrayList<>());
        }).doOnSuccess(response1 -> {
            // Invia l'evento dopo il salvataggio del log in modo asincrono
            Mono.fromRunnable(() -> {
                commandSearchPublisher.publishDeleteEnriched(_id); // u
            }).subscribe(); // Avvia il runnable senza bloccare il flusso
        });

    }
}
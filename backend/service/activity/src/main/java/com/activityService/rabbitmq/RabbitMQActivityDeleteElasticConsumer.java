package com.activityService.rabbitmq;

import com.activityService.repository.elastic.ActivityDocumentRepository;
import com.common.data.activity.ActivityDocument;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import java.io.IOException;

@Component
public class RabbitMQActivityDeleteElasticConsumer {

    private final ActivityDocumentRepository repository;

    public RabbitMQActivityDeleteElasticConsumer(ActivityDocumentRepository repository) {
        this.repository = repository;
    }

    @RabbitListener(queues = "delete.elastic.queue")
    public void handleDeleteEnriched(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {

        // Simula un ritardo prima dell'ACK per vedere il messaggio su RabbitMQ Management UI
        try {
            // Thread.sleep(20000); // 5 secondi
            receive(jsonMessage, 0);
            channel.basicAck(tag, false); // Conferma il messaggio SOLO dopo l'elaborazion
        } catch (InterruptedException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void receive(String in, int receiver) throws InterruptedException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode node = objectMapper.readTree(in);
        String identificativo = node.path("identificativo").asText();
        StopWatch watch = new StopWatch();
        watch.start();
        doWork(in);
        watch.stop();
        ActivityDocument document = repository.findByIdentificativo(identificativo);
        if(document !=null){
            repository.delete(document);
        }

    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }

}

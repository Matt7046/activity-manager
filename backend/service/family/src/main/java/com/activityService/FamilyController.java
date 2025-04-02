package com.activityService;

import com.common.configurations.RabbitMQProducer;
import com.common.dto.FamilyNotificationDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.PointsDTO;
import com.common.dto.PointsRDTO;
import com.common.dto.ResponseDTO;
import com.common.transversal.PointsUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.management.Notification;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/family")
public class FamilyController {

    @Autowired
    private FamilyService familyService;
    @Autowired
    private RabbitMQProducer notificationPublisher;


        @PostMapping("/dati")
        public Mono<ResponseDTO> savePointsByFamily(@RequestBody PointsDTO pointsDTO) {
                String email = pointsDTO.getEmailFamily();
                pointsDTO.setOperation(true);
                return familyService.savePointsByFamily(pointsDTO)
                                .flatMap(responseDTO -> {
                                        PointsDTO subDTO = new ObjectMapper().convertValue(responseDTO.jsonText(), PointsDTO.class);                                 
                                        List<PointsUser> filteredList = subDTO.getPoints().stream()
                                                        .filter(point -> email.equals(point.getEmail()))
                                                        .collect(Collectors.toList());
                                        if (filteredList.isEmpty()) {
                                                return Mono.error(new RuntimeException(
                                                                "Nessun punto trovato per l'email specificata"));
                                        }
                                        // Creare l'oggetto PointsRDTO
                                        PointsRDTO record = new PointsRDTO(
                                                        filteredList.get(0).getPoints(),
                                                        "I Points a disposizione sono: "
                                                                        + filteredList.get(0).getPoints());
                                        // Creare il ResponseDTO finale
                                        FamilyNotificationDTO dto = new FamilyNotificationDTO(pointsDTO.getUsePoints() + " Punti aggiunti da " + pointsDTO.getEmail() );
                                        dto.setEmailFamily(pointsDTO.getEmailFamily());
                                        dto.setEmail(pointsDTO.getEmail());
                                        dto.setServiceName("familyService");
                                    try {
                                        String jsonMessage = new ObjectMapper().writeValueAsString(dto);
                                        notificationPublisher.sendMessage(jsonMessage);
                                    } catch (JsonProcessingException e) {
                                        throw new RuntimeException(e);
                                    }
                                        ResponseDTO response = new ResponseDTO(record, HttpStatus.OK.value(),
                                                        new ArrayList<>());
                                        return Mono.just(response);
                                });
        }

}

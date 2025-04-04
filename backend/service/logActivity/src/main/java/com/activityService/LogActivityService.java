package com.activityService;
import com.activityBusinessLogic.savePoints.Event;
import com.activityBusinessLogic.savePoints.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.statemachine.StateMachine;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.dto.ActivityDTO;
import com.common.dto.LogActivityDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.common.mapper.ActivityMapper;
import com.common.mapper.LogActivityMapper;
import com.repository.logActivity.LogActivityRepository;
import com.common.configurations.EncryptDecryptConverter;
import com.common.data.Activity;
import com.common.data.LogActivity;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
public class LogActivityService {

    @Autowired
    private LogActivityRepository logActivityRepository;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;
    @Autowired
    @Qualifier("webClientPoints")
    private WebClient webClientPoints;


    public Mono<String> saveActivity(ActivityDTO activityDTO) {
        Activity activityToSave = ActivityMapper.INSTANCE.fromDTO(activityDTO);

        if (activityDTO.get_id() != null) {
            PointsDTO points = new PointsDTO();
            points.set_id(activityDTO.get_id());
            webClientActivity.post()
            .uri("/api/activity/find")
            .bodyValue(points)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                return Mono.error(new RuntimeException("Errore 4xx")); // Passa l'errore
            })
            .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {})
            .doOnError(ex -> {
                // Log error senza interrompere
                System.err.println("Errore nella chiamata: " + ex.getMessage());
            }).subscribe(response -> {
            },
            error -> {
   
            },
            () -> {
               
            }
        );
        

           
        }
                return null;
}

    public LogActivity saveLogActivity(LogActivityDTO ActivityDTO) {
        LogActivity sub = LogActivityMapper.INSTANCE.fromDTO(ActivityDTO);
        return logActivityRepository.save(sub);
    }


    public List<LogActivity> logAttivitaByEmail(PointsDTO pointsDTO, Sort sort) {
        return logActivityRepository.findLogByEmail(encryptDecryptConverter.convert(pointsDTO.getEmail()), sort);
    }

    public ResponseDTO savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        PointsDTO pointsDTO = new PointsDTO();
        pointsDTO.setPoint(logActivityDTO.getPoints());
        pointsDTO.setEmail(logActivityDTO.getEmail());
        pointsDTO.setEmailFamily(logActivityDTO.getEmailFamily());
        pointsDTO.setUsePoints(logActivityDTO.getUsePoints());
        Mono<ResponseDTO> pointsResponseMono = webClientPoints.post()
                .uri("/api/points/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    return Mono.error(new RuntimeException("Errore 4xx"));
                })
                .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {
                })
                .doOnError(ex -> {
                    System.err.println("Errore nella chiamata: " + ex.getMessage());
                });


        try {
            LogActivity sub = saveLogActivity(logActivityDTO);
            LogActivityDTO dto = LogActivityMapper.INSTANCE.toDTO(sub);
            return new ResponseDTO(dto, HttpStatus.OK.value(), new ArrayList<>());
        } catch (Exception e) {
            // ❌ Se si verifica un errore, annulla l'operazione nel microservizio points
            webClientPoints.post()
                    .uri("/api/points/dati/standard/rollback")  // Endpoint di compensazione
                    .bodyValue(pointsDTO)
                    .retrieve()
                    .toBodilessEntity()
                    .subscribe(); // Esegui senza bloccare

            throw e; // Rilancia l'eccezione per propagare l'errore
        }
    }
}

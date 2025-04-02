package com.activityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
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
import java.util.List;

@Service
public class LogActivityService {  

    @Autowired
    private LogActivityRepository logAttivitaRepository;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;


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
        return logAttivitaRepository.save(sub);
    }


    public List<LogActivity> logAttivitaByEmail(PointsDTO pointsDTO, Sort sort) {
        return logAttivitaRepository.findLogByEmail(encryptDecryptConverter.convert(pointsDTO.getEmail()), sort);
    }

  


   
}

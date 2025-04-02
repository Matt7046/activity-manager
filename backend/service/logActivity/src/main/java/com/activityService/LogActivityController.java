package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.data.LogActivity;
import com.common.dto.ActivityDTO;
import com.common.dto.LogActivityDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.common.mapper.LogActivityMapper;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/logactivity")
public class LogActivityController {

    @Autowired
    private LogActivityService activityService;

    @Autowired
    @Qualifier("webClientPoints")
    private WebClient webClientPoints;
  

    @PostMapping("/log")
    public  ResponseDTO logActivityByEmail(@RequestBody PointsDTO pointsDTO) {
        Sort sort = Sort.by(Sort.Order.desc("date"));
        List<LogActivity> sub = activityService.logAttivitaByEmail(pointsDTO, sort);
        List<LogActivityDTO> logAttivitaUnica = sub.stream()
                .map(LogActivityMapper.INSTANCE::toDTO)

                .collect(Collectors.toList());
                ResponseDTO response = new ResponseDTO(logAttivitaUnica, HttpStatus.OK.value(), new ArrayList<>());
        return response;
    }
    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        // Costruisci il PointsDTO a partire dal LogActivityDTO
        PointsDTO pointsDTO = new PointsDTO();
        pointsDTO.setPoint(logActivityDTO.getPoints());
        pointsDTO.setEmail(logActivityDTO.getEmail());
        pointsDTO.setEmailFamily(logActivityDTO.getEmailFamily());
        pointsDTO.setUsePoints(logActivityDTO.getUsePoints());
    
        // Effettua la chiamata al servizio points
        Mono<ResponseDTO> pointsResponseMono = webClientPoints.post()
                .uri("/api/points/dati/standard")
                .bodyValue(pointsDTO)
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, clientResponse -> {
                    System.out.println("Errore 4xx ricevuto");
                    return Mono.error(new RuntimeException("Errore 4xx"));
                })
                .bodyToMono(new ParameterizedTypeReference<ResponseDTO>() {})
                .doOnError(ex -> {
                    System.err.println("Errore nella chiamata: " + ex.getMessage());
                });
    
        // Una volta completata la chiamata points, salva il log e crea la response
        return pointsResponseMono.flatMap(pointsResponse ->
            Mono.fromCallable(() -> {
                // Salva il log (chiamata sincrona; verrà eseguita su un thread separato grazie a Mono.fromCallable)
                LogActivity sub = activityService.saveLogActivity(logActivityDTO);
                // Converte l'oggetto salvato in LogActivityDTO
                LogActivityDTO dto = LogActivityMapper.INSTANCE.toDTO(sub);
                // Crea una ResponseDTO che contiene il dto e lo stato OK
                return new ResponseDTO(dto, HttpStatus.OK.value(), new ArrayList<>());
            })
        );
    }
}

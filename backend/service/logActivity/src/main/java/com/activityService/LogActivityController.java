package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import com.common.data.LogActivity;
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
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/logactivity")
public class LogActivityController {

    @Autowired
    private LogActivityService logActivityService;
    @Autowired
    private PointsStateMachineService pointsStateMachineService;

    @Autowired
    @Qualifier("webClientPoints")
    private WebClient webClientPoints;


    @PostMapping("/log")
    public ResponseDTO logActivityByEmail(@RequestBody PointsDTO pointsDTO) {
        Sort sort = Sort.by(Sort.Order.desc("date"));
        List<LogActivity> sub = logActivityService.logAttivitaByEmail(pointsDTO, sort);
        List<LogActivityDTO> logAttivitaUnica = sub.stream()
                .map(LogActivityMapper.INSTANCE::toDTO)

                .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(logAttivitaUnica, HttpStatus.OK.value(), new ArrayList<>());
        return response;
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        return pointsStateMachineService.savePoints(logActivityDTO);
    }
}

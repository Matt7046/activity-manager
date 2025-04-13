package com.logActivityService.controller;

import com.common.dto.user.UserPointDTO;
import com.logActivityService.processor.LogActivityProcessor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.data.activity.LogActivity;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.mapper.LogActivityMapper;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/logactivity")
public class LogActivityController {

    @Autowired
    private LogActivityProcessor logActivityProcessor;


    @Value("${order.type1}")
    private String field;

    @PostMapping("/log")
    public ResponseDTO logActivityByEmail(@RequestBody UserPointDTO userPointDTO) {
        Sort sort = Sort.by(Sort.Order.desc(field));
        List<LogActivity> sub = logActivityProcessor.logAttivitaByEmail(userPointDTO, sort);
        List<LogActivityDTO> logAttivitaUnica = sub.stream()
                .map(LogActivityMapper.INSTANCE::toDTO)

                .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(logAttivitaUnica, ActivityHttpStatus.OK.value(), new ArrayList<>());
        return response;
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        return logActivityProcessor.savePoints(logActivityDTO);
    }
}

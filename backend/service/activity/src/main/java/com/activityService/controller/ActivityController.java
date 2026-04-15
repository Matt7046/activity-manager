package com.activityService.controller;

import com.activityService.processor.ActivityCommandProcessor;
import com.activityService.processor.ActivityQueryProcessor;
import com.activityService.service.ActivityService;
import com.common.dto.user.UserPointDTO;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;

import com.common.structure.exception.NotFoundException;
import com.common.mapper.ActivityMapper;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/activity")
public class ActivityController {

    @Autowired
    private ActivityQueryProcessor processorQuery;

        @Autowired
    private ActivityCommandProcessor processorCommand;

    @PostMapping("/activities")
    public Mono<ResponseDTO> getActivities(@RequestBody UserPointDTO userPointDTO) {
       return processorQuery.getActivities(userPointDTO);
    }

    @PostMapping("/find")
    public Mono<ResponseDTO> findByIdentificativo(@RequestBody UserPointDTO userPointDTO) {
        return processorQuery.findByIdentificativo(userPointDTO);
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        return processorCommand.saveActivity(activityDTO); // Mappa il risultato in un ResponseDTO
    }

     @DeleteMapping("toggle/{identificativo}")
    public Mono<ResponseDTO> deleteByIdentificativo(@PathVariable String identificativo) throws Exception {
         return processorCommand.deleteByIdentificativo(identificativo);// Mappa il risultato in un ResponseDTO
       
    }
}

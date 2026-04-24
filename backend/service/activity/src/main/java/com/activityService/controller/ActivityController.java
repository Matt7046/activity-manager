package com.activityService.controller;

import com.activityService.processor.ActivityCommandProcessor;
import com.activityService.processor.ActivityQueryProcessor;
import com.common.dto.user.UserPointDTO;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import reactor.core.publisher.Mono;
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

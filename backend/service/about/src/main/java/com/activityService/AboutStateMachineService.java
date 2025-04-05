package com.activityService;

import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;
import com.deleteActivityAbout.AboutDeleteActivityProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import com.saveActivityAbout.AboutSaveActivityProcessor;

@Service
public class AboutStateMachineService {

    @Autowired
    private AboutSaveActivityProcessor aboutSaveActivityProcessor;
    @Autowired
    private AboutDeleteActivityProcessor aboutDeleteActivityProcessor;


    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
       return aboutSaveActivityProcessor.callActivitySaveService(activityDTO);
    }

    public Mono<ResponseDTO> callActivityDeleteService(String identificativo) {
        return aboutDeleteActivityProcessor.callActivityDeleteService(identificativo);
    }
}

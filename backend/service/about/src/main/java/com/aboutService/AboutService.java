package com.aboutService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;

import reactor.core.publisher.Mono;

@Service
public class AboutService {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    @Autowired
    private AboutStateMachineService aboutStateMachineService;



    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
        return aboutStateMachineService.callActivitySaveService(activityDTO);
    }

    public Mono<ResponseDTO> callActivityDeleteService(String identificativo) {

        return aboutStateMachineService.callActivityDeleteService(identificativo);
    }

}

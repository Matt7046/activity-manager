package com.aboutService.processor;

import com.aboutService.service.AboutWebService;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class AboutSaveActivityProcessor {

    @Autowired
    @Qualifier("webClientActivity")
    private WebClient webClientActivity;

    @Autowired
    private AboutWebService aboutWebService;

    public Mono<ResponseDTO> callActivitySaveService(ActivityDTO activityDTO) {
        return aboutWebService.processSaveActivity(activityDTO);
    }
}

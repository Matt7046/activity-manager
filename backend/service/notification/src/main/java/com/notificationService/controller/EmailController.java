package com.notificationService.controller;

import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.security.ResourceAccessClient;
import com.common.security.ReactiveJwt;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.messages.ForbiddenMessages;
import com.notificationService.processor.EmailProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/email")
public class EmailController {

    @Autowired
    private EmailProcessor notificationProcessor;
    @Autowired
    private ReactiveJwt reactiveJwt;
    @Autowired
    private ForbiddenMessages forbiddenMessages;
    @Autowired
    private ResourceAccessClient resourceAccessClient;

    @PostMapping("/entity")
    public Mono<ResponseDTO> sendPasswordEmailChild(@RequestBody UserPointWithChildDTO userPoint) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> {
                    if (userPoint.getUserPoint() == null) {
                        return Mono.error(new ForbiddenException(forbiddenMessages.emailInvalidPayload()));
                    }
                    userPoint.getUserPoint().setEmailUserCurrent(principal);
                    return resourceAccessClient.assertCanAccess(principal)
                            .then(notificationProcessor.sendPasswordEmailChild(userPoint));
                });
    }
}

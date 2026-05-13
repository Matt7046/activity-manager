package com.notificationService.processor;

import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.notificationService.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EmailProcessor {

    @Autowired
    private EmailService emailService;
    @Autowired
    private UserPointMapper userPointMapper;

    /**
     * Messaggio in coda dopo che user-point ha già applicato i controlli d'accesso.
     * Qui non si richiama user-point via WebClient: nel thread Rabbit non esiste
     * {@code ReactiveSecurityContextHolder} e {@code webClientPoint} non emette risposta.
     */
    public Mono<ResponseDTO> sendPasswordEmailChild(UserPointWithChildDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint userPoint = userPointMapper.fromDTO(userPointDTO.getUserPoint());
            List<UserPoint> userChild = userPointDTO.getUserPointChild().stream()
                    .map(userPointMapper::fromDTO).collect(Collectors.toList());
            userPoint = emailService.sendPasswordEmailChild(userPoint, userChild);
            UserPointDTO response = userPointMapper.toDTO(userPoint);
            return new ResponseDTO(response, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> sendPasswordEmail(UserPointWithChildDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint userPoint = userPointMapper.fromDTO(userPointDTO.getUserPoint());
            userPoint = emailService.sendPasswordEmail(userPoint);
            UserPointDTO response = userPointMapper.toDTO(userPoint);
            return new ResponseDTO(response, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }
}

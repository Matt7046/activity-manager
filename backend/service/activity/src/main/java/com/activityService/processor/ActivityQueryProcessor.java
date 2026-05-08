package com.activityService.processor;

import com.activityService.service.ActivityService;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.ActivityMapper;
import com.common.security.ResourceAccessClient;
import com.common.structure.exception.NotFoundException;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityQueryProcessor {
    @Autowired
    private ActivityService activityService;

    @Autowired
    private ActivityMapper activityMapper;

    @Value("${error.document.notFound}")
    private String errorDocument;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private ResourceAccessClient resourceAccessClient;

    public Mono<ResponseDTO> getActivities(UserPointDTO userPointDTO) {
        return resourceAccessClient.assertCanAccess(userPointDTO.getEmail())
                .then(Mono.fromCallable(() -> {
                    String email = userPointDTO.getEmail();
                    List<Activity> sub = activityService.findAllByEmail(email);
                    List<ActivityDTO> subDTO = sub.stream()
                            .map(activityMapper::toDTO)
                            .collect(Collectors.toList());
                    return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
                }));
    }

    public Mono<ResponseDTO> findByIdentificativo(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> activityService.findByIdentificativo(userPointDTO.get_id()))
                .flatMap(item -> {
                    if (item == null) {
                        return Mono.error(new NotFoundException(errorDocument + userPointDTO.get_id()));
                    }
                    String ownerPlain = encryptDecryptConverter.decrypt(item.getEmail());
                    return resourceAccessClient.assertCanAccess(ownerPlain).thenReturn(item);
                })
                .map(item -> new ResponseDTO(activityMapper.toDTO(item), ActivityHttpStatus.OK.value(),
                        new ArrayList<>()));
    }

}

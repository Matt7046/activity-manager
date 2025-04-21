package com.userPointService.processor;

import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.PointDTO;
import com.common.dto.user.PointRDTO;
import com.common.dto.user.UserDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.UserPointMapper;
import com.common.structure.exception.NotFoundException;
import com.common.structure.status.ActivityHttpStatus;
import com.userPointService.service.UserPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Optional;

@Component
public class UserPointProcessor {

    @Autowired
    private UserPointService userPointService;

    @Autowired
    private UserPointMapper userPointMapper;


    @Value("${error.document.notFound}")
    private String errorDocument;

    @Value("${error.document.points}")
    private String message;

    public Mono<ResponseDTO> findByEmail(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint item;
            ResponseDTO responseDTO = null;
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);

            item = userPointService.getPointByEmail(sub);
            if (item == null) {
                throw new NotFoundException(errorDocument + userPointDTO.getEmail());
            }
            UserPointDTO subDTO = userPointMapper.toDTO(item);
            Optional<PointDTO> pointUser = subDTO.getPointFigli().stream()
                    .filter(point -> {
                        assert userPointDTO.getEmail() != null;
                        return userPointDTO.getEmail().equals(point.getEmail());
                    })
                    .findFirst();
            if (pointUser.isPresent()) {
                PointRDTO record = new PointRDTO(pointUser.get().getPoints(),
                        message.concat(pointUser.get().getPoints().toString()), pointUser.get().getNameImage());
                responseDTO = new ResponseDTO(record, ActivityHttpStatus.OK.value(), new ArrayList<>());
            }
            return responseDTO;
        });
    }


    public Mono<ResponseDTO> getEmailChild(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            sub = userPointService.getPointByEmail(sub);
            UserPointDTO subDTO = userPointMapper.toDTO(sub);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> getTypeUser(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {          ;
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            Long itemId = userPointService.getTypeUser(sub);
            String emailUserCurrent = itemId == 1 ? userPointDTO.getEmail() : userPointDTO.getEmailFamily();
            return new ResponseDTO(new UserDTO(itemId, itemId == 2, emailUserCurrent), ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> saveUser(UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {

            userPointDTO.setEmailFamily(userPointDTO.getEmail());
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            if (userPointSave.getEmail() != null && !userPointSave.getEmailFigli().isEmpty()) {
                userPointSave.setType(1L);
                userPointSave.getPointFigli()
                        .forEach(point -> point.setPoints(100L));
                userPointSave = userPointService.saveUser(userPointSave);
            }
            String emailUserCurrent = userPointDTO.getType().equals(1L) ? userPointDTO.getEmail() : userPointDTO.getEmailFamily();
            return new ResponseDTO(new UserDTO(null, true, emailUserCurrent),
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> savePoints(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            Boolean operations = userPointDTO.getOperation() != null && userPointDTO.getOperation();
            userPointDTO.setOperation(operations);
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            UserPoint points = userPointService.savePoint(userPointSave);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> saveUserImage(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint points = userPointMapper.fromDTO(userPointDTO);
            points = userPointService.saveUserImage(points);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


}

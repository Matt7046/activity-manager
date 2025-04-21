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
import com.common.configurations.encrypt.EncryptDecryptConverter;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Optional;

@Component
public class UserPointProcessor {

    @Autowired
    private UserPointService userPointService;

    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;

    @Value("${error.document.notFound}")
    private String errorDocument;

    @Value("${error.document.points}")
    private String message;

    public Mono<ResponseDTO> findByEmail(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint item;
            ResponseDTO responseDTO = null;
            String emailCriypt = encryptDecryptConverter.convert(userPointDTO.getEmail());

            item = userPointService.getPointByEmail(emailCriypt);
            if (item == null) {
                throw new NotFoundException(errorDocument + userPointDTO.getEmail());
            }
            String email = encryptDecryptConverter.convert(userPointDTO.getEmail());
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(item);
            Optional<PointDTO> pointUser = subDTO.getPointFigli().stream()
                    .filter(point -> {
                        assert email != null;
                        return email.equals(point.getEmail());
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
            String emailCriypt = encryptDecryptConverter.convert(userPointDTO.getEmail());
            UserPoint sub = userPointService.getPointByEmail(emailCriypt);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(sub);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> getTypeUser(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            userPointDTO.setEmailFamily(encryptDecryptConverter.convert(userPointDTO.getEmailFamily()));
            userPointDTO.setEmail(encryptDecryptConverter.convert(userPointDTO.getEmail()));
            UserPoint sub = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
            Long itemId = userPointService.getTypeUser(sub);
            String emailUserCurrentCrypt = itemId == 1 ? userPointDTO.getEmail() : userPointDTO.getEmailFamily();
            String emailUserCurrent = encryptDecryptConverter.decrypt(emailUserCurrentCrypt);
            return new ResponseDTO(new UserDTO(itemId, itemId == 2, emailUserCurrent), ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> saveUser(UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {

            userPointDTO.setEmailFamily(userPointDTO.getEmail());
            UserPoint userPointSave = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
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
            UserPoint userPointSave = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
            userPointSave.setEmailFamily(encryptDecryptConverter.convert(userPointSave.getEmailFamily()));
            UserPoint points = userPointService.savePoint(userPointSave);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


    public Mono<ResponseDTO> saveUserImage(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint points = UserPointMapper.INSTANCE.fromDTO(userPointDTO);
            points.setEmailFamily(encryptDecryptConverter.convert(userPointDTO.getEmailFamily()));
            points = userPointService.saveUserImage(points);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
        });
    }


}

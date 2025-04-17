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

    public Mono<ResponseDTO> findByEmail(UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
            UserPoint item = null;
            ResponseDTO responseDTO = null;
            item = userPointService.getPointByEmail(userPointDTO.getEmail());
            if (item == null) {
                throw new NotFoundException(errorDocument + userPointDTO.getEmail());
            }

            if (item != null) {
                String email = encryptDecryptConverter.convert(userPointDTO.getEmail());

                UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(item);
                Optional<PointDTO> pointUser = subDTO.getPoints().stream()
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
            }
            return responseDTO;
        });
    }


    public Mono<ResponseDTO> getEmailChild(UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
            String email = userPointDTO.getEmail();
            UserPoint sub = userPointService.getPointByEmail(email);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(sub);
            ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
            return response;
        });
    }


    public Mono<ResponseDTO> getUserType(UserPointDTO userPointDTO) throws Exception {
         return Mono.fromCallable(() -> {
            Long itemId = userPointService.getTypeUser(userPointDTO);
            String emailUserCurrent = itemId == 1 ? userPointDTO.getEmail() : userPointDTO.getEmailFamily();
            ResponseDTO response = new ResponseDTO(new UserDTO(itemId, null, emailUserCurrent), ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }


    public Mono<ResponseDTO> saveUser(UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {

            userPointDTO.setEmailFamily(userPointDTO.getEmail());
            Boolean itemId = userPointService.saveUser(userPointDTO);
            String emailUserCurrent = userPointDTO.getType().equals(1L) ? userPointDTO.getEmail() : userPointDTO.getEmailFamily();
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId, emailUserCurrent),
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
            return response;
        });
    }


    public Mono<ResponseDTO> savePoints(UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
            Boolean operations = userPointDTO.getOperation() == null ? false : userPointDTO.getOperation();
            userPointDTO.setOperation(operations);
            UserPoint points = userPointService.savePoint(userPointDTO);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(points);
            ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }


    public Mono<ResponseDTO> saveUserImage(UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
            UserPoint points = userPointService.saveUserImage(userPointDTO);
            UserPointDTO subDTO = UserPointMapper.INSTANCE.toDTO(points);
            ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }



}

package com.userPointService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.configurations.structure.NotificationComponent;
import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.PointRDTO;
import com.common.dto.user.UserDTO;
import com.common.dto.user.UserPointDTO;
import com.common.dto.user.UserPointWithChildDTO;
import com.common.mapper.UserPointMapper;
import com.common.mapper.UserPointToPointMapper;
import com.common.structure.exception.NotFoundException;
import com.common.structure.status.ActivityHttpStatus;
import com.userPointService.service.UserPointService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class UserPointProcessor {

    @Autowired
    private UserPointService userPointService;
    @Autowired
    private UserPointMapper userPointMapper;
    @Autowired
    private UserPointToPointMapper userPointToPointMapper;
    @Autowired
    private NotificationComponent notificationComponent;
    @Autowired
    private EncryptDecryptConverter encryptDecryptConverter;
    @Value("${rabbitmq.exchange.name.notification}")
    private String notificationExchange;
    @Value("${rabbitmq.exchange.routingKey.email}")
    private String routingKeyEmail;
    @Value("${error.document.notFound}")
    private String errorDocument;
    @Value("${error.document.points}")
    private String message;

    @Transactional
    public Mono<ResponseDTO> findByEmail(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            UserPoint item = userPointService.findByEmailAndType(sub.getEmailChild(),0L);
            if (item != null) {
                PointRDTO record = new PointRDTO(item.getPoints(), message.concat(item.getPoints().toString()), item.getNameImages());
                return new ResponseDTO(record, ActivityHttpStatus.OK.value(), new ArrayList<>());
            }
            throw new NotFoundException(errorDocument + userPointDTO.getEmail());
        });
    }

    @Transactional
    public Mono<ResponseDTO> getEmailChild(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            UserPoint userList = userPointService.getEmailChild(sub);
            sub.setEmailFigli(userList.getEmailFigli());
            UserPointDTO subDTO = userPointMapper.toDTO(sub);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> getTypeUser(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            ;
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            Long itemId = userPointService.getTypeUser(sub);
            String emailUserCurrent = userPointDTO.getEmailUserCurrent();
            return new ResponseDTO(new UserDTO(itemId, itemId == 2, emailUserCurrent), ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> saveUser(UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            List<UserPoint> userChild = userPointSave.getPointFigli().stream().map(userPointToPointMapper::toChange).toList();
            userPointSave.setType(1);
            UserPoint finalUserPointSave = userPointSave;
            userChild = userChild.stream().map(x -> {
                String tempPassword = UUID.randomUUID().toString().substring(0, 8);
                x.setPassword(encryptDecryptConverter.convert(tempPassword));
                x.setPoints(100);
                x.setType(0);
                return x;
            }).collect(Collectors.toList());

            if (userPointSave.getEmail() != null && !userChild.isEmpty()) {
                userPointSave = userPointService.saveUser(userPointSave, userChild);
                UserPointDTO dto = userPointMapper.toDTO(userPointSave);
                inviaNotifica(dto, userChild);
            }
            return new ResponseDTO(new UserDTO(null, true, userPointDTO.getEmailUserCurrent()), ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> login(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint userPointLogin = userPointMapper.fromDTO(userPointDTO);
            UserPoint userPointResponse = userPointService.login(userPointLogin);
            UserPointDTO userPointDTOResponse = null;
            if (userPointResponse != null) {
                userPointDTOResponse = userPointMapper.toDTO(userPointResponse);
                userPointDTOResponse.setEmailUserCurrent(userPointDTO.getEmail());
            }
            return new ResponseDTO(userPointDTOResponse, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> savePoints(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            Boolean operations = userPointDTO.getOperation() != null && userPointDTO.getOperation();
            userPointDTO.setOperation(operations);
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            UserPoint points = userPointService.savePoint(userPointSave);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> saveUserImage(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint points = userPointMapper.fromDTO(userPointDTO);
            points = userPointService.saveUserImage(points);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }


    private void inviaNotifica(UserPointDTO userPointDTO, List<UserPoint> userChild) {
        List<UserPointDTO> userChildDTO=  userChild.stream().map(userPointMapper::toDTO).collect(Collectors.toList());
        UserPointWithChildDTO dto = new UserPointWithChildDTO(userPointDTO,userChildDTO);
        notificationComponent.inviaNotifica(dto, notificationExchange, routingKeyEmail);
    }


}

package com.userPointService.processor;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
import com.common.structure.messages.NotFoundMessages;
import com.common.structure.messages.UnauthorizedMessages;
import com.common.structure.status.ActivityHttpStatus;
import com.userPointService.service.UserPointAccessService;
import com.userPointService.service.UserPointService;

import reactor.core.publisher.Mono;

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
    @Autowired
    private UserPointAccessService userPointAccessService;
    @Autowired
    private NotFoundMessages notFoundMessages;
    @Autowired
    private UnauthorizedMessages unauthorizedMessages;
    @Value("${rabbitmq.exchange.name.notification}")
    private String notificationExchange;
    @Value("${rabbitmq.routingKey.email}")
    private String routingKeyEmail;
    @Value("${message.document.points}")
    private String message;

    @Transactional
    public Mono<ResponseDTO> findByEmail(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            UserPoint item = userPointService.findByEmailAndType(sub.getEmailChild(), 0L);
            if (item != null) {
                Map<String, String> bySlot = userPointService.resolveNameImagesBySlot(item);
                PointRDTO record = new PointRDTO(item.getPoints(), message.concat(item.getPoints().toString()),
                        bySlot);
                return new ResponseDTO(record, ActivityHttpStatus.OK.value(), new ArrayList<>());
            }
            throw new NotFoundException(notFoundMessages.userByEmail());
        });
    }

    @Transactional
    public Mono<ResponseDTO> getEmailChild(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            UserPoint userList = userPointService.getEmailChild(sub);
            Boolean onlyChecked = userPointDTO.getOnlyCheckedChildren();
            List<String> plainChildren = userPointService.getChildEmailsPlainForParentDisplay(userList, onlyChecked);
            UserPointDTO subDTO = userPointMapper.toDTO(userList);
            subDTO.setEmailFigli(plainChildren);
            subDTO.setOnlyCheckedChildren(onlyChecked == null || Boolean.TRUE.equals(onlyChecked));
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> getTypeUser(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            UserPoint self = userPointService.findSelfByEmailUserCurrent(sub);
            Integer itemId = self != null ? self.getType() : 2;
            String emailUserCurrent = userPointDTO.getEmailUserCurrent();
            List<String> pending = null;
            if (Integer.valueOf(0).equals(itemId) && self != null && self.getEmail() != null) {
                List<String> found = userPointService.findPendingParentEmailsPlain(self.getEmail());
                if (!found.isEmpty()) {
                    pending = found;
                }
            }
            return new ResponseDTO(new UserDTO(itemId, itemId == 2, emailUserCurrent, pending),
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> saveUser(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireSelf(principalEmail, userPointDTO.getEmailUserCurrent());
            return registerInternal(userPointDTO);
        });
    }

    @Transactional
    public Mono<ResponseDTO> register(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> registerInternal(userPointDTO));
    }

    private ResponseDTO registerInternal(UserPointDTO userPointDTO) {
        UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
        List<UserPoint> userChild = userPointSave.getPointFigli().stream().map(userPointToPointMapper::toChange)
                .toList();
        userPointSave.setType(1);
        userPointSave.setStatus(1);
        userChild = userChild.stream().map(x -> {
            String tempPassword = UUID.randomUUID().toString().substring(0, 8);
            x.setPassword(encryptDecryptConverter.convert(tempPassword));
            x.setPoints(100);
            x.setType(0);
            x.setStatus(1);
            return x;
        }).collect(Collectors.toList());

        if (userPointSave.getEmail() != null && !userChild.isEmpty()) {
            userPointSave = userPointService.saveUser(userPointSave, userChild);
            UserPointDTO dto = userPointMapper.toDTO(userPointSave);
            List<String> plainAdds = userChild.stream().map(c -> encryptDecryptConverter.decrypt(c.getEmail()))
                    .collect(Collectors.toList());
            inviaNotifica(dto, userChild, plainAdds);
        }
        return new ResponseDTO(new UserDTO(null, true, userPointDTO.getEmailUserCurrent(), null),
                ActivityHttpStatus.OK.value(), new ArrayList<>());
    }

    @Transactional
    public Mono<ResponseDTO> resetPassword(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> resetPasswordInternal(userPointDTO));
    }

    private ResponseDTO resetPasswordInternal(UserPointDTO userPointDTO) {
        UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
        if (userPointSave.getEmailUserCurrent() != null) {
            userPointSave = userPointService.getUserByEmail(userPointSave);
            if (userPointSave != null) {
                UserPointDTO dto = userPointMapper.toDTO(userPointSave);
                dto.setPassword(tempPassword);
                dto.setEmailUserCurrent(userPointDTO.getEmailUserCurrent());
                saveUserPassword(dto);
                inviaNotifica(dto, null, null);
            }
        }
        return new ResponseDTO(new UserDTO(null, true, userPointDTO.getEmailUserCurrent(), null),
                ActivityHttpStatus.OK.value(), new ArrayList<>());
    }

    @Transactional
    public Mono<ResponseDTO> login(UserPointDTO userPointDTO) {
        return Mono.fromCallable(() -> {
            UserPoint userPointLogin = userPointMapper.fromDTO(userPointDTO);
            UserPoint userPointResponse = userPointService.login(userPointLogin);
            if (userPointResponse == null || userPointResponse.getEmail() == null
                    || userPointResponse.get_id() == null) {
                return new ResponseDTO((Object) null, 401,
                        new ArrayList<>(List.of(unauthorizedMessages.invalidCredentials())));
            }
            UserPointDTO userPointDTOResponse = userPointMapper.toDTO(userPointResponse);
            userPointDTOResponse.setEmailUserCurrent(userPointDTO.getEmail());
            return new ResponseDTO(userPointDTOResponse, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> savePoints(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireFamilyPointsTransfer(principalEmail, userPointDTO.getEmailUserCurrent(),
                    userPointDTO.getEmail());
            Boolean operations = userPointDTO.getOperation() != null && userPointDTO.getOperation();
            userPointDTO.setOperation(operations);
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            UserPoint points = userPointService.savePoint(userPointSave);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> saveUserImage(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint points = userPointMapper.fromDTO(userPointDTO);
            points = userPointService.saveUserImage(points);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    private void inviaNotifica(UserPointDTO userPointDTO, List<UserPoint> userChild, List<String> addedChildEmailsPlain) {
        List<UserPointDTO> userChildDTO = userChild == null ? null
                : userChild.stream().map(userPointMapper::toDTO).collect(Collectors.toList());
        UserPointWithChildDTO dto = new UserPointWithChildDTO();
        dto.setUserPoint(userPointDTO);
        dto.setUserPointChild(userChildDTO);
        dto.setAddedChildEmailsPlain(addedChildEmailsPlain);
        notificationComponent.inviaNotifica(dto, notificationExchange, routingKeyEmail);
    }

    public Mono<ResponseDTO> updateStatus(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            UserPoint points = userPointService.updateStatus(userPointSave);
            UserPointDTO subDTO = userPointMapper.toDTO(points);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> saveUserPassword(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, userPointDTO.getEmailUserCurrent());
            return saveUserPasswordInternal(userPointDTO);
        });
    }

    public ResponseDTO saveUserPasswordInternal(UserPointDTO userPointDTO) {
        UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
        if (userPointSave.getEmailUserCurrent() != null) {
            userPointService.saveUserPassword(userPointSave);
        }
        return new ResponseDTO(new UserDTO(userPointSave.getType(), false, userPointDTO.getEmailUserCurrent(), null),
                ActivityHttpStatus.OK.value(), new ArrayList<>());
    }


    @Transactional
    public Mono<ResponseDTO> saveUserPassword(UserPointDTO userPointDTO) {
        return Mono.just(saveUserPasswordInternal(userPointDTO));
    }

    @Transactional
    public Mono<ResponseDTO> updateChildByEmail(UserPointWithChildDTO body, String principalEmail) {
        return Mono.fromCallable(() -> {
            if (body == null || body.getUserPoint() == null || body.getUserPoint().getEmailUserCurrent() == null) {
                throw new NotFoundException(notFoundMessages.payloadEmailUserCurrent());
            }
            userPointAccessService.requireCanAccess(principalEmail, body.getUserPoint().getEmailUserCurrent());
            UserPoint parentKey = userPointMapper.fromDTO(body.getUserPoint());
            List<UserPoint> ops = body.getUserPointChild() != null ? userPointMapper.fromDTO( body.getUserPointChild()) : new ArrayList<>();
            List<UserPoint> newChildren = new ArrayList<>();
            Set<String> newlyAddedEnc = new LinkedHashSet<>();
            UserPoint updated = userPointService.updateChildByEmail(parentKey, ops, newChildren, newlyAddedEnc);
            List<String> newlyAddedPlain = newlyAddedEnc.stream().map(encryptDecryptConverter::decrypt)
                    .collect(Collectors.toList());
            if (!newChildren.isEmpty() || !newlyAddedPlain.isEmpty()) {
                UserPointDTO parentDto = userPointMapper.toDTO(updated);
                if (body.getUserPoint().getEmailUserCurrent() != null) {
                    parentDto.setEmailUserCurrent(body.getUserPoint().getEmailUserCurrent());
                }
                inviaNotifica(parentDto, newChildren, newlyAddedPlain);
            }
            UserPointDTO subDTO = userPointMapper.toDTO(updated);
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    @Transactional
    public Mono<ResponseDTO> confirmParentLinks(UserPointDTO userPointDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireSelf(principalEmail, userPointDTO.getEmailUserCurrent());
            UserPoint sub = userPointMapper.fromDTO(userPointDTO);
            userPointService.confirmChildParentLinks(sub.getEmailUserCurrent(), userPointDTO.getConfirmParentEmails());
            return new ResponseDTO(new UserDTO(null, true, userPointDTO.getEmailUserCurrent(), null),
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }
}

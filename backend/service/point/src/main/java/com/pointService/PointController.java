package com.pointService;

import com.common.data.UserPoint;
import com.common.dto.PointRDTO;
import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import com.common.dto.UserDTO;
import com.common.exception.ActivityHttpStatus;
import com.common.exception.NotFoundException;
import com.common.mapper.PointsMapper;
import com.common.transversal.PointsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/point")
public class PointController {

    @Autowired
    private PointService pointService;

    @Value("${error.document.notFound}")
    private String errorDocument;

    @Value("${error.document.points}")
    private String message;

    @PostMapping("find")
    public  Mono<ResponseDTO> findByEmail(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
        UserPoint item = null;
        ResponseDTO responseDTO = null;
        item = pointService.getPointByEmail(userPointDTO.getEmail());
        if (item == null) {
            throw new NotFoundException(errorDocument + userPointDTO.getEmail());
        }

        if (item != null) {
            String email = userPointDTO.getEmail();
            UserPointDTO subDTO = PointsMapper.INSTANCE.toDTO(item);
            List<PointsUser> filteredList = subDTO.getPoints().stream()
                    .filter(point -> email.equals(point.getEmail()))
                    .collect(Collectors.toList());
            PointRDTO record = new PointRDTO(filteredList.get(0).getPoints(),
                    message.concat(filteredList.get(0).getPoints().toString()));

            responseDTO = new ResponseDTO(record, ActivityHttpStatus.OK.value(), new ArrayList<>());
        }
            return responseDTO;
        });
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO>  getUserType(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
        Long itemId = pointService.getTypeUser(userPointDTO);
        String emailUserCurrent = itemId == 1  ? userPointDTO.getEmail(): userPointDTO.getEmailFamily();
        ResponseDTO response = new ResponseDTO(new UserDTO(itemId, null,emailUserCurrent), ActivityHttpStatus.OK.value(),
                new ArrayList<>());
            return response;
        });
    }

    @PostMapping("/dati/standard")
    public Mono<ResponseDTO> savePoints(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
            Boolean operations = userPointDTO.getOperation() == null ? false : userPointDTO.getOperation();
            userPointDTO.setOperation(operations);
            UserPoint points = pointService.savePoint(userPointDTO);
            UserPointDTO subDTO = PointsMapper.INSTANCE.toDTO(points);
            ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }


    @PostMapping("/dati/user")
    public Mono<ResponseDTO> saveUserByPoints(@RequestBody UserPointDTO userPointDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {

            userPointDTO.setEmailFamily(userPointDTO.getEmail());
            Boolean itemId = pointService.saveUser(userPointDTO);
            String emailUserCurrent = userPointDTO.getType().equals(1L)  ? userPointDTO.getEmail(): userPointDTO.getEmailFamily();
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId, emailUserCurrent),
            ActivityHttpStatus.OK.value(), new ArrayList<>());
            return response;
        });
    }

    @PostMapping("child")
    public Mono<ResponseDTO>  getEmailChild(@RequestBody UserPointDTO userPointDTO) throws Exception {
        return Mono.fromCallable(() -> {
        String email = userPointDTO.getEmail();
        UserPoint sub = pointService.getPointByEmail(email);
        UserPointDTO subDTO = PointsMapper.INSTANCE.toDTO(sub);
        ResponseDTO response = new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
            return response;
        });

    }
}

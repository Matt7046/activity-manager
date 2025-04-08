package com.pointService;

import com.common.data.Point;
import com.common.dto.PointRDTO;
import com.common.dto.PointsDTO;
import com.common.dto.ResponseDTO;
import com.common.dto.UserDTO;
import com.common.exception.NotFoundException;
import com.common.mapper.PointsMapper;
import com.common.transversal.PointsUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
    public  Mono<ResponseDTO> findByEmail(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
        Point item = null;
        ResponseDTO responseDTO = null;
        item = pointService.getPointByEmail(pointsDTO.getEmail());
        if (item == null) {
            throw new NotFoundException(errorDocument + pointsDTO.getEmail());
        }

        if (item != null) {
            String email = pointsDTO.getEmail();
            PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(item);
            List<PointsUser> filteredList = subDTO.getPoints().stream()
                    .filter(point -> email.equals(point.getEmail()))
                    .collect(Collectors.toList());
            PointRDTO record = new PointRDTO(filteredList.get(0).getPoints(),
                    message.concat(filteredList.get(0).getPoints().toString()));

            responseDTO = new ResponseDTO(record, HttpStatus.OK.value(), new ArrayList<>());
        }
            return responseDTO;
        });
    }

    @PostMapping("/dati")
    public Mono<ResponseDTO>  getUserType(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
        Long itemId = pointService.getTypeUser(pointsDTO);
        String emailUserCurrent = itemId == 1  ? pointsDTO.getEmail(): pointsDTO.getEmailFamily();
        ResponseDTO response = new ResponseDTO(new UserDTO(itemId, null,emailUserCurrent), HttpStatus.OK.value(),
                new ArrayList<>());
            return response;
        });
    }

    @PostMapping("/dati/standard")
    public Mono<ResponseDTO> savePoints(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
            Boolean operations = pointsDTO.getOperation() == null ? false : pointsDTO.getOperation();
            Point points = pointService.savePoint(pointsDTO, operations);
            PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(points);
            ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }

    @PostMapping("/dati/standard/rollback")
    public Mono<ResponseDTO> savePointsRollBack(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
            Boolean operations = pointsDTO.getOperation() == null ? false : pointsDTO.getOperation();
            Point points = pointService.savePoint(pointsDTO, !operations);
            PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(points);
            ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(),
                    new ArrayList<>());
            return response;
        });
    }

    @PostMapping("/dati/user")
    public Mono<ResponseDTO> saveUserByPoints(@RequestBody PointsDTO pointsDTO) {
        // Una volta completata la chiamata points, salva il log e crea la response
        return Mono.fromCallable(() -> {

            pointsDTO.setEmailFamily(pointsDTO.getEmail());
            Boolean itemId = pointService.saveUser(pointsDTO);
            String emailUserCurrent = pointsDTO.getType().equals(1L)  ? pointsDTO.getEmail(): pointsDTO.getEmailFamily();
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId, emailUserCurrent),
                    HttpStatus.OK.value(), new ArrayList<>());
            return response;
        });
    }

    @PostMapping("child")
    public Mono<ResponseDTO>  getEmailChild(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
        String email = pointsDTO.getEmail();
        Point sub = pointService.getPointByEmail(email);
        PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(sub);
        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
            return response;
        });

    }
}

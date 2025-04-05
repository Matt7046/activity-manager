package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.data.Points;
import com.common.dto.PointsDTO;
import com.common.dto.PointsRDTO;
import com.common.dto.ResponseDTO;
import com.common.dto.UserDTO;
import com.common.exception.NotFoundException;
import com.common.mapper.PointsMapper;

import com.common.transversal.PointsUser;

import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/points")
public class PointsController {

    @Autowired
    private PointsService pointsService;

    @PostMapping("find")
    public ResponseDTO findByEmail(@RequestBody PointsDTO pointsDTO) throws Exception {
        Points item = null;
        ResponseDTO responseDTO = null;
        item = pointsService.getPointsByEmail(pointsDTO.getEmail());
        if (item == null) {
            throw new NotFoundException("Documento non trovato con identificativo: " + pointsDTO.getEmail());
        }

        if (item != null) {
            String email = pointsDTO.getEmail();
            PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(item);
            List<PointsUser> filteredList = subDTO.getPoints().stream()
                    .filter(point -> email.equals(point.getEmail()))
                    .collect(Collectors.toList());
            PointsRDTO record = new PointsRDTO(filteredList.get(0).getPoints(),
                    "I Points a disposizione sono: ".concat(filteredList.get(0).getPoints().toString()));

            responseDTO = new ResponseDTO(record, HttpStatus.OK.value(), new ArrayList<>());
        }
        return responseDTO;
    }

    @PostMapping("/dati")
    public ResponseEntity<ResponseDTO> getUserType(@RequestBody PointsDTO pointsDTO) throws Exception {

        Long itemId = pointsService.getTypeUser(pointsDTO);
        String emailUserCurrent = itemId == 1  ? pointsDTO.getEmail(): pointsDTO.getEmailFamily();
        ResponseDTO response = new ResponseDTO(new UserDTO(itemId, null,emailUserCurrent), HttpStatus.OK.value(),
                new ArrayList<>());
        return ResponseEntity.ok(response);

    }

    @PostMapping("/dati/standard")
    public Mono<ResponseDTO> savePoints(@RequestBody PointsDTO pointsDTO) throws Exception {
        return Mono.fromCallable(() -> {
            Boolean operations = pointsDTO.getOperation() == null ? false : pointsDTO.getOperation();
            Points points = pointsService.savePoints(pointsDTO, operations);
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
            Points points = pointsService.savePoints(pointsDTO, !operations);
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
            Boolean itemId = pointsService.saveUser(pointsDTO);
            String emailUserCurrent = pointsDTO.getType().equals(1L)  ? pointsDTO.getEmail(): pointsDTO.getEmailFamily();
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId, emailUserCurrent),
                    HttpStatus.OK.value(), new ArrayList<>());
            return response;
        });
    }

    @PostMapping("child")
    public ResponseDTO getEmailChild(@RequestBody PointsDTO pointsDTO) throws Exception {

        String email = pointsDTO.getEmail();
        Points sub = pointsService.getPointsByEmail(email);
        PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(sub);
        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        return response;

    }
}

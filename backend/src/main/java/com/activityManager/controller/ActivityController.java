package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.activityManager.data.Activity;
import com.activityManager.data.LogActivity;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.LogActivityDTO;
import com.activityManager.dto.PointsDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.exception.NotFoundException;
import com.activityManager.mapper.ActivityMapper;
import com.activityManager.mapper.LogActivityMapper;
import com.activityManager.service.ActivityService;
import com.activityManager.service.PointsService;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private PointsService pointsService;

    @PostMapping("")
    public ResponseDTO getActivities(@RequestBody PointsDTO pointsDTO) {
        String email = pointsDTO.getEmail();
        List<Activity> sub = activityService.findAllByEmail(email);
        List<ActivityDTO> subDTO = sub.stream()
                .map(ActivityMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());
        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        return response;
    }

    @PostMapping("/find")
    public ResponseDTO findByIdentificativo(@RequestBody PointsDTO pointsDTO) {
        Activity item = null;
        ResponseDTO responseDTO = null;
        item = activityService.findByIdentificativo(pointsDTO.get_id());
        if (item == null) {
            throw new NotFoundException("Documento non trovato con identificativo: " + pointsDTO.get_id());
        }

        if (item != null) {
            ActivityDTO subDTO = ActivityMapper.INSTANCE.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        }

        return responseDTO;
    }

    @PostMapping("/log")
    public ResponseDTO logActivityByEmail(@RequestBody PointsDTO pointsDTO) {
        ResponseDTO responseDTO = null;
        Sort sort = Sort.by(Sort.Order.desc("date"));
        List<LogActivity> sub = activityService.logAttivitaByEmail(pointsDTO, sort);
        List<LogActivityDTO> logAttivitaUnica = sub.stream()
                .map(LogActivityMapper.INSTANCE::toDTO)

                .collect(Collectors.toList());
        responseDTO = new ResponseDTO(logAttivitaUnica, HttpStatus.OK.value(), new ArrayList<>());
        return responseDTO;
    }

    @PostMapping("/dati")
    public ResponseDTO savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) throws Exception {
        ResponseDTO responseDTO = null;

        PointsDTO pointsDTO = new PointsDTO();
        pointsDTO.setPoint(logActivityDTO.getPoints());
        pointsDTO.setEmail(logActivityDTO.getEmail());
        pointsDTO.setEmailFamily(logActivityDTO.getEmailFamily());
        pointsDTO.setUsePoints(logActivityDTO.getUsePoints());
        pointsService.savePoints(pointsDTO, false);
        LogActivity sub = activityService.saveLogActivity(logActivityDTO);
        LogActivityDTO dto = LogActivityMapper.INSTANCE.toDTO(sub);
        responseDTO = new ResponseDTO(dto, HttpStatus.OK.value(), new ArrayList<>());

        return responseDTO;
    }

}

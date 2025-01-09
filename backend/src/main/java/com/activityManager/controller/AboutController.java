package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.exception.NotFoundException;
import com.activityManager.service.ActivityService;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController

@RequestMapping("api/about")
public class AboutController {

    @Autowired
    private ActivityService ActivityService;

    @DeleteMapping("/{identificativo}")
    public ResponseDTO deleteByIdentificativo(@PathVariable String identificativo) {
        Long item = null;
        ResponseDTO responseDTO;
        item = ActivityService.deleteByIdentificativo(identificativo);
        ActivityDTO subDTO = new ActivityDTO();
        subDTO.set_id(identificativo);
        if (item != null && !item.equals(0L)) {
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        } else {
            throw new NotFoundException("Documento non trovato con identificativo: " + identificativo);
        }
        return responseDTO;

    }

    @PostMapping("/dati")
    public ResponseEntity<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        String itemId = ActivityService.saveActivity(activityDTO);
        ResponseDTO response = new ResponseDTO(itemId, HttpStatus.OK.value(), new ArrayList<>());
        return ResponseEntity.ok(response);
    }
}

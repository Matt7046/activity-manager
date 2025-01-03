package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.activityManager.EncryptDecryptConverter;
import com.activityManager.data.Activity;
import com.activityManager.data.Points;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.PointsDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.dto.UserDTO;
import com.activityManager.mapper.ActivityMapper;
import com.activityManager.mapper.PointsMapper;
import com.activityManager.service.PointsService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/register")
public class RegisterController {

    @Autowired
    private PointsService pointsService;

    @PostMapping("")
    public ResponseDTO getEmailChild(@RequestBody PointsDTO pointsDTO) {
        try {
        // String[] texts = { "Ciao, mondo!", "Benvenuto in Java", "Programmazione è
        // divertente" };
        String email = pointsDTO.getEmail();
        Points sub = pointsService.getPointsByEmail(email);        // mapping
        
        ResponseDTO response = new ResponseDTO(sub.getEmailFigli(), HttpStatus.OK.value(), new ArrayList<>());
        return response;
        }
        catch (Exception e) {
            // Gestione degli errori: puoi personalizzarlo in base al tuo scenario
            List<String> errori = new ArrayList<>();
            errori.add(e.getMessage());
            errori.add(e.getLocalizedMessage());
            ResponseDTO errorResponse = new ResponseDTO(new UserDTO(), HttpStatus.INTERNAL_SERVER_ERROR, errori);
            return  errorResponse;        
        }  
    }

    @PostMapping("/dati")
    public ResponseEntity<ResponseDTO> saveRegister(@RequestBody PointsDTO pointsDTO) {
        try {
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            pointsDTO.setEmailFamily(pointsDTO.getEmail());
            Boolean itemId = pointsService.saveFamily(pointsDTO);

            // Crea una risposta
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId), HttpStatus.OK.value(), new ArrayList<>());

            // Ritorna una ResponseEntity con lo status HTTP
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Gestione degli errori: puoi personalizzarlo in base al tuo scenario
            List<String> errori = new ArrayList<>();
            errori.add(e.getMessage());
            errori.add(e.getLocalizedMessage());
            ResponseDTO errorResponse = new ResponseDTO(new UserDTO(), HttpStatus.INTERNAL_SERVER_ERROR, errori);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body(errorResponse);
        }
    }

    @PostMapping("/dati/standard")
    public ResponseEntity<ResponseDTO> savePointsByTypeStandard(@RequestBody PointsDTO pointsDTO) {
        try {
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            Points itemId = pointsService.savePointsByTypeStandard(pointsDTO, true);

            // Crea una risposta
            ResponseDTO response = new ResponseDTO(itemId, HttpStatus.OK.value(), new ArrayList<>());

            // Ritorna una ResponseEntity con lo status HTTP
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Gestione degli errori: puoi personalizzarlo in base al tuo scenario
            List<String> errori = new ArrayList<>();
            errori.add(e.getMessage());
            errori.add(e.getLocalizedMessage());
            ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.INTERNAL_SERVER_ERROR, errori);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR.value()).body(errorResponse);
        }
    }
}

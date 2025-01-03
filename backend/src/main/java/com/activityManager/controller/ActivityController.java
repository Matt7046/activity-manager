package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.activityManager.EncryptDecryptConverter;
import com.activityManager.data.Activity;
import com.activityManager.data.LogActivity;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.LogActivityDTO;
import com.activityManager.dto.PointsDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.mapper.ActivityMapper;
import com.activityManager.mapper.LogActivityMapper;
import com.activityManager.service.ActivityService;
import com.activityManager.service.PointsService;
import com.activityManager.trasversali.PointsUser;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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

        // String[] texts = { "Ciao, mondo!", "Benvenuto in Java", "Programmazione è
        // divertente" };
        String email = pointsDTO.getEmail();        
        List<Activity> sub = activityService.findAllByEmail(email);
        // mapping
        List<ActivityDTO> subDTO = sub.stream()
                .map(ActivityMapper.INSTANCE::toDTO)
                .collect(Collectors.toList());

        ResponseDTO response = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        return response;
    }

    @GetMapping("/{identificativo}")
    public ResponseDTO findByIdentificativo(@PathVariable String identificativo) {
        List<String> errori = new ArrayList<>();
        Activity item = null; // Inizializza l'oggetto come null
        ResponseDTO responseDTO;

        try {
            // Tentativo di trovare il documento
            item = activityService.findByIdentificativo(identificativo);
            if (item == null) {
                throw new RuntimeException("Documento non trovato con identificativo: " + identificativo);
            }
        } catch (Exception e) {
            // Gestione dell'errore: log e aggiunta dei dettagli
            errori.add("Errore: " + e.getMessage());
        }

        if (item != null) {
            // Mappatura se l'oggetto è stato trovato
            ActivityDTO subDTO = ActivityMapper.INSTANCE.toDTO(item);
            responseDTO = new ResponseDTO(subDTO, HttpStatus.OK.value(), new ArrayList<>());
        } else {
            // Risposta in caso di errore o elemento non trovato
            ActivityDTO subDTO = new ActivityDTO(); // Inizializza DTO vuoto
            responseDTO = new ResponseDTO(subDTO, HttpStatus.NOT_FOUND.value(), errori); // 404 con dettagli errore
        }

        return responseDTO;
    }

    @PostMapping("/log")
    public ResponseDTO logActivityByEmail(@RequestBody PointsDTO pointsDTO) {
        ResponseDTO responseDTO = null;
        List<String> errori = new ArrayList<>();
        try {
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            Sort sort = Sort.by(Sort.Order.desc("date"));
            List<LogActivity> sub = activityService.logAttivitaByEmail(pointsDTO, sort);
            List<LogActivityDTO> logAttivitaUnica = sub.stream()
                    .map(LogActivityMapper.INSTANCE::toDTO) // Converte ogni elemento in ActivityDTO
                    // .map(ActivityDTO::getLogAttivita) // Estrae il campo logAttivita
                    .collect(Collectors.toList());
            responseDTO = new ResponseDTO(logAttivitaUnica, HttpStatus.OK.value(), new ArrayList<>());

            // Crea una risposta
        } catch (Exception e) {
            // Gestione dell'errore: log e aggiunta dei dettagli
            errori.add("Errore: " + e.getMessage());
        }

        if (errori.size() > 0) {
            // Risposta in caso di errore o elemento non trovato
            ActivityDTO subDTO = new ActivityDTO(); // Inizializza DTO vuoto
            responseDTO = new ResponseDTO(subDTO, HttpStatus.INTERNAL_SERVER_ERROR.value(), errori);
        }
        return responseDTO;
    }

    @PostMapping("/dati")
    public ResponseDTO savePointsAndLog(@RequestBody LogActivityDTO logActivityDTO) {
        ResponseDTO responseDTO = null;

        List<String> errori = new ArrayList<>();
        try {
            PointsDTO pointsDTO = new PointsDTO();
            pointsDTO.setPoint(logActivityDTO.getPoints());
            pointsDTO.setEmail(logActivityDTO.getEmail());
            pointsDTO.setEmailFamily(logActivityDTO.getEmailFamily());
            pointsDTO.setUsePoints(logActivityDTO.getUsePoints());
            pointsService.savePointsByTypeStandard(pointsDTO, false);

            LogActivity sub = activityService.saveLogActivity(logActivityDTO);

            LogActivityDTO dto = LogActivityMapper.INSTANCE.toDTO(sub);
            // Crea una risposta
            responseDTO = new ResponseDTO(dto, HttpStatus.OK.value(), new ArrayList<>());
        } catch (Exception e) {
            // Gestione dell'errore: log e aggiunta dei dettagli
            errori.add("Errore: " + e.getMessage());
        }

        if (errori.size() > 0) {
            // Mappatura se l'oggetto è stato trovato
            // Risposta in caso di errore o elemento non trovato
            ActivityDTO subDTO = new ActivityDTO(); // Inizializza DTO vuoto
            responseDTO = new ResponseDTO(subDTO, HttpStatus.INTERNAL_SERVER_ERROR.value(), errori);

        }
        return responseDTO;
    }

}

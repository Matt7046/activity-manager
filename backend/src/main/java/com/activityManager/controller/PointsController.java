package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.activityManager.data.Points;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.PointsDTO;
import com.activityManager.dto.PointsRDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.dto.UserDTO;
import com.activityManager.exception.NotFoundException;
import com.activityManager.mapper.PointsMapper;
import com.activityManager.service.PointsService;
import com.activityManager.service.RegisterService;
import com.activityManager.trasversali.PointsUser;
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
@RequestMapping("api/points")
public class PointsController {

    @Autowired
    private PointsService pointsService;

    @Autowired
    private RegisterService registerService;

    @PostMapping("")
    public ResponseDTO findByEmail(@RequestBody PointsDTO pointsDTO) throws Exception {
        List<String> errori = new ArrayList<>();
        Points item = null; // Inizializza l'oggetto come null
        ResponseDTO responseDTO = null;

     
            // Tentativo di trovare il documento
            item = pointsService.getPointsByEmail(pointsDTO.getEmail());
            if (item == null) {
                throw new NotFoundException("Documento non trovato con identificativo: " + pointsDTO.getEmail());
            }     

   
            if (item != null) {
                String email = pointsDTO.getEmail();
                // Mappatura se l'oggetto è stato trovato
                PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(item);
                List<PointsUser> filteredList = subDTO.getPoints().stream()
                .filter(point -> email.equals(point.getEmail()))
                .collect(Collectors.toList());
                PointsRDTO record = new PointsRDTO(filteredList.get(0).getPoints(),"I Points a disposizione sono: ".concat(filteredList.get(0).getPoints().toString()));

                responseDTO = new ResponseDTO(record, HttpStatus.OK.value(), new ArrayList<>());
            }
        return responseDTO;
    }

    @PostMapping("/dati")
    public ResponseEntity<ResponseDTO> getUserType(@RequestBody PointsDTO pointsDTO) throws Exception {
        
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            Long itemId = registerService.getTypeUser(pointsDTO);
            // Crea una risposta
            ResponseDTO response = new ResponseDTO(new UserDTO(itemId, null), HttpStatus.OK.value(), new ArrayList<>());

            // Ritorna una ResponseEntity con lo status HTTP
            return ResponseEntity.ok(response);
        
    }

    @PostMapping("/dati/standard")
    public ResponseEntity<ResponseDTO> savePoints(@RequestBody PointsDTO pointsDTO) throws Exception {
        
            // Salva i dati e ottieni l'ID o l'oggetto salvato
            String email = pointsDTO.getEmailFamily();
            Points itemId = pointsService.savePoints(pointsDTO, true);
            PointsDTO subDTO = PointsMapper.INSTANCE.toDTO(itemId);
            List<PointsUser> filteredList = subDTO.getPoints().stream()
            .filter(point -> email.equals(point.getEmail()))
            .collect(Collectors.toList());
            PointsRDTO record = new PointsRDTO(filteredList.get(0).getPoints(),"I Points a disposizione sono: ".concat(filteredList.get(0).getPoints().toString()));
            // Crea una risposta
            ResponseDTO response = new ResponseDTO(record, HttpStatus.OK.value(), new ArrayList<>());

            // Ritorna una ResponseEntity con lo status HTTP
            return ResponseEntity.ok(response);

        
    }
}

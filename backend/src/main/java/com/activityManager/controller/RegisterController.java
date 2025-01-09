package com.activityManager.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.activityManager.data.Points;
import com.activityManager.dto.PointsDTO;
import com.activityManager.dto.ResponseDTO;
import com.activityManager.dto.UserDTO;
import com.activityManager.service.PointsService;
import com.activityManager.service.RegisterService;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/register")
public class RegisterController {

    @Autowired
    private PointsService pointsService;

    @Autowired
    private RegisterService registerService;

    @PostMapping("child")
    public ResponseDTO getEmailChild(@RequestBody PointsDTO pointsDTO) throws Exception {        
            
            String email = pointsDTO.getEmail();
            Points sub = pointsService.getPointsByEmail(email);
            ResponseDTO response = new ResponseDTO(sub.getEmailFigli(), HttpStatus.OK.value(), new ArrayList<>());
            return response;
        
    }

    @PostMapping("/dati")
    public ResponseDTO saveUserByPoints(@RequestBody PointsDTO pointsDTO) throws Exception {
     
            pointsDTO.setEmailFamily(pointsDTO.getEmail());
            Boolean itemId = registerService.saveUser(pointsDTO);
            ResponseDTO response = new ResponseDTO(new UserDTO(null, itemId), HttpStatus.OK.value(), new ArrayList<>());
            return response;

        
    }   
}

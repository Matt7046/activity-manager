package com.webapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapp.dto.ResponseDTO;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.service.SubPromiseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("api/about")
@CrossOrigin(origins = "http://localhost:3000")
public class AboutController {

    @Autowired
    private SubPromiseService subPromiseService;

 
    @DeleteMapping("/{identificativo}")
    public ResponseDTO deleteByIdentificativo(@PathVariable String identificativo) {
        Long item = subPromiseService.deleteByIdentificativo(identificativo);
    //SubPromise item  = new SubPromise();
   
        return new ResponseDTO(item, HttpStatus.OK);
    }

  @PostMapping("/dati")
public ResponseEntity<ResponseDTO> saveSubPromise(@RequestBody SubPromiseDTO subPromiseDTO) {
    try {
        // Salva i dati e ottieni l'ID o l'oggetto salvato
        String itemId = subPromiseService.saveSubPromise(subPromiseDTO);

        // Crea una risposta
        ResponseDTO response = new ResponseDTO(itemId, HttpStatus.OK);

        // Ritorna una ResponseEntity con lo status HTTP
        return ResponseEntity.ok(response);

    } catch (Exception e) {
        // Gestione degli errori: puoi personalizzarlo in base al tuo scenario
        ResponseDTO errorResponse = new ResponseDTO(null, HttpStatus.INTERNAL_SERVER_ERROR);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}

}

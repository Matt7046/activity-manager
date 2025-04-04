package com.activityService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.common.configurations.EncryptDecryptConverter;
import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;

import reactor.core.publisher.Mono;

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
    private AboutService aboutService;

    @Autowired
    private AboutStateMachineService aboutStateMachineService;


    @Autowired
	private EncryptDecryptConverter encryptDecryptConverter;


    @DeleteMapping("/{identificativo}")
    public Mono<ResponseDTO> deleteByIdentificativo(@PathVariable String identificativo) throws Exception {
        identificativo = encryptDecryptConverter.decrypts(identificativo);   
        return aboutStateMachineService.callActivityDeleteService(identificativo);

    }
    @PostMapping("/dati")
    public Mono<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        return aboutStateMachineService.callActivitySaveService(activityDTO);

    }
}

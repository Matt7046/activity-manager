package com.aboutService.controller;

import com.aboutService.service.AboutService;
import com.aboutService.service.AboutWebService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.configurations.EncryptDecryptConverter;
import com.common.dto.ActivityDTO;
import com.common.dto.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
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
	private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private AboutWebService aboutWebService;



    @DeleteMapping("/{identificativo}")
    public Mono<ResponseDTO> deleteByIdentificativo(@PathVariable String identificativo) throws Exception {
        identificativo = encryptDecryptConverter.decrypts(identificativo);   
        return aboutWebService.callActivityDeleteService(identificativo);

    }
    @PostMapping("/dati")
    public Mono<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        return aboutWebService.callActivitySaveService(activityDTO);

    }
}

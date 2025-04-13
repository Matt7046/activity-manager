package com.aboutService.controller;

import com.aboutService.processor.AboutDeleteActivityProcessor;
import com.aboutService.processor.AboutSaveActivityProcessor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.structure.ResponseDTO;
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
	private EncryptDecryptConverter encryptDecryptConverter;

    @Autowired
    private AboutSaveActivityProcessor aboutSaveActivityProcessor;
    @Autowired
    private AboutDeleteActivityProcessor aboutDeleteActivityProcessor;


    @DeleteMapping("/{identificativo}")
    public Mono<ResponseDTO> deleteByIdentificativo(@PathVariable String identificativo) throws Exception {
        identificativo = encryptDecryptConverter.decrypts(identificativo);   
        return aboutDeleteActivityProcessor.callActivityDeleteService(identificativo);

    }
    @PostMapping("/dati")
    public Mono<ResponseDTO> saveActivity(@RequestBody ActivityDTO activityDTO) {
        return aboutSaveActivityProcessor.callActivitySaveService(activityDTO);

    }
}

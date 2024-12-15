package com.webapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;
import com.webapp.mapper.SubPromiseMapper;
import com.webapp.repository.SubPromiseRepository;

import java.util.List;

@Service
public class SubPromiseService {
    @Autowired
    private SubPromiseRepository subPromiseRepository;


    public List<SubPromise> findAll() {
        return subPromiseRepository.findAll();
    }

    public SubPromise findByIdentificativo(String identificativo)  {

        return subPromiseRepository.findByIdentificativo(identificativo);
    }

    public Long deleteByIdentificativo(String identificativo) {

        return subPromiseRepository.deleteByIdentificativo(identificativo);
    }

    public String saveSubPromise(SubPromiseDTO subPromiseDTO) {
        return subPromiseRepository.saveSubPromise(subPromiseDTO);       
    }

    public SubPromise save(SubPromiseDTO subPromiseDTO) {
            SubPromise subDTO = SubPromiseMapper.INSTANCE.fromDTO(subPromiseDTO);

        return subPromiseRepository.save(subDTO);
    }
}

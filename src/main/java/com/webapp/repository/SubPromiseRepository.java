package com.webapp.repository;




import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.webapp.data.SubPromise;

public interface SubPromiseRepository extends MongoRepository<SubPromise, String> {
    // Puoi aggiungere metodi personalizzati se necessario
     List<SubPromise>  findAll();

     @Query("{'_id': ?0}")
    SubPromise findByIdentificativo(String id);


    @Query(value = "{'_id': ?0}", delete = true)
        Long deleteByIdentificativo(String id);


        
        
       
}
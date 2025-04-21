package com.repository.activity;



import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.common.data.activity.Activity;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Activity>  findAll();

     @Query("{'_id': ?0}")
    Activity findByIdentificativo(String id);


    @Query(value = "{'_id': ?0}", delete = true)
        Long deleteByIdentificativo(String id);

        @Query("{'email': ?0}")
    List<Activity> findAllByEmail(String email);


        
        
       
}
package com.webapp.repository.Activity;




import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.webapp.data.Activity;

public interface ActivityRepository extends MongoRepository<Activity, String>, ActivityCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Activity>  findAll();

     @Query("{'_id': ?0}")
    Activity findByIdentificativo(String id);


    @Query(value = "{'_id': ?0}", delete = true)
        Long deleteByIdentificativo(String id);


        
        
       
}
package com.activityManager.repository.register;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.activityManager.data.Points;

public interface RegisterRepository extends MongoRepository<Points, String>, RegisterCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Points>  findAll();

   
       
}
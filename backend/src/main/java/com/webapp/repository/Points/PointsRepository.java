package com.webapp.repository.Points;




import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.webapp.data.Points;

public interface PointsRepository extends MongoRepository<Points, String>, PointsCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Points>  findAll();

     @Query("{'email': ?0}")
    Points findByEmail(String email);
        
        
       
}
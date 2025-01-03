package com.activityManager.repository.points;




import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.activityManager.data.Points;

public interface PointsRepository extends MongoRepository<Points, String>, PointsCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Points>  findAll();

     @Query("{'email': ?0, 'type': ?1}")
    Points findByEmail(String email, Long type);

    @Query("{'emailFigli': {$in: [?0]}}")
    List<Points> findByOnFigli(String email);
    
    @Query("{'email': ?0}")
    Points  findByEmailOnEmail(String email);
       
       
}
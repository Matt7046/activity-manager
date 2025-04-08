package com.repository.point;


import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.common.data.Point;

@Repository
public interface PointRepository extends MongoRepository<Point, String>, PointCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Point>  findAll();

     @Query("{'email': ?0, 'type': ?1}")
    Point findByEmail(String email, Long type);

    @Query("{'emailFigli': {$in: [?0]}}")
    List<Point> findByOnFigli(String email);
    
    @Query("{'email': ?0}")
    Point  findByEmailOnEmail(String email);
       
       
}
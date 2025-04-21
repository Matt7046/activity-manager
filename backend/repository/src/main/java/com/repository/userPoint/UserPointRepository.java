package com.repository.userPoint;


import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.common.data.user.UserPoint;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPointRepository extends MongoRepository<UserPoint, String> {
    // Puoi aggiungere metodi personalizzati se necessario
     List<UserPoint>  findAll();

     @Query("{'email': ?0, 'type': ?1}")
     UserPoint findByEmail(String email, Long type);

    @Query("{'emailFigli': {$in: [?0]}}")
    List<UserPoint> findByOnFigli(String email);
    
    @Query("{'email': ?0}")
    UserPoint findByEmailOnEmail(String email);

    @Aggregation(pipeline = {
            "{ $match: { $or: [ { 'email': ?0 }, { 'emailFigli': ?0 } ] } }",
            "{ $sort: { email: -1 } }",  // forza i risultati con email al primo posto (priorità a 'email')
            "{ $limit: 1 }"
    })
    UserPoint findFirstMatchByEmailOrFigli(String email);
       
       
}

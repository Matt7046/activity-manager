package com.userPointService.repository;


import java.util.List;

import com.common.data.user.UserPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPointRepository extends MongoRepository<UserPoint, String> {
    // Puoi aggiungere metodi personalizzati se necessario
     List<UserPoint>  findAll();

     @Query("{'email': ?0, 'type': ?1}")
     UserPoint findByEmailAndType(String email, Long type);

    @Query("{'emailFigli': {$in: [?0]}}")
    UserPoint findByOnFigli(String email);
    
    @Query(value = "{ 'emailFigli': { '$in': ?0 } }")
    List<UserPoint> findByEmailIn(List<String> emailFigli);

    @Query("{'email': ?0}")
    UserPoint findUserByEmail(String email);

    @Query(value = "{ '$or': [ { 'email': ?0 }, {'emailFigli': {$in: [?0]}} ] }")
    UserPoint findFirstMatchByEmailOrFigli(String email);

    @Query(value = "{ '$and': [ { 'email': ?0 },{ 'password': ?1 }] }")
    UserPoint findByPointEmailAndPassword(String email, String password);;

    @Query("{ 'pointFigli': { $elemMatch: { 'email': ?0, 'password': ?1 } } }")
    UserPoint findByPointFigliEmailAndPassword(String email, String password);;
}

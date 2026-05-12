package com.userPointService.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import com.common.data.user.UserPoint;

@Repository
public interface UserPointRepository extends MongoRepository<UserPoint, String> {

    List<UserPoint> findAll();

    @Query("{'email': ?0, 'type': ?1 , 'status': 1}")
    UserPoint findByEmailAndType(String email, Long type);

    @Query("{'emailFigli': {$in: [?0]}}")
    UserPoint findByOnFigli(String email);

    /** Tutti i genitori che hanno {@code email} (cifrata o in chiaro) in {@code emailFigli}. */
    @Query("{'emailFigli': {$in: [?0]}}")
    List<UserPoint> findAllParentsHavingChildInEmailFigli(String email);

    @Query(value = "{ 'emailFigli': { '$in': ?0 } }")
    List<UserPoint> findByEmailIn(List<String> emailFigli);

    @Query("{'email': ?0, 'status': 1}")
    UserPoint findUserByEmail(String email);

    @Query("{'email': ?0}")
    UserPoint findUserByEmailAll(String email);

    @Query("{ 'email': { $in: ?0 } }")
    List<UserPoint> findAllByEmailIn(List<String> emails);

    @Query(value = "{ '$or': [ { 'email': ?0 }, {'emailFigli': {$in: [?0]}} ] }")
    UserPoint findFirstMatchByEmailOrFigli(String email);

    @Query(value = "{ '$and': [ { 'email': ?0 }, { 'password': ?1 }, { 'status': 1 } ] }")
    UserPoint findByPointEmailAndPassword(String email, String password);

    @Query("{ 'pointFigli': { $elemMatch: { 'email': ?0, 'password': ?1 } } }")
    UserPoint findByPointFigliEmailAndPassword(String email, String password);

    @Query("{ 'email': ?0 }")
    @Update("{ '$set': { 'status': ?1 } }")
    Integer updateStatus(String string, Integer status);

}

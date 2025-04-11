package com.repository.register;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.common.data.UserPoint;

@Repository
public interface RegisterRepository extends MongoRepository<UserPoint, String>, RegisterCustomRepository {
  
   
       
}
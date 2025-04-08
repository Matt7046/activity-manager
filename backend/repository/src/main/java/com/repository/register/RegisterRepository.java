package com.repository.register;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.common.data.Point;

@Repository
public interface RegisterRepository extends MongoRepository<Point, String>, RegisterCustomRepository {
  
   
       
}
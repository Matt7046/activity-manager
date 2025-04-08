package com.repository.family;

import com.common.data.LogFamily;
import com.common.data.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyRepository extends MongoRepository<LogFamily, String>, FamilyCustomRepository {
  
   
       
}
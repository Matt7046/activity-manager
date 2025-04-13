package com.repository.logActivity;



import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.common.data.activity.LogActivity;

@Repository
public interface LogActivityRepository extends MongoRepository<LogActivity, String>, LogActivityCustomRepository {
  
     @Query("{'email': ?0}")
     List<LogActivity> findLogByEmail(String email,Sort sort);
        
        
       
}
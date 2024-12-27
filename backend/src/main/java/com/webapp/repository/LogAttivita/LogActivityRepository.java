package com.webapp.repository.LogAttivita;




import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.webapp.data.LogActivity;

public interface LogActivityRepository extends MongoRepository<LogActivity, String>, LogActivityCustomRepository {
  
     @Query("{'email': ?0}")
     List<LogActivity> findLogByEmail(String email,Sort sort);
        
        
       
}
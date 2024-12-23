package com.webapp.repository.LogAttivita;




import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.webapp.data.LogAttivita;

public interface LogAttivitaRepository extends MongoRepository<LogAttivita, String>, LogAttivitaCustomRepository {
  
     @Query("{'email': ?0}")
     List<LogAttivita> findLogByEmail(String email);
        
        
       
}
package com.repository.register;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.common.data.Points;

@Repository
public interface RegisterRepository extends MongoRepository<Points, String>, RegisterCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
     List<Points>  findAll();

   
       
}
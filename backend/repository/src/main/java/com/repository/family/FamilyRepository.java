package com.repository.family;

import com.common.data.LogActivity;
import com.common.data.LogFamily;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends MongoRepository<LogFamily, String>, FamilyCustomRepository {

    @Query("{'receivedByEmail': ?0}")
    List<LogFamily> findLogByEmail(String email, Sort sort);
       
}
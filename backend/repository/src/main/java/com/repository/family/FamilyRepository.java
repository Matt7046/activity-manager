package com.repository.family;

import com.common.data.family.LogFamily;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FamilyRepository extends MongoRepository<LogFamily, String> {

    @Query("{'receivedByEmail': ?0}")
    List<LogFamily> findLogByEmail(String email, Pageable pageable);
       
}
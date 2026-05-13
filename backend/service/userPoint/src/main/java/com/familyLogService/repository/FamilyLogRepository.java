package com.familyLogService.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.common.data.family.LogFamily;

@Repository
public interface FamilyLogRepository extends MongoRepository<LogFamily, String> {

    @Query("{'receivedByEmail': ?0}")
    List<LogFamily> findLogByEmail(String email, Pageable pageable);
}

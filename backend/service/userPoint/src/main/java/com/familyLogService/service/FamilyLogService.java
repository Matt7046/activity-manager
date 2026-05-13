package com.familyLogService.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.common.data.family.LogFamily;
import com.common.data.user.UserPoint;
import com.familyLogService.repository.FamilyLogRepository;

@Service
public class FamilyLogService {

    @Autowired
    private FamilyLogRepository repository;

    @Transactional
    public LogFamily saveLogFamily(LogFamily family) {
        return repository.save(family);
    }

    @Transactional
    public List<LogFamily> getLogFamily(UserPoint user, Pageable pageable) {
        return repository.findLogByEmail(user.getEmail(), pageable);
    }
}

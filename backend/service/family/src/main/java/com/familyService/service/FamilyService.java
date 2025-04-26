package com.familyService.service;

import com.common.data.family.LogFamily;
import com.common.data.user.UserPoint;
import com.common.mapper.LogFamilyMapper;
import com.familyService.repository.FamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FamilyService {

    @Value("${message.document.points}")
    private String message;

    @Autowired
    private FamilyRepository repository;

    @Autowired
    private LogFamilyMapper logFamilyMapper;

    @Transactional
    public LogFamily saveLogFamily(LogFamily family) {        ;
        return  repository.save(family);
    }
    @Transactional
    public List<LogFamily> getLogFamily(UserPoint user, Pageable pageable) {
        return repository.findLogByEmail(user.getEmail(), pageable);
    }
}

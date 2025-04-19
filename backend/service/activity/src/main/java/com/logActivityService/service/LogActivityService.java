package com.logActivityService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.LogActivityMapper;
import com.repository.logActivity.LogActivityRepository;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.LogActivity;
import java.util.List;

@Service
public class LogActivityService {

    @Autowired
    private LogActivityRepository logActivityRepository;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public LogActivity saveLogActivity(LogActivityDTO activityDTO) {
        LogActivity sub = LogActivityMapper.INSTANCE.fromDTO(activityDTO);
        return logActivityRepository.save(sub);
    }

    public LogActivity deleteLogActivity(LogActivityDTO activityDTO) {
        LogActivity sub = LogActivityMapper.INSTANCE.fromDTO(activityDTO);
        logActivityRepository.delete(sub);
        return new LogActivity();
    }

    public List<LogActivity> logAttivitaByEmail(UserPointDTO userPointDTO,  Pageable pageable) {
        return logActivityRepository.findLogByEmail(encryptDecryptConverter.convert(userPointDTO.getEmail()), pageable);
    }
}

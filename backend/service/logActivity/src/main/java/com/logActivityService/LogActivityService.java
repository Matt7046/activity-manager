package com.logActivityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.common.dto.LogActivityDTO;
import com.common.dto.PointsDTO;
import com.common.mapper.LogActivityMapper;
import com.repository.logActivity.LogActivityRepository;
import com.common.configurations.EncryptDecryptConverter;
import com.common.data.LogActivity;
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

    public List<LogActivity> logAttivitaByEmail(PointsDTO pointsDTO, Sort sort) {
        return logActivityRepository.findLogByEmail(encryptDecryptConverter.convert(pointsDTO.getEmail()), sort);
    }
}

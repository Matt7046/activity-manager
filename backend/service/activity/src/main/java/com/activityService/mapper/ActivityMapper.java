package com.activityService.mapper;

import com.activityService.dto.ActivityDTO;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ActivityMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public abstract ActivityDTO toDTO(Activity activity);

    public abstract Activity fromDTO(ActivityDTO activityDTO);
}

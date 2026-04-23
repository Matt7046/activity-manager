package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import org.mapstruct.Mapper;
import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;
import org.springframework.beans.factory.annotation.Autowired;


@Mapper(componentModel = "spring")
public abstract class ActivityMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    // Da Entity a DTO
    public abstract ActivityDTO toDTO(Activity activity);


    // Da DTO a Entity
    public abstract Activity fromDTO(ActivityDTO activityDTO);
}




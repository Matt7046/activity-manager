package com.common.mapper;

import com.common.data.family.LogFamily;
import com.common.dto.family.LogFamilyDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface LogFamilyMapper {
    LogFamilyMapper INSTANCE = Mappers.getMapper(LogFamilyMapper.class);

    // Da Entity a DTO
    LogFamilyDTO toDTO(LogFamily logFamily);
    

    // Da DTO a Entity
    LogFamily fromDTO(LogFamilyDTO logFamilyDTO);
}




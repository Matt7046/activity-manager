package com.common.mapper;

import com.common.dto.user.UserPointDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.common.data.user.UserPoint;

@Mapper
public interface UserPointMapper {
    UserPointMapper INSTANCE = Mappers.getMapper(UserPointMapper.class);

    // Da Entity a DTO
    UserPointDTO toDTO(UserPoint points) throws Exception;
    

    // Da DTO a Entity
    UserPoint fromDTO(UserPointDTO userPointDto) throws Exception;
}




package com.common.mapper;

import com.common.dto.UserPointDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.common.data.UserPoint;

@Mapper
public interface PointsMapper {
    PointsMapper INSTANCE = Mappers.getMapper(PointsMapper.class);

    // Da Entity a DTO
    UserPointDTO toDTO(UserPoint points) throws Exception;
    

    // Da DTO a Entity
    UserPoint fromDTO(UserPointDTO userPointDto) throws Exception;
}




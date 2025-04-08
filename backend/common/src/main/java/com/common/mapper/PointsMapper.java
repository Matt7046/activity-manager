package com.common.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.common.data.Point;
import com.common.dto.PointsDTO;

@Mapper
public interface PointsMapper {
    PointsMapper INSTANCE = Mappers.getMapper(PointsMapper.class);

    // Da Entity a DTO
    PointsDTO toDTO(Point points) throws Exception;
    

    // Da DTO a Entity
    Point fromDTO(PointsDTO pointsDto) throws Exception;
}




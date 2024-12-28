package com.webapp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import com.webapp.data.Points;
import com.webapp.dto.PointsDTO;

@Mapper
public interface PointsMapper {
    PointsMapper INSTANCE = Mappers.getMapper(PointsMapper.class);

    // Da Entity a DTO
    PointsDTO toDTO(Points points) throws Exception;
    

    // Da DTO a Entity
    Points fromDTO(PointsDTO pointsDto) throws Exception;
}




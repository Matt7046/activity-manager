package com.common.mapper;

import com.common.dto.auth.Point;
import com.common.dto.user.PointDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface PointMapper {
    PointMapper INSTANCE = Mappers.getMapper(PointMapper.class);

    // Da Entity a DTO
    PointDTO toDTO(Point point) throws Exception;
    

    // Da DTO a Entity
    Point fromDTO(PointDTO userPointDto) throws Exception;
}




package com.common.mapper;

import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class UserPointToPointMapper {

    @Mapping(target = "_id", ignore = true)
    @Mapping(target = "type", ignore = true)
    @Mapping(target = "emailFigli", ignore = true)
    @Mapping(target = "figliLinks", ignore = true)
    @Mapping(target = "imagesBySlot", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "pointFigli", ignore = true)
    @Mapping(target = "emailChild", ignore = true)
    @Mapping(target = "emailUserCurrent", ignore = true)
    @Mapping(target = "nameImage", ignore = true)
    @Mapping(target = "imageCardId", ignore = true)
    @Mapping(target = "operation", ignore = true)
    @Mapping(target = "usePoints", ignore = true)
    public abstract UserPoint toChange(Point point);

    @Mapping(target = "nameImages", ignore = true)
    public abstract Point toChange(UserPoint point);
}

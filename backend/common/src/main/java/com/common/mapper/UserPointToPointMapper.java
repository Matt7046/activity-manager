package com.common.mapper;

import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class UserPointToPointMapper {
    // Da Entity a DTO
   public abstract UserPoint toChange(Point point);

    public abstract Point toChange(UserPoint point);

}




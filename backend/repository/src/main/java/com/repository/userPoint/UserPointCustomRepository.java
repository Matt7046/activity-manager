package com.repository.userPoint;

import java.util.List;

import com.common.data.user.UserPoint;

public interface UserPointCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario

    Long getTypeUser(UserPoint userPoint);

    Boolean saveUser(UserPoint userPoint) ;

    UserPoint savePoint(UserPoint userPoint, Long usePoints, Boolean operation);

    UserPoint getPointByEmail(String email);

    List<UserPoint> getPointsListByEmail(String email);

    UserPoint saveUserImage(UserPoint point);
}
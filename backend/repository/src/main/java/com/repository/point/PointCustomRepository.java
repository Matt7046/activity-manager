package com.repository.point;
import java.util.List;
import com.common.data.UserPoint;

public interface PointCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(UserPoint userPoint) throws Exception;

    public Boolean saveUser(UserPoint userPoint) throws Exception;
    
    UserPoint savePoint(UserPoint userPoint, Long usePoints, Boolean operation) throws Exception;

    UserPoint getPointByEmail(String email) throws Exception ;

    
     List<UserPoint>  getPointsListByEmail(String email) throws Exception ;

}
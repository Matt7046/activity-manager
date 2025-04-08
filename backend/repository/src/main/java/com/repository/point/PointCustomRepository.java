package com.repository.point;
import java.util.List;
import com.common.data.Point;

public interface PointCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getTypeUser(Point point) throws Exception;

    public Boolean saveUser(Point point) throws Exception;
    
    Point savePoint(Point point, Long usePoints, Boolean operation) throws Exception;

    Point getPointByEmail(String email) throws Exception ;

    
     List<Point>  getPointsListByEmail(String email) throws Exception ;

}
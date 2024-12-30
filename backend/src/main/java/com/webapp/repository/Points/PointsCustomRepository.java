package com.webapp.repository.Points;

import java.util.List;

import com.webapp.data.Points;

public interface PointsCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public Long getUserType(Points points) throws Exception;

    public Boolean saveFamily(Points points) throws Exception;
    
    Points savePointsByTypeStandard(Points points, Long usePoints, Boolean operation) throws Exception;

    Points getPointsByEmail(String email) throws Exception ;

    
     List<Points>  getPointsListByEmail(String email) throws Exception ;

}
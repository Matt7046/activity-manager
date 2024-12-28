package com.webapp.repository.Points;

import com.webapp.data.Points;

public interface PointsCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public String savePoints(Points points, Long usePoints) throws Exception;

}
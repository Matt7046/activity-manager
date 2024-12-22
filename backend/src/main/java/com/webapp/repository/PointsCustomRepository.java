package com.webapp.repository;

import com.webapp.dto.PointsDTO;

public interface PointsCustomRepository {
    // Puoi aggiungere metodi personalizzati se necessario
    
    public String savePoints(PointsDTO pointsDTO);

}
package com.userPointService.dto.user;

import com.common.dto.structure.InterfaceDTO;

import java.util.Map;

/**
 * Risposta find-by-email punti scheda: solo mappa id card (FE) → path immagine.
 */
public record PointRDTO(Integer points, String numeroPunti, Map<String, String> nameImagesBySlot) implements InterfaceDTO {}

package com.common.dto.user;

import com.common.dto.structure.InterfaceDTO;

import java.util.List;
import java.util.Map;

/**
 * nameImage: valori della mappa in ordine di inserimento; nameImagesBySlot: id card (FE) → path.
 */
public record PointRDTO(Integer points, String numeroPunti, List<String> nameImage,
        Map<String, String> nameImagesBySlot) implements InterfaceDTO {}

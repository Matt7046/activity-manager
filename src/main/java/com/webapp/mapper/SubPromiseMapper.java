package com.webapp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.webapp.data.SubPromise;
import com.webapp.dto.SubPromiseDTO;

@Mapper
public interface SubPromiseMapper {
    SubPromiseMapper INSTANCE = Mappers.getMapper(SubPromiseMapper.class);

    // Da Entity a DTO
    SubPromiseDTO toDTO(SubPromise utente);

    // Da DTO a Entity
    SubPromise fromDTO(SubPromiseDTO dto);
}




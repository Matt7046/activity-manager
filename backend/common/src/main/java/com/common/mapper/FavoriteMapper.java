package com.common.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.gamification.Favorite;
import com.common.dto.gamification.FavoriteDTO;

@Mapper(componentModel = "spring")
public abstract class FavoriteMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    // Da Entity a DTO
    public abstract FavoriteDTO toDTO(Favorite favorite);

    // Da DTO a Entity
    public abstract Favorite fromDTO(FavoriteDTO favoriteDTO);

    @AfterMapping
    protected void decryptField(Favorite favorite, @MappingTarget FavoriteDTO dto) {
        if (dto.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(favorite.getEmail()));
        }
    }

    @AfterMapping
    protected void encryptField(FavoriteDTO dto, @MappingTarget Favorite favorite) {
        if (favorite.getEmail() != null) {
            favorite.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }

    }
}

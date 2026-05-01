package com.userPointService.repository;

import java.util.List;
import java.util.Optional;

import com.common.data.gamification.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    // Puoi aggiungere metodi personalizzati se necessario
    List<Favorite> findAll();

    List<Favorite> findByEmail(String email);

    // Trova un singolo preferito per email E videoId
    Optional<Favorite> findByEmailAndVideoId(String email, String videoId);

}

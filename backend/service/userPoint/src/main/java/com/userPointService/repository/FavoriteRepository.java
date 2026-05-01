package com.userPointService.repository;

import java.util.List;
import java.util.Optional;

import com.common.data.gamification.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    List<Favorite> findAll();

    List<Favorite> findByEmail(String email);

    // 1. Trova un SINGOLO preferito (videoId singolo)
    Optional<Favorite> findByEmailAndVideoId(String email, String videoId);

    // 2. Trova una LISTA di preferiti (usando una lista di videoIds)
    // Nota l'aggiunta di "In" alla fine del nome del metodo
    List<Favorite> findByEmailAndVideoIdIn(String email, List<String> videoIds);
}
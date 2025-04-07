package com.repository.notification;

import com.common.data.Notification;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    @Query(value = "{'userReceiver': ?0}", sort = "{'dateSender': -1}")
    List<Notification> findLatestNotifications(String userReceiver, Pageable pageable);
}
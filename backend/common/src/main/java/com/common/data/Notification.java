package com.common.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notification") // Specifica la collezione nel database
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class Notification { // PascalCase per il nome della classe
    @Id
    private String _id;
    private String message;
    private String userSender;
    private String userReceiver;
    private Date dateSender;
}

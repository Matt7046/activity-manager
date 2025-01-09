package com.activityManager.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document; 
    
    @Document(collection = "activity") // Specifica la collezione nel database
    @Data // Genera getter, setter, toString, equals e hashCode
    @NoArgsConstructor // Genera un costruttore senza argomenti
    @AllArgsConstructor // Genera un costruttore con tutti i campi
    public class Activity {
        @Id
        private String _id;
        private String  subTesto;
        private String nome;
        private Long points;
        private String email;   
    
}

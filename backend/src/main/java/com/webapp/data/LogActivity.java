package com.webapp.data;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


  
 
    
    @Document(collection = "logattivita") // Specifica la collezione nel database
    @Data // Genera getter, setter, toString, equals e hashCode
    @NoArgsConstructor // Genera un costruttore senza argomenti
    @AllArgsConstructor // Genera un costruttore con tutti i campi
    public class LogActivity {
        @Id
        private String _id;
        private String email;
        private String log;
        private Date  date;
        private Long usePoints;
    
    
}

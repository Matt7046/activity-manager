package com.activityManager.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document; 
    
    @Document(collection = "logactivity") // Specifica la collezione nel database
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

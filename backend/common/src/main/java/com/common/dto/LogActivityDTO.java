package com.common.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date; 
 
    
    @Data // Genera getter, setter, toString, equals e hashCode
    @NoArgsConstructor // Genera un costruttore senza argomenti
    @AllArgsConstructor // Genera un costruttore con tutti i campi
    public class LogActivityDTO implements InterfaceDTO {
        private String _id;
        private String email;
        private String emailFamily;
        private String log;
        private Date  date;
        private Long usePoints;
        private Long points;
    
    
}

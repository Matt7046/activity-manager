package com.common.dto.activity;


import com.common.dto.structure.InterfaceDTO;
import com.common.dto.user.UserPointDTO;
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
        private String emailUserCurrent;
        private Long typeUser;
        private String log;
        private Date  date;
        private Long usePoints;
        private Long points;
        private UserPointDTO point;
    
    
}

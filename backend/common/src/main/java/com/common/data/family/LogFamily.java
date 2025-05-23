package com.common.data.family;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "logfamily") // Specifica la collezione nel database
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class LogFamily {
    @Id
    private String _id;
    private String performedByEmail;
    private String receivedByEmail;
    private String log;
    private Date  date;
    private OperationTypeLogFamily operations;

}

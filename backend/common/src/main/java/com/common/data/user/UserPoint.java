package com.common.data.user;

import com.common.dto.auth.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "userpoint") // Specifica la collezione nel database
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPoint {
    @Id
    private String _id;
    @Field("email")
    private String email;
    private List<Point>  points;
    private Long type;
    @Field("emailfamily")
    private String emailFamily;  
    private List<String> emailFigli;
    @Transient
    private String nameImage;
}

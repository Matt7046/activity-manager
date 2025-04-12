package com.common.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.common.authDTO.PointsUser;

@Document(collection = "userpoint") // Specifica la collezione nel database
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPoint {
    @Id
    private String _id;
    @Field("email")
    private String email;
    private List<PointsUser>  points;
    private Long type;
    @Field("emailfamily")
    private String emailFamily;  
    private List<String> emailFigli;
}

package com.common.data.user;

import com.common.dto.auth.Point;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userpoint") // Specifica la collezione nel database
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class UserPoint {
    @Id
    private String _id;
    private String email;
    private String password;
    private List<Point> pointFigli;
    private Integer type;
    private List<String> emailFigli;
    private Integer points;
    private List<String> nameImages;
    /** Path immagine per chiave slot (nome passato dal frontend). */
    private Map<String, String> imagesBySlot;
    private Integer status;
    @Transient
    private String emailChild;
    @Transient
    private String emailUserCurrent;
    @Transient
    private String nameImage;
    /** _id card (frontend): una sola immagine aggiornata per richiesta. */
    @Transient
    private String imageCardId;
    @Transient
    private Boolean operation;
    @Transient
    private Integer usePoints;
}

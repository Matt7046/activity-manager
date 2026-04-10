package com.common.data.activity;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(indexName = "activities_v1")
@Data // Genera getter, setter, toString, equals e hashCode
@NoArgsConstructor // Genera un costruttore senza argomenti
@AllArgsConstructor // Genera un costruttore con tutti i campi
public class ActivityDocument {
    @Id
    private String _id;
    private String identificativo;
    private String subTesto;
    private String nome;
    private Long points;
    private String email;
    private String category;


}
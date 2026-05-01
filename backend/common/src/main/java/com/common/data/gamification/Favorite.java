package com.common.data.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "favorite")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {
    @Id
    private String _id;
    private String videoId;
    private String email;
    private List<String> videoIds;


}

package com.userPointService.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "favorite")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FavoriteDTO {
    @Id
    private String _id;
    private String videoId;
    private String email;
    private List<String> videoIds;
}

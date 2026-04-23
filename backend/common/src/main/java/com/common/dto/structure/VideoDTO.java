package com.common.dto.structure;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VideoDTO {
    private String videoId;
    private String title;
    private String description;
    private String thumbnail;
    private String channelTitle;
}
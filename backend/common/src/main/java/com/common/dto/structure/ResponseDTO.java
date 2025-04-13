package com.common.dto.structure;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseDTO  {

    JsonNode jsonText;
    Integer status;
    List<String> errors;

    public ResponseDTO(Object object, Integer status, ArrayList<String> errors) {
        ObjectMapper objectMapper = new ObjectMapper();
        jsonText = objectMapper.valueToTree(object);
        this.status= status;
        this.errors = errors;
    }
}
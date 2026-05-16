package com.activityService.dto;

import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDTO implements InterfaceDTO {

    private String _id;
    private String subTesto;
    private String nome;
    private String logAttivita;
    private Long points;
    private String email;
}

package com.activityService.dto;

import com.common.dto.structure.InterfaceDTO;
import com.common.dto.user.UserPointDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogActivityDTO implements InterfaceDTO {
    private String _id;
    private String email;
    private String emailFamily;
    private String emailUserCurrent;
    private Integer typeUser;
    private String log;
    private Date date;
    private Integer usePoints;
    private Long points;
    private UserPointDTO point;
}

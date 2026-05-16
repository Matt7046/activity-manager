package com.userPointService.dto.family;

import com.common.data.family.OperationTypeLogFamily;
import com.common.dto.structure.InterfaceDTO;
import com.common.dto.user.UserPointDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogFamilyDTO implements InterfaceDTO {
    private String _id;
    private String performedByEmail;
    private String receivedByEmail;
    private String log;
    private Date date;
    private OperationTypeLogFamily operations;
    private UserPointDTO point;
    private Integer usePoints;
}

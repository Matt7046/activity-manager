package com.userPointService.dto.user;

import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO implements InterfaceDTO {

    private Integer typeUser;
    private Boolean newUser;
    private String emailUserCurrent;
    /** Solo per tipo figlio (0): genitori con link in attesa di conferma. */
    private List<String> pendingParentEmails;
}

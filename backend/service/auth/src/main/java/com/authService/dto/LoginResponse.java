package com.authService.dto;

import com.common.dto.structure.InterfaceDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse implements InterfaceDTO {
    private String token;
    /** Email soggetto JWT (utile dopo OAuth GitHub lato client). */
    private String email;
}

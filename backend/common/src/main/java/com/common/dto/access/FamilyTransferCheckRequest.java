package com.common.dto.access;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FamilyTransferCheckRequest {
    private String actorEmail;
    private String targetEmail;
}

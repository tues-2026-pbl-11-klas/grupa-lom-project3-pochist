package com.chist.verificationmodule.dto;

import com.chist.verificationmodule.model.VerificationStatus;
import com.chist.verificationmodule.model.VerificationType;
import lombok.*;

import java.util.Date;
import java.util.UUID;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationResponse {
    private UUID id;
    private UUID taskId;
    private VerificationType type;
    private VerificationStatus status;
    private String result;
    private Double actualLat;
    private Double actualLng;
    private Date createdAt;
    private Date updatedAt;
}
package com.chist.verificationmodule.dto;

import com.chist.verificationmodule.model.VerificationType;
import lombok.*;

import java.util.UUID;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationRequest {
    private UUID taskId;
    private VerificationType type;
    private Double actualLatitude;
    private Double actualLongitude;
    private String beforePhotoUrl;
    private String afterPhotoUrl;
    private Double expectedLatitude;
    private Double expectedLongitude;
}

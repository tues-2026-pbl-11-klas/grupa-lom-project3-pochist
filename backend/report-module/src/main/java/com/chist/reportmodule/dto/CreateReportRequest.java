package com.chist.reportmodule.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateReportRequest {
    private double latitude;
    private double longitude;
    private String photoUrl;
    private String description;
    private String severity;

}

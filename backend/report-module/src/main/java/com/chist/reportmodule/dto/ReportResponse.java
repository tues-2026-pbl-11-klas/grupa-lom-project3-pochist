package com.chist.reportmodule.dto;

import com.chist.reportmodule.model.ReportStatus;
import lombok.*;
import java.util.Date;
import java.util.UUID;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReportResponse {
    private UUID reportId;
    private UUID userId;
    private double latitude;
    private double longitude;
    private String photoUrl;
    private String description;
    private String severity;
    private ReportStatus status;
    private Date createdAt;
    private Date updatedAt;
}

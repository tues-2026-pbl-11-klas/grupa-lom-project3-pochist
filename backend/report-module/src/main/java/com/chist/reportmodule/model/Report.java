package com.chist.reportmodule.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "reports")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "report_id")
    private UUID id;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "severity")
    private String severity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status =  ReportStatus.NEW;

    @CreatedDate
    @Column(nullable = false, name = "created_at")
    private Date  createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updated_at")
    private Date  updatedAt;
}

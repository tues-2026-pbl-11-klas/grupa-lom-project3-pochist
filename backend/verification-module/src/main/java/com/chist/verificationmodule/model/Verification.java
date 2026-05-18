package com.chist.verificationmodule.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "verifications")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "verification_id")
    private UUID id;

    @Column(nullable = false)
    private UUID taskId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status;

    private String result;

    private Double actualLat;
    private Double actualLng;

    @CreatedDate
    @Column(nullable = false, name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updated_at")
    private Date updatedAt;
}

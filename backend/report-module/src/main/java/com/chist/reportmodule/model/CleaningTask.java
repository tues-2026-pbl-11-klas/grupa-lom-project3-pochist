package com.chist.reportmodule.model;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;
import java.util.UUID;


@Entity
@Getter @Setter
@Table(name = "cleaning_tasks")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class CleaningTask {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "task_id")
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "report_id",nullable = false)
    private Report report;

    @Column(nullable = false)
    private UUID cleanerId;

    @Column(name = "before_photo")
    private String beforePhoto;

    @Column(name = "after_photo")
    private String afterPhoto;

    @Column(nullable = false)
    private boolean verified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status = TaskStatus.PENDING;

    @CreatedDate
    @Column(nullable = false, name = "created_at")
    private Date createdAt;

    @LastModifiedDate
    @Column(nullable = false, name = "updated_at")
    private Date updatedAt;

}

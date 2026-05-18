package com.chist.reportmodule.repository;


import com.chist.reportmodule.model.Report;
import com.chist.reportmodule.model.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    List<Report> findByUserId(UUID userId);
    List<Report> findByStatus(ReportStatus status);
}

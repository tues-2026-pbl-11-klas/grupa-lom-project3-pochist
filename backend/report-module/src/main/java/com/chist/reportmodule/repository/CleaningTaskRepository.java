package com.chist.reportmodule.repository;


import com.chist.reportmodule.model.CleaningTask;
import com.chist.reportmodule.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CleaningTaskRepository extends JpaRepository<CleaningTask, UUID> {
    List<CleaningTask> findByCleanerId(UUID cleanerId);
    List<CleaningTask> findByStatus(TaskStatus status);
    List<CleaningTask> findByReportId(UUID reportId);
}

package com.kdevfull.jiquintana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kdevfull.jiquintana.entity.Task;
import com.kdevfull.jiquintana.entity.User;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedTo(User user);
    List<Task> findByProjectId(Long projectId);
}
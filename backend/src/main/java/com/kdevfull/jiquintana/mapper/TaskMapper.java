package com.kdevfull.jiquintana.mapper;

import com.kdevfull.jiquintana.dto.task.TaskRequest;
import com.kdevfull.jiquintana.dto.task.TaskResponse;
import com.kdevfull.jiquintana.entity.Task;

public class TaskMapper {

	public static TaskResponse toResponse(Task task) {
        TaskResponse dto = new TaskResponse();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setAssignedTo(task.getAssignedTo().getUsername());
        dto.setProjectId(task.getProject().getId());
        return dto;
    }

    public static void updateEntity(Task task, TaskRequest dto) {
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setDueDate(dto.getDueDate());
    }
}

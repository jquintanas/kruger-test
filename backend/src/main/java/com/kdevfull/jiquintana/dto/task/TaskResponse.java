package com.kdevfull.jiquintana.dto.task;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.kdevfull.jiquintana.entity.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {

	private Long id;
	private String title;
	private String description;
	private TaskStatus status;
	private LocalDate dueDate;
	private LocalDateTime createdAt;
	private String assignedTo;
	private Long projectId;
}

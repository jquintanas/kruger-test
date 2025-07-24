package com.kdevfull.jiquintana.dto.task;

import java.time.LocalDate;

import com.kdevfull.jiquintana.entity.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {

	private String title;
	private String description;
	private TaskStatus status;
	private LocalDate dueDate;
	private Long projectId;
}

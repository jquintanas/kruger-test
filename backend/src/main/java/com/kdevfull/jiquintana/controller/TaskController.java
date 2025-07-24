package com.kdevfull.jiquintana.controller;

import java.security.Principal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kdevfull.jiquintana.dto.task.TaskResponse;
import com.kdevfull.jiquintana.entity.Task;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.TaskMapper;
import com.kdevfull.jiquintana.repository.UserRepository;
import com.kdevfull.jiquintana.service.TaskService;

@RestController
@RequestMapping("/kdevfull/tasks")
public class TaskController {

	@Autowired
	private TaskService taskService;
	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public ResponseEntity<TaskResponse> create(@RequestBody Task task, Principal principal) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow();
		task.setAssignedTo(user);
		return ResponseEntity.ok(TaskMapper.toResponse(taskService.create(task)));
	}

	@GetMapping
	public ResponseEntity<List<TaskResponse>> getUserTasks(Principal principal, @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
	        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
		User user = userRepository.findByEmail(principal.getName()).orElseThrow();
		return ResponseEntity.ok(taskService.findByUser(user).stream()
				 .filter(task -> {
                     LocalDate due = task.getDueDate();
                     boolean fromOk = (dateFrom == null || (due != null && !due.isBefore(dateFrom)));
                     boolean toOk = (dateTo == null || (due != null && !due.isAfter(dateTo)));
                     return fromOk && toOk;
                 })
				.sorted(Comparator.comparing(Task::getId))
		        .map(TaskMapper::toResponse)
		        .toList());
	}

	@GetMapping("/project/{projectId}")
	public ResponseEntity<List<TaskResponse>> getByProject(@PathVariable Long projectId) {
		return ResponseEntity.ok(taskService.findByProjectId(projectId).stream()
				.sorted(Comparator.comparing(Task::getId))
		        .map(TaskMapper::toResponse)
		        .toList());
	}

	@PutMapping("/{id}")
	public ResponseEntity<TaskResponse> update(@RequestBody Task task, @PathVariable Long id) {
		return ResponseEntity.ok(TaskMapper.toResponse(taskService.update(task, id)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		taskService.delete(id);
		return ResponseEntity.noContent().build();
	}

}

package com.kdevfull.jiquintana.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kdevfull.jiquintana.entity.Task;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.exception.ResourceNotFoundException;
import com.kdevfull.jiquintana.repository.TaskRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class TaskService {

	@Autowired
	private TaskRepository taskRepository;

	public Task create(Task task) {
		log.info("Peticion recibida: create");
		return taskRepository.save(task);
	}

	public List<Task> findByUser(User user) {
		log.info("Peticion recibida: findByUser");
		return taskRepository.findByAssignedTo(user);
	}

	public List<Task> findByProjectId(Long projectId) {
		log.info("Peticion recibida: findByProjectId");
		return taskRepository.findByProjectId(projectId);
	}

	public Task update(Task task, Long id) throws ResourceNotFoundException {
		log.info("Peticion recibida: update");
		Task existing = taskRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: update");
					return new ResourceNotFoundException("Task doesn't exist, ID: " + id);
				});

		existing.setTitle(task.getTitle());
		existing.setDescription(task.getDescription());
		existing.setStatus(task.getStatus());
		existing.setDueDate(task.getDueDate());

		return taskRepository.save(existing);
	}

	public void delete(Long id) throws ResourceNotFoundException {
		log.info("Peticion recibida: delete");
		if (!taskRepository.existsById(id)) {
			log.error("Error en: delete");
			throw new ResourceNotFoundException("Task doesn't exist, ID: " + id);
		}
		taskRepository.deleteById(id);
	}
}

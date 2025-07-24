package com.kdevfull.jiquintana.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kdevfull.jiquintana.entity.Project;
import com.kdevfull.jiquintana.entity.Task;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.exception.ResourceNotFoundException;
import com.kdevfull.jiquintana.repository.ProjectRepository;
import com.kdevfull.jiquintana.repository.TaskRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class ProjectService {

	@Autowired
	private ProjectRepository projectRepository;
	
	@Autowired
	private TaskRepository taskRepository;

	public Project create(Project project) {
		log.info("Peticion recibida: create");
		return projectRepository.save(project);
	}

	public List<Project> findAllByOwner(User user) {
		log.info("Peticion recibida: findAllByOwner");
		return projectRepository.findByOwner(user);
	}

	public Project update(Project project, Long id) throws ResourceNotFoundException {
		log.info("Peticion recibida: update");
		Project existing = projectRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: update");
					return new ResourceNotFoundException("Project not found, ID: " + id);
				});

		existing.setName(project.getName());
		existing.setDescription(project.getDescription());

		return projectRepository.save(existing);
	}

	public void delete(Long id) throws ResourceNotFoundException {
		log.info("Peticion recibida: delete");
		if (!projectRepository.existsById(id)) {
			log.error("Error en: delete");
			throw new ResourceNotFoundException("Project not found, ID:" + id);
		}
		
		List<Task> tasks = taskRepository.findByProjectId(id);
		
		if (!tasks.isEmpty()) {
			for (Task task: tasks) {
				taskRepository.delete(task);
			}
		}
		
		projectRepository.deleteById(id);
	}
}

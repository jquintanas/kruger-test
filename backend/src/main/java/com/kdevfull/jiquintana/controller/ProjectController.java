package com.kdevfull.jiquintana.controller;

import java.security.Principal;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdevfull.jiquintana.dto.project.ProjectResponse;
import com.kdevfull.jiquintana.entity.Project;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.ProjectMapper;
import com.kdevfull.jiquintana.repository.UserRepository;
import com.kdevfull.jiquintana.service.ProjectService;

@RestController
@RequestMapping("/kdevfull/projects")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	@Autowired
	private UserRepository userRepository;

	@PostMapping
	public ResponseEntity<ProjectResponse> create(@RequestBody Project project, Principal principal) {
		User owner = userRepository.findByEmail(principal.getName()).orElseThrow();
		project.setOwner(owner);
		return ResponseEntity.ok(ProjectMapper.toResponse(projectService.create(project)));
	}

	@GetMapping
	public ResponseEntity<List<ProjectResponse>> getUserProjects(Principal principal) {
		User owner = userRepository.findByEmail(principal.getName()).orElseThrow();
		return ResponseEntity.ok(projectService.findAllByOwner(owner).stream()
				.sorted(Comparator.comparing(Project::getId))
		        .map(ProjectMapper::toResponse)
		        .toList());
	}

	@PutMapping("/{id}")
	public ResponseEntity<ProjectResponse> update(@RequestBody Project project, @PathVariable Long id) {
		return ResponseEntity.ok(ProjectMapper.toResponse(projectService.update(project, id)));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		projectService.delete(id);
		return ResponseEntity.noContent().build();
	}
}
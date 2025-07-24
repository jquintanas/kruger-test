package com.kdevfull.jiquintana.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kdevfull.jiquintana.dto.project.ProjectResponse;
import com.kdevfull.jiquintana.entity.Project;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.ProjectMapper;
import com.kdevfull.jiquintana.repository.UserRepository;
import com.kdevfull.jiquintana.service.ProjectService;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @InjectMocks
    private ProjectController projectController;

    @Mock
    private ProjectService projectService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Principal principal;

    @Test
    void testCreateProject() {
        User owner = new User();
        owner.setEmail("test@email.com");

        Project input = new Project();
        input.setName("Project 1");
        input.setDescription("Desc");

        Project saved = new Project(1L, "Project 1", "Desc", null, owner);
        ProjectResponse expectedResponse = new ProjectResponse(1L, "Project 1", "Desc", null, "test");

        when(principal.getName()).thenReturn("test@email.com");
        when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(owner));
        when(projectService.create(input)).thenReturn(saved);

        try (MockedStatic<ProjectMapper> mapper = mockStatic(ProjectMapper.class)) {
            mapper.when(() -> ProjectMapper.toResponse(saved)).thenReturn(expectedResponse);

            ResponseEntity<ProjectResponse> response = projectController.create(input, principal);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(expectedResponse, response.getBody());
        }
    }

    @Test
    void testGetUserProjects() {
        User owner = new User();
        owner.setEmail("test@email.com");

        Project p1 = new Project(1L, "P1", "D1", null, owner);
        Project p2 = new Project(2L, "P2", "D2", null, owner);

        List<Project> projects = List.of(p1, p2);
        List<ProjectResponse> responses = List.of(
            new ProjectResponse(1L, "P1", "D1", null, "test"),
            new ProjectResponse(2L, "P2", "D2", null, "test")
        );

        when(principal.getName()).thenReturn("test@email.com");
        when(userRepository.findByEmail("test@email.com")).thenReturn(Optional.of(owner));
        when(projectService.findAllByOwner(owner)).thenReturn(projects);

        try (MockedStatic<ProjectMapper> mapper = mockStatic(ProjectMapper.class)) {
            mapper.when(() -> ProjectMapper.toResponse(p1)).thenReturn(responses.get(0));
            mapper.when(() -> ProjectMapper.toResponse(p2)).thenReturn(responses.get(1));

            ResponseEntity<List<ProjectResponse>> response = projectController.getUserProjects(principal);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(responses, response.getBody());
        }
    }

    @Test
    void testUpdateProject() {
    	User owner = new User();
    	owner.setId(1L);
        Project input = new Project();
        input.setName("Updated");
        input.setDescription("Updated Desc");

        Project updated = new Project(1L, "Updated", "Updated Desc", null, owner);
        ProjectResponse responseDto = new ProjectResponse(1L, "Updated", "Updated Desc", null, "test");

        when(projectService.update(input, 1L)).thenReturn(updated);

        try (MockedStatic<ProjectMapper> mapper = mockStatic(ProjectMapper.class)) {
            mapper.when(() -> ProjectMapper.toResponse(updated)).thenReturn(responseDto);

            ResponseEntity<ProjectResponse> response = projectController.update(input, 1L);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(responseDto, response.getBody());
        }
    }

    @Test
    void testDeleteProject() {
        doNothing().when(projectService).delete(1L);

        ResponseEntity<Void> response = projectController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
    }
}

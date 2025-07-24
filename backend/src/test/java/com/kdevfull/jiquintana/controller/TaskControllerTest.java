package com.kdevfull.jiquintana.controller;

import static org.hamcrest.CoreMatchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kdevfull.jiquintana.dto.task.TaskResponse;
import com.kdevfull.jiquintana.entity.Project;
import com.kdevfull.jiquintana.entity.Task;
import com.kdevfull.jiquintana.entity.TaskStatus;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.TaskMapper;
import com.kdevfull.jiquintana.repository.UserRepository;
import com.kdevfull.jiquintana.service.TaskService;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @InjectMocks
    private TaskController taskController;

    @Mock
    private TaskService taskService;

    @Mock
    private UserRepository userRepository;

    private User user;
    
    private Project project;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setUsername("testuser");
        
        project = new Project();
        project.setId(1L);
        project.setName("TEST");
        project.setDescription("DESC TEST");
    }

    @Test
    void testCreateTask() {
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Nueva tarea");
        task.setDescription("desc");
        task.setStatus(TaskStatus.DONE);
        task.setDueDate(LocalDate.now());

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(taskService.create(task)).thenReturn(task);

        try (MockedStatic<TaskMapper> mockedMapper = mockStatic(TaskMapper.class)) {
            TaskResponse responseMock = new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getDueDate(),
                task.getCreatedAt(),
                "test",
                1L
            );
            mockedMapper.when(() -> TaskMapper.toResponse(task))
                        .thenReturn(responseMock);

            Principal principal = () -> "user@example.com";
            ResponseEntity<TaskResponse> response = taskController.create(task, principal);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("Nueva tarea", response.getBody().getTitle());
        }
    }

    @Test
    void testGetUserTasks() {
        List<Task> tasks = List.of(new Task(1L, "Tarea 1", "Desc", TaskStatus.DONE, LocalDate.now(), LocalDateTime.now(), user, project));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(taskService.findByUser(user)).thenReturn(tasks);

        Principal principal = () -> "user@example.com";
        ResponseEntity<List<TaskResponse>> response = taskController.getUserTasks(principal, null, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals("Tarea 1", response.getBody().get(0).getTitle());
    }

    @Test
    void testGetTasksByProject() {
        Long projectId = 10L;
        Task task = new Task(1L, "Tarea Proyecto", "desc", TaskStatus.DONE, LocalDate.now(), LocalDateTime.now(), user, project);

        when(taskService.findByProjectId(projectId)).thenReturn(List.of(task));

        ResponseEntity<List<TaskResponse>> response = taskController.getByProject(projectId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Tarea Proyecto", response.getBody().get(0).getTitle());
    }

    @Test
    void testUpdateTask() {
        Task task = new Task(1L, "Tarea Actualizada", "desc", TaskStatus.DONE, LocalDate.now(), LocalDateTime.now(), user, project);
        when(taskService.update(task, 1L)).thenReturn(task);

        ResponseEntity<TaskResponse> response = taskController.update(task, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Tarea Actualizada", response.getBody().getTitle());
    }

    @Test
    void testDeleteTask() {
        doNothing().when(taskService).delete(1L);

        ResponseEntity<Void> response = taskController.delete(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}




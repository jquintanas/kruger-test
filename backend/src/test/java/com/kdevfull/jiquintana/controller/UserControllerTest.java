package com.kdevfull.jiquintana.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.kdevfull.jiquintana.dto.user.UserRequest;
import com.kdevfull.jiquintana.dto.user.UserResponse;
import com.kdevfull.jiquintana.entity.Role;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.UserMapper;
import com.kdevfull.jiquintana.service.UserService;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Test
    void testGetUserById() {
        User mockUser = new User();
        mockUser.setId(3L);
        mockUser.setUsername("test");
        mockUser.setEmail("test@email.com");
        mockUser.setRole(Role.ADMIN);

        UserResponse userResponse = new UserResponse(3L, "test", "test@email.com", Role.ADMIN);

        when(userService.getById(3L)).thenReturn(mockUser);

        try (MockedStatic<UserMapper> mockedMapper = mockStatic(UserMapper.class)) {
            mockedMapper.when(() -> UserMapper.toResponse(mockUser)).thenReturn(userResponse);

            ResponseEntity<UserResponse> response = userController.getById(3L);

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals("test@email.com", response.getBody().getEmail());
        }
    }
    
    @Test
    void testGetAllUsers() {
        // Datos simulados
        User user = new User(1L, "test", "test@email.com", "password", Role.ADMIN);
        UserResponse userResponse = new UserResponse(1L, "test", "test@email.com", Role.ADMIN);

        // Simular respuesta del servicio
        when(userService.getAllUsers()).thenReturn(List.of(user));

        // Simular mapeo estático
        try (MockedStatic<UserMapper> mapperMock = Mockito.mockStatic(UserMapper.class)) {
            mapperMock.when(() -> UserMapper.toResponse(user)).thenReturn(userResponse);

            ResponseEntity<List<UserResponse>> response = userController.listAll();

            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(1, response.getBody().size());
            assertEquals("test@email.com", response.getBody().get(0).getEmail());
        }
    }
    
    @Test
    void testCreateUser() {
        // Arrange
        UserRequest userRequest = new UserRequest("test", "test@email.com", "test", Role.ADMIN);
        User userEntity = new User(1L, "test", "test@email.com", "hashed", Role.ADMIN);
        UserResponse expectedResponse = new UserResponse(1L, "test", "test@email.com", Role.ADMIN);

        // Stub service
        when(userService.createUser(userRequest)).thenReturn(userEntity);

        // Mock static mapper
        try (MockedStatic<UserMapper> mapper = mockStatic(UserMapper.class)) {
            mapper.when(() -> UserMapper.toResponse(userEntity)).thenReturn(expectedResponse);

            // Act
            ResponseEntity<UserResponse> response = userController.create(userRequest);

            // Assert
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertEquals(expectedResponse, response.getBody());
        }
    }
}

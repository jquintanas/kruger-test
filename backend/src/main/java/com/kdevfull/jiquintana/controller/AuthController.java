package com.kdevfull.jiquintana.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdevfull.jiquintana.dto.auth.LoginRequest;
import com.kdevfull.jiquintana.dto.auth.LoginResponse;
import com.kdevfull.jiquintana.dto.user.UserResponse;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.UserMapper;
import com.kdevfull.jiquintana.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping("/register")
	public ResponseEntity<UserResponse> register(@RequestBody @Valid User user) {
		return ResponseEntity.ok(UserMapper.toResponse(authService.register(user)));
	}
}

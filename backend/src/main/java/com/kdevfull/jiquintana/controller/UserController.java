package com.kdevfull.jiquintana.controller;

import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kdevfull.jiquintana.dto.user.UserRequest;
import com.kdevfull.jiquintana.dto.user.UserResponse;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.mapper.UserMapper;
import com.kdevfull.jiquintana.service.UserService;

@RestController
@RequestMapping("/kdevfull/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping
	public ResponseEntity<UserResponse> create(@RequestBody UserRequest user) {
		return ResponseEntity.ok(UserMapper.toResponse(userService.createUser(user)));
	}

	@GetMapping
	public ResponseEntity<List<UserResponse>> listAll() {
		return ResponseEntity.ok(userService.getAllUsers().stream()
				.sorted(Comparator.comparing(User::getId))
		        .map(UserMapper::toResponse)
		        .toList());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserResponse> getById(@PathVariable Long id) {
		User user = userService.getById(id);
		UserResponse dto = UserMapper.toResponse(user);
		return ResponseEntity.ok(dto);
	}
}

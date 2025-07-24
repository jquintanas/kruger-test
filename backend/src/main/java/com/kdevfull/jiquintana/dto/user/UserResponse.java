package com.kdevfull.jiquintana.dto.user;

import com.kdevfull.jiquintana.entity.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {

	private Long id;
	private String username;
	private String email;
	private Role role;
}

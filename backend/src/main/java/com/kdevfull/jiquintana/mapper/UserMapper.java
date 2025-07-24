package com.kdevfull.jiquintana.mapper;

import com.kdevfull.jiquintana.dto.user.UserRequest;
import com.kdevfull.jiquintana.dto.user.UserResponse;
import com.kdevfull.jiquintana.entity.User;

public class UserMapper {

	public static UserResponse toResponse(User user) {
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }

    public static User toEntity(UserRequest dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }
}

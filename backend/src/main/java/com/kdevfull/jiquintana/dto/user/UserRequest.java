package com.kdevfull.jiquintana.dto.user;

import com.kdevfull.jiquintana.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {

	@NotBlank private String username;
    @Email @NotBlank private String email;
    @NotBlank private String password;
    private Role role;
}

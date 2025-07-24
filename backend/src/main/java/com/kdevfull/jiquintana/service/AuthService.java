package com.kdevfull.jiquintana.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.kdevfull.jiquintana.dto.auth.LoginRequest;
import com.kdevfull.jiquintana.dto.auth.LoginResponse;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.repository.UserRepository;
import com.kdevfull.jiquintana.security.JwtTokenProvider;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class AuthService {

	@Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
    	log.info("Peticion recibida: login");
    	
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                	log.error("Error en: login");
                	return new RuntimeException("User not found");
                });
        
        String token = jwtTokenProvider.createToken(user);
        return new LoginResponse(token);
    }

    public User register(User user) {
    	log.info("Peticion recibida: register");
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
}

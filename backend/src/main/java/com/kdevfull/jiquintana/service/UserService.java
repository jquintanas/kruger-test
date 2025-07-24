package com.kdevfull.jiquintana.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kdevfull.jiquintana.dto.user.UserRequest;
import com.kdevfull.jiquintana.entity.User;
import com.kdevfull.jiquintana.exception.ResourceNotFoundException;
import com.kdevfull.jiquintana.mapper.UserMapper;
import com.kdevfull.jiquintana.repository.UserRepository;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;

	public User createUser(UserRequest user) {
		
		log.info("Peticion recibida: createUser");
		
		return userRepository.save(UserMapper.toEntity(user));
	}

	public List<User> getAllUsers() {
		log.info("Peticion recibida: getAllUsers");
		return userRepository.findAll();
	}

	public User getById(Long id) throws ResourceNotFoundException {
		log.info("Peticion recibida: getById");
		return userRepository.findById(id)
				.orElseThrow(() -> {
					log.error("Error en: getById");
					return new ResourceNotFoundException("User not found, ID: " + id);
				});
	}
}

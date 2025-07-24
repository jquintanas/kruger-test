package com.kdevfull.jiquintana.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kdevfull.jiquintana.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
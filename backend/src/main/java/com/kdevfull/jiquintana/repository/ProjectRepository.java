package com.kdevfull.jiquintana.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.kdevfull.jiquintana.entity.Project;
import com.kdevfull.jiquintana.entity.User;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);
}

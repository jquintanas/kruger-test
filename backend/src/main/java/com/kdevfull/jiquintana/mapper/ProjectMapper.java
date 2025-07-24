package com.kdevfull.jiquintana.mapper;

import com.kdevfull.jiquintana.dto.project.ProjectRequest;
import com.kdevfull.jiquintana.dto.project.ProjectResponse;
import com.kdevfull.jiquintana.entity.Project;

public class ProjectMapper {

	public static ProjectResponse toResponse(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setOwnerUsername(project.getOwner().getUsername());
        return dto;
    }
	
    public static void updateEntity(Project project, ProjectRequest dto) {
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
    }
}

package com.kdevfull.jiquintana.dto.project;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponse {

	private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private String ownerUsername;
}

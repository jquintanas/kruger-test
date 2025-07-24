package com.kdevfull.jiquintana.entity;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@MappedSuperclass
@Data
public class AuditoryFields {

	
	private String createdBy;
	
	private String updatedBy;
}

package com.mia.adminapi.dto;

import com.mia.adminapi.entity.Role;

import java.time.LocalDateTime;

public class RoleResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    public RoleResponse() {
    }

    public RoleResponse(Long id, String name, String description, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }

    public static RoleResponse fromEntity(Role role) {
        if (role == null) return null;
        return new RoleResponse(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

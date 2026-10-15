package com.mia.adminapi.dto;

import com.mia.adminapi.entity.Role;
import com.mia.adminapi.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles = new HashSet<>();
    private Set<String> projectIds = new HashSet<>();
    private List<ProjectResponse> projects = new ArrayList<>();
    private CompanyResponse company;
    private String avatarUrl;
    private LocalDateTime createdAt;

    public UserDto() {
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getCompany() != null) {
            dto.setCompany(CompanyResponse.fromEntity(user.getCompany()));
        }

        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toSet()));
        }

        if (user.getProjects() != null) {
            dto.setProjectIds(user.getProjects().stream()
                    .map(p -> p.getId())
                    .collect(Collectors.toSet()));
            dto.setProjects(user.getProjects().stream()
                    .map(ProjectResponse::fromEntity)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public CompanyResponse getCompany() {
        return company;
    }

    public void setCompany(CompanyResponse company) {
        this.company = company;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public Set<String> getProjectIds() {
        return projectIds;
    }

    public void setProjectIds(Set<String> projectIds) {
        this.projectIds = projectIds;
    }

    public List<ProjectResponse> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectResponse> projects) {
        this.projects = projects;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

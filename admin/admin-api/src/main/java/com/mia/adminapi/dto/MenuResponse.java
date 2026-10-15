package com.mia.adminapi.dto;

import com.mia.adminapi.entity.Company;
import com.mia.adminapi.entity.Menu;
import com.mia.adminapi.entity.Project;
import com.mia.adminapi.entity.Role;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class MenuResponse {

    private Long id;
    private String name;
    private String title;
    private String path;
    private String icon;
    private Integer orderIndex;
    private boolean active;
    private Long parentId;
    private String parentTitle;
    private Set<String> roles = new HashSet<>();
    private Set<String> projectIds = new HashSet<>();
    private Set<Long> companyIds = new HashSet<>();
    private List<MenuResponse> children = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MenuResponse() {
    }

    public static MenuResponse fromEntity(Menu menu) {
        if (menu == null) return null;

        MenuResponse dto = new MenuResponse();
        dto.setId(menu.getId());
        dto.setName(menu.getName());
        dto.setTitle(menu.getTitle());
        dto.setPath(menu.getPath());
        dto.setIcon(menu.getIcon());
        dto.setOrderIndex(menu.getOrderIndex());
        dto.setActive(menu.isActive());
        dto.setCreatedAt(menu.getCreatedAt());
        dto.setUpdatedAt(menu.getUpdatedAt());

        if (menu.getParent() != null) {
            dto.setParentId(menu.getParent().getId());
            dto.setParentTitle(menu.getParent().getTitle());
        }

        if (menu.getRoles() != null) {
            dto.setRoles(menu.getRoles().stream()
                    .map(Role::getName)
                    .collect(Collectors.toSet()));
        }

        if (menu.getProjects() != null) {
            dto.setProjectIds(menu.getProjects().stream()
                    .map(Project::getId)
                    .collect(Collectors.toSet()));
        }

        if (menu.getCompanies() != null) {
            dto.setCompanyIds(menu.getCompanies().stream()
                    .map(Company::getId)
                    .collect(Collectors.toSet()));
        }

        return dto;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public String getParentTitle() {
        return parentTitle;
    }

    public void setParentTitle(String parentTitle) {
        this.parentTitle = parentTitle;
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

    public Set<Long> getCompanyIds() {
        return companyIds;
    }

    public void setCompanyIds(Set<Long> companyIds) {
        this.companyIds = companyIds;
    }

    public List<MenuResponse> getChildren() {
        return children;
    }

    public void setChildren(List<MenuResponse> children) {
        this.children = children;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

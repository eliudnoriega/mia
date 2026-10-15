package com.mia.adminapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.HashSet;
import java.util.Set;

public class MenuRequest {

    @NotBlank(message = "El nombre del menú es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder los 100 caracteres")
    private String name;

    @NotBlank(message = "El título visible del menú es obligatorio")
    @Size(max = 100, message = "El título no puede exceder los 100 caracteres")
    private String title;

    @Size(max = 255, message = "La ruta no puede exceder los 255 caracteres")
    private String path;

    @Size(max = 80, message = "El ícono no puede exceder los 80 caracteres")
    private String icon;

    private Integer orderIndex = 0;

    private Boolean active = true;

    private Long parentId;

    private Set<String> roles = new HashSet<>();

    private Set<String> projectIds = new HashSet<>();

    private Set<Long> companyIds = new HashSet<>();

    public MenuRequest() {
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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
}

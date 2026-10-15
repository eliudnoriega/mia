package com.mia.adminapi.dto;

import java.util.Set;

public class UpdateUserRequest {

    private String fullName;
    private String email;
    private Long companyId;
    private Set<String> roles;
    private Set<String> projectIds;

    public UpdateUserRequest() {
    }

    public UpdateUserRequest(String fullName, String email, Long companyId, Set<String> roles) {
        this.fullName = fullName;
        this.email = email;
        this.companyId = companyId;
        this.roles = roles;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
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
}

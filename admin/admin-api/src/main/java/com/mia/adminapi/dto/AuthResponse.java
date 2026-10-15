package com.mia.adminapi.dto;

import java.util.HashSet;
import java.util.Set;

public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles = new HashSet<>();
    private Set<String> projectIds = new HashSet<>();
    private long expiresIn;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String username, String email, String fullName, Set<String> roles, Set<String> projectIds, long expiresIn) {
        this.token = token;
        this.tokenType = "Bearer";
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.roles = roles != null ? roles : new HashSet<>();
        this.projectIds = projectIds != null ? projectIds : new HashSet<>();
        this.expiresIn = expiresIn;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
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

    public long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(long expiresIn) {
        this.expiresIn = expiresIn;
    }
}

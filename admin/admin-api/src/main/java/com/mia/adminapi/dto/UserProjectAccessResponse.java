package com.mia.adminapi.dto;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class UserProjectAccessResponse {

    private Long userId;
    private String username;
    private String userEmail;
    private String userFullName;
    private Long companyId;
    private String companyName;
    private CompanyResponse company;
    private String projectId;
    private String projectTitle;
    private boolean hasProjectAccess;
    private boolean isAdmin;
    private Set<String> userRoles = new HashSet<>();
    private List<MenuResponse> menus = new ArrayList<>();
    private int totalMenus;
    private String message;

    public UserProjectAccessResponse() {
    }

    public UserProjectAccessResponse(
            Long userId,
            String username,
            String userEmail,
            String userFullName,
            Long companyId,
            String companyName,
            CompanyResponse company,
            String projectId,
            String projectTitle,
            boolean hasProjectAccess,
            boolean isAdmin,
            Set<String> userRoles,
            List<MenuResponse> menus,
            int totalMenus,
            String message
    ) {
        this.userId = userId;
        this.username = username;
        this.userEmail = userEmail;
        this.userFullName = userFullName;
        this.companyId = companyId;
        this.companyName = companyName;
        this.company = company;
        this.projectId = projectId;
        this.projectTitle = projectTitle;
        this.hasProjectAccess = hasProjectAccess;
        this.isAdmin = isAdmin;
        this.userRoles = userRoles != null ? userRoles : new HashSet<>();
        this.menus = menus != null ? menus : new ArrayList<>();
        this.totalMenus = totalMenus;
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public CompanyResponse getCompany() {
        return company;
    }

    public void setCompany(CompanyResponse company) {
        this.company = company;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public boolean isHasProjectAccess() {
        return hasProjectAccess;
    }

    public void setHasProjectAccess(boolean hasProjectAccess) {
        this.hasProjectAccess = hasProjectAccess;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Set<String> getUserRoles() {
        return userRoles;
    }

    public void setUserRoles(Set<String> userRoles) {
        this.userRoles = userRoles;
    }

    public List<MenuResponse> getMenus() {
        return menus;
    }

    public void setMenus(List<MenuResponse> menus) {
        this.menus = menus;
    }

    public int getTotalMenus() {
        return totalMenus;
    }

    public void setTotalMenus(int totalMenus) {
        this.totalMenus = totalMenus;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

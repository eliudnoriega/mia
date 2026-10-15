package com.mia.adminapi.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 200)
    private String subtitle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "category_label", length = 80)
    private String categoryLabel;

    @Column(length = 60)
    private String icon;

    @Column(name = "icon_bg_color", length = 30)
    private String iconBgColor;

    @Column(length = 255)
    private String url;

    @Column(name = "is_favorite", nullable = false)
    private boolean isFavorite = false;

    @Column(nullable = false, length = 30)
    private String status = "active"; // active, maintenance, offline

    @Column(nullable = false, length = 20)
    private String environment = "PROD"; // PROD, STAGE, DEV

    @Column(length = 30)
    private String version;

    @Column(length = 100)
    private String team;

    @Column(length = 30)
    private String uptime = "99.9%";

    @Column(name = "last_deploy", length = 60)
    private String lastDeploy = "Reciente";

    @Column(name = "access_count", nullable = false)
    private int accessCount = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Project() {
    }

    public Project(String id, String title, String subtitle, String description, String category,
                   String categoryLabel, String icon, String iconBgColor, String url, boolean isFavorite,
                   String status, String environment, String version, String team, String uptime,
                   String lastDeploy, int accessCount) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.category = category;
        this.categoryLabel = categoryLabel;
        this.icon = icon;
        this.iconBgColor = iconBgColor;
        this.url = url;
        this.isFavorite = isFavorite;
        this.status = status;
        this.environment = environment;
        this.version = version;
        this.team = team;
        this.uptime = uptime;
        this.lastDeploy = lastDeploy;
        this.accessCount = accessCount;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public void setSubtitle(String subtitle) {
        this.subtitle = subtitle;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getCategoryLabel() {
        return categoryLabel;
    }

    public void setCategoryLabel(String categoryLabel) {
        this.categoryLabel = categoryLabel;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getIconBgColor() {
        return iconBgColor;
    }

    public void setIconBgColor(String iconBgColor) {
        this.iconBgColor = iconBgColor;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public boolean isFavorite() {
        return isFavorite;
    }

    public void setFavorite(boolean favorite) {
        isFavorite = favorite;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getUptime() {
        return uptime;
    }

    public void setUptime(String uptime) {
        this.uptime = uptime;
    }

    public String getLastDeploy() {
        return lastDeploy;
    }

    public void setLastDeploy(String lastDeploy) {
        this.lastDeploy = lastDeploy;
    }

    public int getAccessCount() {
        return accessCount;
    }

    public void setAccessCount(int accessCount) {
        this.accessCount = accessCount;
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

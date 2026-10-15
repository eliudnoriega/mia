package com.mia.adminapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CompanyRequest {

    @NotBlank(message = "El nombre de la empresa es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String name;

    @Size(max = 30, message = "El NIT/Identificador fiscal no puede exceder 30 caracteres")
    private String taxId;

    @Size(max = 200, message = "La dirección no puede exceder 200 caracteres")
    private String address;

    @Size(max = 30, message = "El teléfono no puede exceder 30 caracteres")
    private String phone;

    @Size(max = 120, message = "El correo no puede exceder 120 caracteres")
    private String email;

    @Size(max = 150, message = "El sitio web no puede exceder 150 caracteres")
    private String website;

    @Size(max = 255, message = "La URL del logo no puede exceder 255 caracteres")
    private String logoUrl;

    private Boolean active = true;

    public CompanyRequest() {
    }

    public CompanyRequest(String name, String taxId, String address, String phone, String email, String website, String logoUrl) {
        this.name = name;
        this.taxId = taxId;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.website = website;
        this.logoUrl = logoUrl;
        this.active = true;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}

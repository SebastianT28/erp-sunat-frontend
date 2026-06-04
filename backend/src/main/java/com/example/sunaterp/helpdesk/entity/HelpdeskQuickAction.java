package com.example.sunaterp.helpdesk.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "helpdesk_quick_action", schema = "soporte")
public class HelpdeskQuickAction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String label;

    @Column(nullable = false)
    private Boolean activo = true;

    private Integer orden = 0;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}

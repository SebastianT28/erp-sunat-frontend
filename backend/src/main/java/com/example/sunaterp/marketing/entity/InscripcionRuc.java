package com.example.sunaterp.marketing.entity;

import com.example.sunaterp.login.entity.Contribuyente;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inscripciones_ruc", schema = "marketing")
public class InscripcionRuc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "motivo_inscripcion", length = 150)
    private String motivoInscripcion;

    @Column(name = "actividad_economica", length = 200)
    private String actividadEconomica;

    @Column(name = "inicio_actividades")
    private LocalDate inicioActividades;

    @Column(name = "regimen_tributario", length = 50)
    private String regimenTributario;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "departamento", length = 50)
    private String departamento;

    @Column(name = "provincia", length = 50)
    private String provincia;

    @Column(name = "distrito", length = 50)
    private String distrito;

    @Column(name = "condicion_domicilio", length = 50)
    private String condicionDomicilio;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruc_contribuyente")
    private Contribuyente contribuyente;

    public InscripcionRuc() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMotivoInscripcion() { return motivoInscripcion; }
    public void setMotivoInscripcion(String motivoInscripcion) { this.motivoInscripcion = motivoInscripcion; }

    public String getActividadEconomica() { return actividadEconomica; }
    public void setActividadEconomica(String actividadEconomica) { this.actividadEconomica = actividadEconomica; }

    public LocalDate getInicioActividades() { return inicioActividades; }
    public void setInicioActividades(LocalDate inicioActividades) { this.inicioActividades = inicioActividades; }

    public String getRegimenTributario() { return regimenTributario; }
    public void setRegimenTributario(String regimenTributario) { this.regimenTributario = regimenTributario; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDepartamento() { return departamento; }
    public void setDepartamento(String departamento) { this.departamento = departamento; }

    public String getProvincia() { return provincia; }
    public void setProvincia(String provincia) { this.provincia = provincia; }

    public String getDistrito() { return distrito; }
    public void setDistrito(String distrito) { this.distrito = distrito; }

    public String getCondicionDomicilio() { return condicionDomicilio; }
    public void setCondicionDomicilio(String condicionDomicilio) { this.condicionDomicilio = condicionDomicilio; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public Contribuyente getContribuyente() { return contribuyente; }
    public void setContribuyente(Contribuyente contribuyente) { this.contribuyente = contribuyente; }
}

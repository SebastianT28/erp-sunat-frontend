package com.example.sunaterp.security;

import com.example.sunaterp.login.entity.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class UserDetailsImpl implements UserDetails {

    private final Usuario usuario;

    public UserDetailsImpl(Usuario usuario) {
        this.usuario = usuario;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // En Spring Security los roles por convención empiezan con "ROLE_"
        // Asumiendo que en la base de datos el rol sea "ADMIN", aquí será "ROLE_ADMIN"
        String rol = usuario.getRol();
        if (rol != null && !rol.startsWith("ROLE_")) {
            rol = "ROLE_" + rol;
        }
        return Collections.singletonList(new SimpleGrantedAuthority(rol));
    }

    @Override
    public String getPassword() {
        return usuario.getContrasena();
    }

    @Override
    public String getUsername() {
        // Usamos el nombreUsuario como identificador principal para el login
        return usuario.getNombreUsuario();
    }

    // Los siguientes métodos los ponemos en 'true' para permitir el acceso,
    // en un sistema más complejo se validarían banderas de la base de datos.
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getCorreo() {
        return usuario.getCorreo();
    }
}

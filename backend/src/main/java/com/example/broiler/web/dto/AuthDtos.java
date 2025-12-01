package com.example.broiler.web.dto;

import jakarta.validation.constraints.*;

public class AuthDtos {
    public static class LoginRequest {
        @NotBlank
        private String username;
        @NotBlank
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class JwtResponse {
        private String token;
        public JwtResponse(String token){ this.token = token; }
        public String getToken(){ return token; }
        public void setToken(String token){ this.token = token; }
    }
}

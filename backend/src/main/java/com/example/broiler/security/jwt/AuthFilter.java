package com.example.broiler.security.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    private final JwtUtils jwtUtils;

    public AuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            logger.debug("Processing JWT: {}", token);

            if (jwtUtils.validateJwtToken(token)) {
                Claims claims = jwtUtils.getClaimsFromJwtToken(token);
                String username = claims.getSubject();
                
                @SuppressWarnings("unchecked")
                List<String> roles = claims.get("roles", List.class);

                logger.debug("JWT validated. Username: {}, Roles from JWT: {}", username, roles);

                if (username != null && roles != null && !roles.isEmpty()) {
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(role -> {
                                String prefixedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                                logger.debug("Mapping role '{}' to authority '{}'", role, prefixedRole);
                                return new SimpleGrantedAuthority(prefixedRole);
                            })
                            .collect(Collectors.toList());

                    Authentication auth = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    logger.debug("Authentication set for user '{}' with authorities: {}", username, authorities);
                } else {
                    logger.warn("Username or roles missing/empty in JWT for token: {}", token);
                }
            } else {
                logger.warn("Invalid JWT token: {}", token);
            }
        } else {
            logger.debug("No Bearer token found in Authorization header for request: {}", request.getRequestURI());
        }
        filterChain.doFilter(request, response);
    }
}

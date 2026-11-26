package com.clienthub.api.auth;

import java.time.Instant;
import java.util.Map;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwords;
    private final JwtEncoder encoder;
    public AuthController(JdbcTemplate jdbc, PasswordEncoder passwords, JwtEncoder encoder) {
        this.jdbc = jdbc; this.passwords = passwords; this.encoder = encoder;
    }
    public record Login(@NotBlank @Email String email, @NotBlank String password) {}
    private record User(String email, String hash, String role) {}
    @PostMapping("/login")
    public Map<String,Object> login(@Valid @RequestBody Login request) {
        var users = jdbc.query("SELECT email, password_hash, role FROM app_users WHERE email = ? AND enabled = true",
            (rs,n) -> new User(rs.getString(1),rs.getString(2),rs.getString(3)),
            request.email().trim().toLowerCase(java.util.Locale.ROOT));
        if (users.isEmpty() || !passwords.matches(request.password(), users.getFirst().hash()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        var user = users.getFirst();
        var now = Instant.now();
        var claims = JwtClaimsSet.builder().issuer("clienthub").subject(user.email())
            .issuedAt(now).expiresAt(now.plusSeconds(900)).claim("role",user.role()).build();
        var token = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),claims));
        return Map.of("accessToken",token.getTokenValue(),"tokenType","Bearer","expiresIn",900,"role",user.role());
    }
    @GetMapping("/me")
    public Map<String,String> me(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("email",jwt.getSubject(),"role",jwt.getClaimAsString("role"));
    }
}

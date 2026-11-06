package com.nexus.pdverp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_movements")
@Getter
@Setter
@NoArgsConstructor
public class CashMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "cash_register_id", nullable = false)
    private Long cashRegisterId;

    @NotBlank
    @Column(length = 30, nullable = false)
    private String type; // SANGRIA, SUPRIMENTO, ABERTURA, FECHAMENTO

    @NotNull
    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "authorized_by")
    private String authorizedBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}

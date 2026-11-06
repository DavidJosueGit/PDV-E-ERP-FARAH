package com.nexus.pdverp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cash_registers")
@Getter
@Setter
@NoArgsConstructor
public class CashRegister {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "terminal_number", nullable = false)
    private Integer terminalNumber;

    @NotNull
    @Column(name = "operator_id", nullable = false)
    private Long operatorId;

    @Column(name = "opened_at", nullable = false)
    private LocalDateTime openedAt = LocalDateTime.now();

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @NotNull
    @Column(name = "initial_balance", precision = 15, scale = 2, nullable = false)
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @NotNull
    @Column(name = "current_balance", precision = 15, scale = 2, nullable = false)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @NotNull
    @Column(name = "total_sales", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalSales = BigDecimal.ZERO;

    @NotNull
    @Column(name = "total_sangria", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalSangria = BigDecimal.ZERO;

    @NotNull
    @Column(name = "total_suprimento", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalSuprimento = BigDecimal.ZERO;

    @Column(name = "counted_cash", precision = 15, scale = 2)
    private BigDecimal countedCash;

    @Column(name = "cash_difference", precision = 15, scale = 2)
    private BigDecimal cashDifference = BigDecimal.ZERO;

    @Column(length = 20, nullable = false)
    private String status = "ABERTO"; // ABERTO, FECHADO

    @Column(name = "closing_notes", columnDefinition = "TEXT")
    private String closingNotes;

    @Column(name = "closed_by_manager")
    private String closedByManager;
}

package com.nexus.pdverp.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Builder
public class CashCloseResponse {

    private Long cashRegisterId;
    private Integer terminalNumber;
    private Long operatorId;
    private String status;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
    private BigDecimal initialBalance;
    private BigDecimal totalSales;
    private BigDecimal totalSangria;
    private BigDecimal totalSuprimento;
    private BigDecimal expectedCashBalance;
    private BigDecimal actualCashCounted;
    private BigDecimal difference; // >0 Sobra, <0 Falta
    private String varianceStatus; // EXATO, SOBRA_CAIXA, FALTA_CAIXA
    private Map<String, BigDecimal> paymentsBreakdown;
    private String closingNotes;
    private String authorizedByManager;
    private String protocolNumber;
}

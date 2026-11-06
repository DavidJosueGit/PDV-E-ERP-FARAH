package com.nexus.pdverp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class CashCloseRequest {

    private String closingNotes;

    @NotNull(message = "O valor contado em dinheiro na gaveta é obrigatório para conciliação cega")
    private BigDecimal actualCashCounted;

    private String managerPassword;

    private Long managerId;
}

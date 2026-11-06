package com.nexus.pdverp.service;

import com.nexus.pdverp.dto.CashCloseRequest;
import com.nexus.pdverp.dto.CashCloseResponse;
import com.nexus.pdverp.entity.CashMovement;
import com.nexus.pdverp.entity.CashRegister;
import com.nexus.pdverp.repository.CashMovementRepository;
import com.nexus.pdverp.repository.CashRegisterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final CashMovementRepository cashMovementRepository;

    /**
     * Abertura de Caixa do Terminal de Vendas com Fundo de Troco
     */
    @Transactional
    public CashRegister openCashRegister(Integer terminalNumber, Long operatorId, BigDecimal initialBalance) {
        cashRegisterRepository.findFirstByTerminalNumberAndStatus(terminalNumber, "ABERTO")
                .ifPresent(c -> {
                    throw new IllegalStateException("Já existe um caixa aberto para o terminal #" + terminalNumber);
                });

        CashRegister cash = new CashRegister();
        cash.setTerminalNumber(terminalNumber);
        cash.setOperatorId(operatorId);
        cash.setOpenedAt(LocalDateTime.now());
        cash.setInitialBalance(initialBalance != null ? initialBalance : BigDecimal.ZERO);
        cash.setCurrentBalance(cash.getInitialBalance());
        cash.setStatus("ABERTO");

        CashRegister saved = cashRegisterRepository.save(cash);

        // Registro de Movimentação de Abertura
        CashMovement movement = new CashMovement();
        movement.setCashRegisterId(saved.getId());
        movement.setType("ABERTURA");
        movement.setAmount(cash.getInitialBalance());
        movement.setReason("Abertura de caixa com fundo de troco inicial");
        movement.setUserId(operatorId);
        movement.setCreatedAt(LocalDateTime.now());
        cashMovementRepository.save(movement);

        log.info("Caixa #{} aberto pelo operador ID {} com fundo inicial de R$ {}", terminalNumber, operatorId, initialBalance);
        return saved;
    }

    /**
     * Realiza o Fechamento de Caixa com Conciliação Cega e Apuração de Quebra/Sobra
     */
    @Transactional
    public CashCloseResponse closeCashRegister(Long cashRegisterId, CashCloseRequest request) {
        CashRegister cash = cashRegisterRepository.findById(cashRegisterId)
                .orElseThrow(() -> new IllegalArgumentException("Caixa com ID " + cashRegisterId + " não encontrado"));

        if (!"ABERTO".equalsIgnoreCase(cash.getStatus())) {
            throw new IllegalStateException("O caixa #" + cash.getTerminalNumber() + " já se encontra fechado.");
        }

        BigDecimal countedCash = request.getActualCashCounted() != null ? request.getActualCashCounted() : BigDecimal.ZERO;
        BigDecimal expectedBalance = cash.getCurrentBalance();
        BigDecimal difference = countedCash.subtract(expectedBalance);

        String varianceStatus;
        if (difference.compareTo(BigDecimal.ZERO) == 0) {
            varianceStatus = "EXATO";
        } else if (difference.compareTo(BigDecimal.ZERO) > 0) {
            varianceStatus = "SOBRA_CAIXA";
        } else {
            varianceStatus = "FALTA_CAIXA";
        }

        // Validação da senha gerencial se houver divergência de valores ou autorização expressa
        String managerName = "Gerente Geral";
        if (request.getManagerPassword() != null && !request.getManagerPassword().isBlank()) {
            if (!"1234".equals(request.getManagerPassword().trim())) {
                throw new SecurityException("Senha gerencial incorreta para homologação do fechamento de caixa.");
            }
            managerName = request.getManagerId() != null ? "Gerente #" + request.getManagerId() : "Gerência Autorizada";
        }

        // Atualiza estado do caixa
        cash.setStatus("FECHADO");
        cash.setClosedAt(LocalDateTime.now());
        cash.setCountedCash(countedCash);
        cash.setCashDifference(difference);
        cash.setClosingNotes(request.getClosingNotes());
        cash.setClosedByManager(managerName);

        cashRegisterRepository.save(cash);

        // Movimentação de auditoria do fechamento
        CashMovement closeMovement = new CashMovement();
        closeMovement.setCashRegisterId(cash.getId());
        closeMovement.setType("FECHAMENTO");
        closeMovement.setAmount(countedCash);
        closeMovement.setReason(String.format("Fechamento apurado. Esperado: R$ %.2f | Contado: R$ %.2f | Diferença: R$ %.2f (%s)",
                expectedBalance, countedCash, difference, varianceStatus));
        closeMovement.setUserId(cash.getOperatorId());
        closeMovement.setAuthorizedBy(managerName);
        closeMovement.setCreatedAt(LocalDateTime.now());
        cashMovementRepository.save(closeMovement);

        // Gera protocolo de fechamento
        String protocol = "FECH-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss")) + "-" + cash.getTerminalNumber();

        Map<String, BigDecimal> payments = new HashMap<>();
        payments.put("DINHEIRO", expectedBalance.subtract(cash.getInitialBalance()).add(cash.getTotalSangria()).subtract(cash.getTotalSuprimento()));
        payments.put("TOTAL_VENDAS", cash.getTotalSales());
        payments.put("SANGRIA_TOTAL", cash.getTotalSangria());
        payments.put("SUPRIMENTO_TOTAL", cash.getTotalSuprimento());

        log.info("Caixa #{} FECHADO com sucesso. Protocolo: {}", cash.getTerminalNumber(), protocol);

        return CashCloseResponse.builder()
                .cashRegisterId(cash.getId())
                .terminalNumber(cash.getTerminalNumber())
                .operatorId(cash.getOperatorId())
                .status("FECHADO")
                .openedAt(cash.getOpenedAt())
                .closedAt(cash.getClosedAt())
                .initialBalance(cash.getInitialBalance())
                .totalSales(cash.getTotalSales())
                .totalSangria(cash.getTotalSangria())
                .totalSuprimento(cash.getTotalSuprimento())
                .expectedCashBalance(expectedBalance)
                .actualCashCounted(countedCash)
                .difference(difference)
                .varianceStatus(varianceStatus)
                .paymentsBreakdown(payments)
                .closingNotes(cash.getClosingNotes())
                .authorizedByManager(managerName)
                .protocolNumber(protocol)
                .build();
    }

    /**
     * Executa Sangria de Caixa com Validação Obrigatória de Senha da Gerente
     */
    @Transactional
    public CashMovement addSangria(Long cashRegisterId, BigDecimal amount, String reason, Long userId, String managerPassword, String managerName) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("O valor da sangria deve ser maior que zero.");
        }

        // Validação da senha da gerente
        if (managerPassword == null || !"1234".equals(managerPassword.trim())) {
            throw new SecurityException("Senha incorreta. A sangria exige aprovação por senha de uma gerente.");
        }

        CashRegister cash = cashRegisterRepository.findById(cashRegisterId)
                .orElseThrow(() -> new IllegalArgumentException("Caixa com ID " + cashRegisterId + " não encontrado"));

        if (!"ABERTO".equalsIgnoreCase(cash.getStatus())) {
            throw new IllegalStateException("O caixa se encontra fechado.");
        }

        if (cash.getCurrentBalance().compareTo(amount) < 0) {
            throw new IllegalStateException(String.format("Saldo em gaveta (R$ %.2f) insuficiente para sangria de R$ %.2f",
                    cash.getCurrentBalance(), amount));
        }

        cash.setCurrentBalance(cash.getCurrentBalance().subtract(amount));
        cash.setTotalSangria(cash.getTotalSangria().add(amount));
        cashRegisterRepository.save(cash);

        CashMovement movement = new CashMovement();
        movement.setCashRegisterId(cashRegisterId);
        movement.setType("SANGRIA");
        movement.setAmount(amount);
        movement.setReason(reason);
        movement.setUserId(userId);
        movement.setAuthorizedBy(managerName != null ? managerName : "Gerente Homologadora");
        movement.setCreatedAt(LocalDateTime.now());

        return cashMovementRepository.save(movement);
    }

    /**
     * Consulta o Caixa Atualmente Aberto
     */
    public CashRegister getCurrentCashRegister() {
        return cashRegisterRepository.findFirstByStatusOrderByOpenedAtDesc("ABERTO").orElse(null);
    }
}

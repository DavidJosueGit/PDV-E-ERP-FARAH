package com.nexus.pdverp.controller;

import com.nexus.pdverp.dto.CashCloseRequest;
import com.nexus.pdverp.dto.CashCloseResponse;
import com.nexus.pdverp.entity.CashMovement;
import com.nexus.pdverp.entity.CashRegister;
import com.nexus.pdverp.service.CashRegisterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/cash-register")
@RequiredArgsConstructor
@Tag(name = "Controle de Caixa & Fechamento", description = "Endpoints de abertura, conferência de gaveta, sangrias, suprimentos e fechamento de turno com conciliação contábil")
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @GetMapping("/current")
    @Operation(summary = "Consultar caixa ativo", description = "Retorna o status e saldo apurado do caixa em operação no terminal")
    @ApiResponse(responseCode = "200", description = "Dados do caixa atual retornados")
    public ResponseEntity<CashRegister> getCurrentCashRegister() {
        CashRegister cash = cashRegisterService.getCurrentCashRegister();
        return cash != null ? ResponseEntity.ok(cash) : ResponseEntity.noContent().build();
    }

    @PostMapping("/open")
    @Operation(summary = "Abertura de Caixa", description = "Inicia o turno de vendas informando número do terminal e fundo de troco inicial")
    @ApiResponse(responseCode = "201", description = "Caixa aberto com sucesso")
    public ResponseEntity<CashRegister> openCashRegister(
            @RequestParam Integer terminalNumber,
            @RequestParam Long operatorId,
            @RequestParam(required = false, defaultValue = "0.00") BigDecimal initialBalance) {
        CashRegister created = cashRegisterService.openCashRegister(terminalNumber, operatorId, initialBalance);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/close")
    @Operation(
            summary = "Fechamento de Caixa (Encerramento de Turno)",
            description = "Executa o fechamento contábil e físico do caixa com conciliação de gaveta (contagem cega), apuração de quebra/sobra e homologação gerencial."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Fechamento concluído com relatório de conciliação emitido",
                    content = @Content(schema = @Schema(implementation = CashCloseResponse.class))),
            @ApiResponse(responseCode = "400", description = "Dados de contagem inválidos"),
            @ApiResponse(responseCode = "403", description = "Senha gerencial inválida para homologação de divergência"),
            @ApiResponse(responseCode = "404", description = "Caixa não encontrado")
    })
    public ResponseEntity<CashCloseResponse> closeCashRegister(
            @Parameter(description = "ID do registro de caixa a ser encerrado", required = true)
            @PathVariable Long id,
            @Valid @RequestBody CashCloseRequest request) {
        CashCloseResponse response = cashRegisterService.closeCashRegister(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/sangria")
    @Operation(
            summary = "Sangria de Caixa (Retirada de Dinheiro)",
            description = "Realiza a retirada de dinheiro da gaveta para cofre. Exige obrigatoriamente validação por senha de uma gerente."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Sangria autorizada e registrada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Senha da gerente incorreta"),
            @ApiResponse(responseCode = "400", description = "Saldo em dinheiro na gaveta insuficiente")
    })
    public ResponseEntity<CashMovement> addSangria(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String reason = (String) payload.getOrDefault("reason", "Sangria para cofre de segurança");
        Long userId = Long.valueOf(payload.getOrDefault("userId", "1").toString());
        String managerPassword = (String) payload.get("managerPassword");
        String managerName = (String) payload.getOrDefault("managerName", "Gerente");

        CashMovement movement = cashRegisterService.addSangria(id, amount, reason, userId, managerPassword, managerName);
        return ResponseEntity.ok(movement);
    }
}

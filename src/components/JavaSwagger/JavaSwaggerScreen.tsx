import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Layers,
  Database,
  Container,
  BookOpen,
  Play,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const JavaSwaggerScreen: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'SWAGGER' | 'JAVA_CODE' | 'DOCKER' | 'FLYWAY'>('SWAGGER');
  const [copied, setCopied] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('sales_create');
  const [selectedJavaFile, setSelectedJavaFile] = useState<'CashRegisterController' | 'CashRegisterService' | 'CashRegister' | 'SaleService'>('CashRegisterController');
  const [endpointResponse, setEndpointResponse] = useState<string>('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteEndpoint = (endpointId: string) => {
    const db = StorageService.getDatabase();
    if (endpointId === 'sales_create') {
      const lastSale = db.sales[0];
      setEndpointResponse(JSON.stringify({
        status: 201,
        message: 'Venda criada com sucesso e estoque baixado via Spring Transaction',
        data: lastSale || { id: 'sale-mock', total: 45.70, status: 'CONCLUIDA' }
      }, null, 2));
    } else if (endpointId === 'products_list') {
      setEndpointResponse(JSON.stringify({
        status: 200,
        totalElements: db.products.length,
        content: db.products.slice(0, 3)
      }, null, 2));
    } else if (endpointId === 'fiscal_status') {
      setEndpointResponse(JSON.stringify({
        status: 200,
        sefazStatus: '107 - Serviço em Operação',
        ambiente: 'HOMOLOGACAO',
        versaoLayout: '4.00',
        timestamp: new Date().toISOString()
      }, null, 2));
    } else if (endpointId === 'cash_status') {
      const activeCash = StorageService.getActiveCashRegister();
      setEndpointResponse(JSON.stringify({
        status: 200,
        caixa: activeCash || { status: 'FECHADO', message: 'Nenhum terminal aberto' }
      }, null, 2));
    } else if (endpointId === 'cash_close') {
      const activeCash = StorageService.getActiveCashRegister();
      const terminal = activeCash ? activeCash.terminalNumber : 1;
      const expected = activeCash ? activeCash.currentBalance : 195.70;
      setEndpointResponse(JSON.stringify({
        status: 200,
        message: 'Fechamento de caixa concluído com sucesso e conciliação homologada',
        data: {
          cashRegisterId: activeCash?.id || 'cx-1',
          terminalNumber: terminal,
          status: 'FECHADO',
          openedAt: activeCash?.openedAt || '2026-11-05T08:00:00Z',
          closedAt: new Date().toISOString(),
          initialBalance: activeCash?.initialBalance || 150.00,
          totalSales: activeCash?.totalSales || 45.70,
          totalSangria: activeCash?.totalSangria || 0.00,
          totalSuprimento: activeCash?.totalSuprimento || 0.00,
          expectedCashBalance: expected,
          actualCashCounted: expected,
          difference: 0.00,
          varianceStatus: 'EXATO',
          paymentsBreakdown: activeCash?.paymentsBreakdown || {
            DINHEIRO: 0.00,
            PIX: 45.70,
            CARTAO_CREDITO: 0.00,
            CARTAO_DEBITO: 0.00
          },
          closingNotes: 'Encerramento de turno sem divergências.',
          authorizedByManager: 'Fernanda Lima (Gerente)',
          protocolNumber: `FECH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${terminal}-8932`
        }
      }, null, 2));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F6F5F1] p-6 overflow-y-auto space-y-6 text-[#252525]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E2D8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CF1020]"></span>
            <h1 className="text-xl font-black text-[#242424] tracking-tight flex items-center gap-2">
              <Code2 className="w-5 h-5 text-[#242424]" />
              <span>Arquitetura Back-End Java 21 & OpenAPI (Swagger) — Farah</span>
            </h1>
          </div>
          <p className="text-xs text-[#6B6862] mt-1">
            Projeto enterprise Spring Boot 3, Spring Data JPA, PostgreSQL, Flyway, Docker Compose e contratos RESTful.
          </p>
        </div>

        {/* Seletor de Modo */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveSection('SWAGGER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'SWAGGER'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Swagger UI / REST APIs
          </button>
          <button
            onClick={() => setActiveSection('JAVA_CODE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'JAVA_CODE'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fontes Java (Spring Boot)
          </button>
          <button
            onClick={() => setActiveSection('FLYWAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'FLYWAY'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Flyway SQL (PostgreSQL)
          </button>
          <button
            onClick={() => setActiveSection('DOCKER')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'DOCKER'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Docker Compose
          </button>
        </div>
      </div>

      {/* Seção Swagger OpenAPI Interativo */}
      {activeSection === 'SWAGGER' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded font-mono font-bold border border-emerald-500/30">
                OAS 3.0.3
              </span>
              <div>
                <h3 className="font-bold text-white text-sm">Nexus PDV + ERP REST API Specifications</h3>
                <span className="text-[11px] text-slate-400">Base URL: <strong className="text-slate-300 font-mono">http://localhost:8080/api/v1</strong></span>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              Autenticação: <span className="text-orange-400 font-mono">Bearer &lt;JWT&gt;</span>
            </div>
          </div>

          {/* Endpoints Lista */}
          <div className="space-y-3">
            {/* POST /api/v1/sales */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-850 flex items-center justify-between cursor-pointer" onClick={() => setSelectedEndpoint('sales_create')}>
                <div className="flex items-center gap-3">
                  <span className="bg-emerald-600 text-white font-bold font-mono text-[11px] px-2.5 py-0.5 rounded">POST</span>
                  <span className="font-mono text-xs text-white font-semibold">/api/v1/sales</span>
                  <span className="text-xs text-slate-400">Registrar Venda PDV, baixar estoque e autorizar NFC-e</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteEndpoint('sales_create');
                  }}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Testar (Try it)</span>
                </button>
              </div>
              {selectedEndpoint === 'sales_create' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs space-y-3 font-mono">
                  <div className="text-slate-400 text-[11px]">Request Body (application/json):</div>
                  <pre className="bg-slate-900 p-3 rounded text-slate-300 overflow-x-auto">
{`{
  "cashRegisterId": "cx-1",
  "items": [
    { "productId": "prod-1", "quantity": 2, "unitPrice": 11.90, "discount": 0 }
  ],
  "payments": [
    { "method": "PIX", "amount": 23.80 }
  ],
  "customerCpfCnpj": "123.456.789-00",
  "emitFiscalInvoice": true
}`}
                  </pre>
                </div>
              )}
            </div>

            {/* GET /api/v1/products */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-850 flex items-center justify-between cursor-pointer" onClick={() => setSelectedEndpoint('products_list')}>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white font-bold font-mono text-[11px] px-2.5 py-0.5 rounded">GET</span>
                  <span className="font-mono text-xs text-white font-semibold">/api/v1/products</span>
                  <span className="text-xs text-slate-400">Listagem paginada e consulta por código de barras / SKU</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteEndpoint('products_list');
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Testar (Try it)</span>
                </button>
              </div>
            </div>

            {/* GET /api/v1/fiscal/sefaz-status */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-850 flex items-center justify-between cursor-pointer" onClick={() => setSelectedEndpoint('fiscal_status')}>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white font-bold font-mono text-[11px] px-2.5 py-0.5 rounded">GET</span>
                  <span className="font-mono text-xs text-white font-semibold">/api/v1/fiscal/sefaz-status</span>
                  <span className="text-xs text-slate-400">Verificar status de homologação/produção dos servidores SEFAZ</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteEndpoint('fiscal_status');
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Testar (Try it)</span>
                </button>
              </div>
            </div>

            {/* GET /api/v1/cash-register/current */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-850 flex items-center justify-between cursor-pointer" onClick={() => setSelectedEndpoint('cash_status')}>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-600 text-white font-bold font-mono text-[11px] px-2.5 py-0.5 rounded">GET</span>
                  <span className="font-mono text-xs text-white font-semibold">/api/v1/cash-register/current</span>
                  <span className="text-xs text-slate-400">Obter status atual do terminal de caixa e saldo apurado</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteEndpoint('cash_status');
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Testar (Try it)</span>
                </button>
              </div>
            </div>

            {/* POST /api/v1/cash-register/{id}/close */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-slate-850 flex items-center justify-between cursor-pointer" onClick={() => setSelectedEndpoint('cash_close')}>
                <div className="flex items-center gap-3">
                  <span className="bg-rose-600 text-white font-bold font-mono text-[11px] px-2.5 py-0.5 rounded">POST</span>
                  <span className="font-mono text-xs text-white font-semibold">/api/v1/cash-register/{`{id}`}/close</span>
                  <span className="text-xs text-slate-400">Fechamento de Caixa, conciliação de gaveta (contagem cega) e homologação</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteEndpoint('cash_close');
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Testar (Try it)</span>
                </button>
              </div>
              {selectedEndpoint === 'cash_close' && (
                <div className="p-4 bg-slate-950 border-t border-slate-800 text-xs space-y-3 font-mono">
                  <div className="text-slate-400 text-[11px]">Request Body (application/json):</div>
                  <pre className="bg-slate-900 p-3 rounded text-slate-300 overflow-x-auto">
{`{
  "actualCashCounted": 195.70,
  "closingNotes": "Turno encerrado sem divergências.",
  "managerPassword": "••••",
  "managerId": 2
}`}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Resposta do Teste ao Vivo */}
          {endpointResponse && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Resposta da Requisição HTTP (200 OK)
                </span>
                <button
                  onClick={() => copyToClipboard(endpointResponse)}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar JSON</span>
                </button>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-60">
                {endpointResponse}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Seção Código Java Spring Boot */}
      {activeSection === 'JAVA_CODE' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-orange-400" />
              <h2 className="font-bold text-white text-sm">
                {selectedJavaFile === 'CashRegisterController' && 'CashRegisterController.java (REST API Fechamento de Caixa & Sangria)'}
                {selectedJavaFile === 'CashRegisterService' && 'CashRegisterService.java (Regras de Fechamento, Conciliação e Senha da Gerente)'}
                {selectedJavaFile === 'CashRegister' && 'CashRegister.java (Entidade JPA / Tabela cash_registers)'}
                {selectedJavaFile === 'SaleService' && 'SaleService.java (Regra Transacional e Baixa de Estoque)'}
              </h2>
            </div>
            
            {/* Seletor de Arquivos Java */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedJavaFile('CashRegisterController')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedJavaFile === 'CashRegisterController'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CashRegisterController.java
              </button>
              <button
                onClick={() => setSelectedJavaFile('CashRegisterService')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedJavaFile === 'CashRegisterService'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CashRegisterService.java
              </button>
              <button
                onClick={() => setSelectedJavaFile('CashRegister')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedJavaFile === 'CashRegister'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                CashRegister.java
              </button>
              <button
                onClick={() => setSelectedJavaFile('SaleService')}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                  selectedJavaFile === 'SaleService'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                SaleService.java
              </button>
            </div>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-[60vh]">
            {selectedJavaFile === 'CashRegisterController' && `package com.nexus.pdverp.controller;

import com.nexus.pdverp.dto.CashCloseRequest;
import com.nexus.pdverp.dto.CashCloseResponse;
import com.nexus.pdverp.entity.CashMovement;
import com.nexus.pdverp.entity.CashRegister;
import com.nexus.pdverp.service.CashRegisterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/cash-register")
@RequiredArgsConstructor
@Tag(name = "Controle de Caixa & Fechamento")
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping("/{id}/close")
    @Operation(summary = "Fechamento de Caixa com Conciliação Cega e Homologação Gerencial")
    public ResponseEntity<CashCloseResponse> closeCashRegister(
            @PathVariable Long id,
            @Valid @RequestBody CashCloseRequest request) {
        CashCloseResponse response = cashRegisterService.closeCashRegister(id, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/sangria")
    @Operation(summary = "Sangria de Caixa - Requer Senha Gerencial")
    public ResponseEntity<CashMovement> addSangria(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        BigDecimal amount = new BigDecimal(payload.get("amount").toString());
        String reason = (String) payload.getOrDefault("reason", "Sangria para cofre");
        Long userId = Long.valueOf(payload.getOrDefault("userId", "1").toString());
        String managerPassword = (String) payload.get("managerPassword");
        String managerName = (String) payload.getOrDefault("managerName", "Gerente");

        CashMovement movement = cashRegisterService.addSangria(id, amount, reason, userId, managerPassword, managerName);
        return ResponseEntity.ok(movement);
    }

    @GetMapping("/current")
    @Operation(summary = "Consultar caixa aberto atualmente")
    public ResponseEntity<CashRegister> getCurrentCashRegister() {
        CashRegister cash = cashRegisterService.getCurrentCashRegister();
        return cash != null ? ResponseEntity.ok(cash) : ResponseEntity.noContent().build();
    }
}`}
            {selectedJavaFile === 'CashRegisterService' && `package com.nexus.pdverp.service;

import com.nexus.pdverp.dto.CashCloseRequest;
import com.nexus.pdverp.dto.CashCloseResponse;
import com.nexus.pdverp.entity.*;
import com.nexus.pdverp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CashRegisterService {

    private final CashRegisterRepository cashRegisterRepository;
    private final CashMovementRepository cashMovementRepository;

    /**
     * Fechamento de Caixa com Conciliação e Apuração de Quebra/Sobra de Caixa
     */
    @Transactional
    public CashCloseResponse closeCashRegister(Long cashRegisterId, CashCloseRequest request) {
        CashRegister cash = cashRegisterRepository.findById(cashRegisterId)
                .orElseThrow(() -> new IllegalArgumentException("Caixa ID " + cashRegisterId + " não encontrado"));

        if (!"ABERTO".equalsIgnoreCase(cash.getStatus())) {
            throw new IllegalStateException("O caixa já se encontra fechado.");
        }

        BigDecimal countedCash = request.getActualCashCounted();
        BigDecimal expectedBalance = cash.getCurrentBalance();
        BigDecimal difference = countedCash.subtract(expectedBalance);

        String varianceStatus = difference.compareTo(BigDecimal.ZERO) == 0 ? "EXATO" :
                difference.compareTo(BigDecimal.ZERO) > 0 ? "SOBRA_CAIXA" : "FALTA_CAIXA";

        // Validação da senha gerencial para chancela
        String managerName = "Gerente Geral";
        if (request.getManagerPassword() != null && !request.getManagerPassword().isBlank()) {
            if (!"1234".equals(request.getManagerPassword().trim())) {
                throw new SecurityException("Senha gerencial incorreta para homologação do fechamento de caixa.");
            }
            managerName = request.getManagerId() != null ? "Gerente #" + request.getManagerId() : "Gerência";
        }

        cash.setStatus("FECHADO");
        cash.setClosedAt(LocalDateTime.now());
        cash.setCountedCash(countedCash);
        cash.setCashDifference(difference);
        cash.setClosingNotes(request.getClosingNotes());
        cash.setClosedByManager(managerName);

        cashRegisterRepository.save(cash);

        return CashCloseResponse.builder()
                .cashRegisterId(cash.getId())
                .terminalNumber(cash.getTerminalNumber())
                .status("FECHADO")
                .closedAt(cash.getClosedAt())
                .expectedCashBalance(expectedBalance)
                .actualCashCounted(countedCash)
                .difference(difference)
                .varianceStatus(varianceStatus)
                .authorizedByManager(managerName)
                .build();
    }
}`}
            {selectedJavaFile === 'CashRegister' && `package com.nexus.pdverp.entity;

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
    @Column(name = "initial_balance", precision = 15, scale = 2)
    private BigDecimal initialBalance = BigDecimal.ZERO;

    @NotNull
    @Column(name = "current_balance", precision = 15, scale = 2)
    private BigDecimal currentBalance = BigDecimal.ZERO;

    @Column(name = "counted_cash", precision = 15, scale = 2)
    private BigDecimal countedCash;

    @Column(name = "cash_difference", precision = 15, scale = 2)
    private BigDecimal cashDifference = BigDecimal.ZERO;

    @Column(length = 20, nullable = false)
    private String status = "ABERTO"; // ABERTO, FECHADO

    @Column(name = "closing_notes", columnDefinition = "TEXT")
    private String closingNotes;
}`}
            {selectedJavaFile === 'SaleService' && `package com.nexus.pdverp.service;

import com.nexus.pdverp.dto.SaleRequestDTO;
import com.nexus.pdverp.dto.SaleResponseDTO;
import com.nexus.pdverp.entity.*;
import com.nexus.pdverp.exception.BusinessException;
import com.nexus.pdverp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final CashRegisterRepository cashRegisterRepository;
    private final StockMovementRepository stockMovementRepository;
    private final FiscalService fiscalService;

    @Transactional
    public SaleResponseDTO createSale(SaleRequestDTO dto, Long operatorId) {
        CashRegister cash = cashRegisterRepository.findById(dto.getCashRegisterId())
                .orElseThrow(() -> new BusinessException("Caixa não encontrado"));
        
        if (!"ABERTO".equalsIgnoreCase(cash.getStatus())) {
            throw new BusinessException("Operação negada: o caixa encontra-se fechado!");
        }

        // Processa venda, baixa estoque e gera NFC-e
        return new SaleResponseDTO();
    }
}`}
          </pre>
        </div>
      )}

      {/* Seção Flyway SQL */}
      {activeSection === 'FLYWAY' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-white text-sm">V1__initial_schema.sql (PostgreSQL 16)</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">src/main/resources/db/migration</span>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-96">
{`-- V1__initial_schema.sql - Nexus PDV + ERP Comercial Schema
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- ADMIN, GERENTE, OPERADOR_CAIXA, ESTOQUISTA
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20)
);

CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE NOT NULL,
    category_id BIGINT REFERENCES categories(id),
    cost_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    sale_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    current_stock INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 0,
    unit VARCHAR(10) NOT NULL DEFAULT 'UN',
    ncm VARCHAR(20) NOT NULL,
    cfop VARCHAR(10) NOT NULL,
    cst_csosn VARCHAR(10) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cash_registers (
    id BIGSERIAL PRIMARY KEY,
    terminal_number INTEGER NOT NULL,
    operator_id BIGINT REFERENCES users(id),
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE,
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    total_sales NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ABERTO'
);

CREATE TABLE sales (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    cash_register_id BIGINT REFERENCES cash_registers(id),
    operator_id BIGINT REFERENCES users(id),
    subtotal NUMERIC(15, 2) NOT NULL,
    discount_total NUMERIC(15, 2) DEFAULT 0.00,
    total NUMERIC(15, 2) NOT NULL,
    status VARCHAR(30) NOT NULL,
    fiscal_key VARCHAR(44),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
          </pre>
        </div>
      )}

      {/* Seção Docker Compose */}
      {activeSection === 'DOCKER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Container className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-white text-sm">docker-compose.yml & Dockerfile (Java 21 + Postgres 16)</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">Ambiente de Produção e Desenvolvimento</span>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
{`version: '3.8'

services:
  postgres-db:
    image: postgres:16-alpine
    container_name: nexus-postgres-db
    environment:
      POSTGRES_DB: nexus_pdv_erp
      POSTGRES_USER: nexus_admin
      POSTGRES_PASSWORD: SecretPassword123!
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexus_admin -d nexus_pdv_erp"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend-app:
    build:
      context: ./backend-java
      dockerfile: Dockerfile
    container_name: nexus-spring-backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres-db:5432/nexus_pdv_erp
      SPRING_DATASOURCE_USERNAME: nexus_admin
      SPRING_DATASOURCE_PASSWORD: SecretPassword123!
      JWT_SECRET: 9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f
    depends_on:
      postgres-db:
        condition: service_healthy

volumes:
  pgdata:`}
          </pre>
        </div>
      )}
    </div>
  );
};

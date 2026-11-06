import { Sale, Invoice } from '../types';

export interface PrinterConfig {
  mode: 'PAGBANK_P2B' | 'BROWSER_SPOOLER';
  p2bIp: string;
  p2bPort: number;
  paperWidth: '80mm' | '58mm';
  autoPrintAfterSale: boolean;
}

const STORAGE_PRINTER_KEY = 'FARAH_PRINTER_CONFIG_V1';

export const DEFAULT_PRINTER_CONFIG: PrinterConfig = {
  mode: 'BROWSER_SPOOLER',
  p2bIp: '192.168.1.150',
  p2bPort: 8080,
  paperWidth: '80mm',
  autoPrintAfterSale: false,
};

export interface PrintResult {
  success: boolean;
  message: string;
  errorType?: 'NOT_FOUND' | 'CONNECTION_FAILED' | 'SEND_FAILED';
}

export class PrintService {
  static getConfig(): PrinterConfig {
    if (typeof window === 'undefined') return DEFAULT_PRINTER_CONFIG;
    try {
      const data = localStorage.getItem(STORAGE_PRINTER_KEY);
      if (!data) return DEFAULT_PRINTER_CONFIG;
      return { ...DEFAULT_PRINTER_CONFIG, ...JSON.parse(data) };
    } catch {
      return DEFAULT_PRINTER_CONFIG;
    }
  }

  static saveConfig(config: PrinterConfig): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_PRINTER_KEY, JSON.stringify(config));
  }

  /**
   * Gera o layout de texto formatado para impressora térmica (ESC/POS ou linha a linha)
   * Respeitando largura de 42/48 colunas (80mm) ou 32 colunas (58mm)
   */
  static formatReceiptText(sale: Sale, invoice?: Invoice, width: '80mm' | '58mm' = '80mm'): string {
    const cols = width === '80mm' ? 48 : 32;
    const divider = '-'.repeat(cols);
    const doubleDivider = '='.repeat(cols);

    const padCenter = (text: string) => {
      const pad = Math.max(0, Math.floor((cols - text.length) / 2));
      return ' '.repeat(pad) + text;
    };

    const padBetween = (left: string, right: string) => {
      const spaces = Math.max(1, cols - left.length - right.length);
      return left + ' '.repeat(spaces) + right;
    };

    const lines: string[] = [];

    lines.push(doubleDivider);
    lines.push(padCenter('FARAH ESFIHARIA E PIZZARIA LTDA'));
    lines.push(padCenter('CNPJ: 12.345.678/0001-90'));
    lines.push(padCenter('Rua das Esfihas Tradicionais, 120 - SP'));
    lines.push(divider);

    lines.push(padBetween(`Venda: ${sale.code}`, new Date(sale.createdAt).toLocaleDateString('pt-BR')));
    lines.push(padBetween(`Operador: ${sale.operatorName.split(' ')[0]}`, new Date(sale.createdAt).toLocaleTimeString('pt-BR')));
    lines.push(`Caixa: #${sale.cashRegisterId}`);
    lines.push(`Consumidor: ${sale.customerName || 'Consumidor Final'}`);
    if (sale.customerCpfCnpj) {
      lines.push(`CPF/CNPJ: ${sale.customerCpfCnpj}`);
    }
    lines.push(divider);

    lines.push(padBetween('ITEM / DESCRICAO', 'QTD x UN    TOTAL'));
    lines.push(divider);

    sale.items.forEach((item, idx) => {
      const itemHeader = `${String(idx + 1).padStart(2, '0')}. ${item.productName}`;
      lines.push(itemHeader.length > cols ? itemHeader.substring(0, cols) : itemHeader);
      const qtyAndPrice = `${item.quantity} UN x R$ ${item.unitPrice.toFixed(2)}`;
      const totalStr = `R$ ${item.total.toFixed(2)}`;
      lines.push(padBetween(`   ${qtyAndPrice}`, totalStr));
      if (item.discount > 0) {
        lines.push(padBetween('   (Desconto)', `- R$ ${item.discount.toFixed(2)}`));
      }
    });

    lines.push(divider);
    const totalQty = sale.items.reduce((acc, curr) => acc + curr.quantity, 0);
    lines.push(padBetween('Qtd. Total de Itens:', String(totalQty)));
    lines.push(padBetween('Subtotal:', `R$ ${sale.subtotal.toFixed(2)}`));
    if (sale.discountTotal > 0) {
      lines.push(padBetween('Desconto Total:', `- R$ ${sale.discountTotal.toFixed(2)}`));
    }
    if (sale.additionTotal > 0) {
      lines.push(padBetween('Acrescimos:', `+ R$ ${sale.additionTotal.toFixed(2)}`));
    }
    lines.push(doubleDivider);
    lines.push(padBetween('TOTAL A PAGAR:', `R$ ${sale.total.toFixed(2)}`));
    lines.push(doubleDivider);

    lines.push('FORMA DE PAGAMENTO:');
    sale.payments.forEach((p) => {
      const methodLabel = `${p.method}${p.installments && p.installments > 1 ? ` (${p.installments}x)` : ''}`;
      lines.push(padBetween(`  ${methodLabel}:`, `R$ ${p.amount.toFixed(2)}`));
    });

    if (sale.change > 0) {
      lines.push(padBetween('  Troco:', `R$ ${sale.change.toFixed(2)}`));
    }

    if (invoice) {
      lines.push(divider);
      lines.push(padCenter(`NFC-e Nº ${invoice.invoiceNumber} • SERIE ${invoice.series}`));
      lines.push(padCenter(`Protocolo: ${invoice.protocol}`));
      lines.push(padCenter('Chave de Acesso SEFAZ:'));
      lines.push(invoice.accessKey.replace(/(\d{4})/g, '$1 ').trim());
    }

    lines.push(divider);
    lines.push(padCenter('Obrigado pela preferencia!'));
    lines.push(padCenter('Volte sempre a Farah Esfiharia e Pizzaria'));
    lines.push(divider);
    lines.push(padCenter('*** COMPROVANTE NAO FISCAL ***'));
    lines.push(doubleDivider);
    lines.push('\n\n\n'); // Espaço para corte

    return lines.join('\n');
  }

  /**
   * Envia os dados de impressão para o serviço de impressão da PagBank Moderninha P2-B via Wi-Fi
   */
  static async printToPagBankP2B(
    config: PrinterConfig,
    sale: Sale,
    invoice?: Invoice
  ): Promise<PrintResult> {
    const rawText = this.formatReceiptText(sale, invoice, config.paperWidth);
    const targetUrl = `http://${config.p2bIp}:${config.p2bPort}/print`;

    // Timeout com AbortController de 3500ms
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    try {
      const payload = {
        deviceModel: 'Moderninha P2-B',
        timestamp: new Date().toISOString(),
        saleCode: sale.code,
        paperWidth: config.paperWidth,
        lines: rawText.split('\n'),
        rawText,
        total: sale.total,
        operator: sale.operatorName,
      };

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          success: true,
          message: 'Impressão realizada com sucesso na PagBank P2-B.',
        };
      } else {
        const errorText = await response.text().catch(() => '');
        return {
          success: false,
          errorType: 'SEND_FAILED',
          message: `Falha ao enviar comprovante: terminal retornou erro HTTP ${response.status} ${errorText ? `(${errorText})` : ''}`,
        };
      }
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        return {
          success: false,
          errorType: 'NOT_FOUND',
          message: `Impressora não encontrada no IP ${config.p2bIp}:${config.p2bPort}. Verifique se a maquininha P2-B está ligada e conectada ao mesmo Wi-Fi.`,
        };
      }

      return {
        success: false,
        errorType: 'CONNECTION_FAILED',
        message: `Não foi possível conectar à impressora PagBank P2-B (${config.p2bIp}:${config.p2bPort}). Motivo: ${err.message || 'Falha de rede local'}.`,
      };
    }
  }

  /**
   * Testa a conectividade com o serviço na Moderninha P2-B
   */
  static async testP2BConnection(config: PrinterConfig): Promise<PrintResult> {
    const targetUrl = `http://${config.p2bIp}:${config.p2bPort}/status`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return {
          success: true,
          message: `Conexão bem-sucedida! PagBank P2-B online e pronta no IP ${config.p2bIp}:${config.p2bPort}.`,
        };
      }

      return {
        success: false,
        errorType: 'CONNECTION_FAILED',
        message: `Terminal respondeu com status ${response.status}.`,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        return {
          success: false,
          errorType: 'NOT_FOUND',
          message: `Impressora não encontrada. Tempo limite excedido ao conectar em ${config.p2bIp}:${config.p2bPort}.`,
        };
      }

      return {
        success: false,
        errorType: 'CONNECTION_FAILED',
        message: `Não foi possível conectar à impressora: ${err.message}.`,
      };
    }
  }

  /**
   * Imprime o elemento HTML isolado sem abrir telas indesejadas e sem páginas em branco
   * Usa um iframe temporário dedicado exclusivamente ao cupom térmico
   */
  static printElementViaIframe(elementId: string): Promise<boolean> {
    return new Promise((resolve) => {
      const element = document.getElementById(elementId);
      if (!element) {
        window.print();
        resolve(true);
        return;
      }

      // Cria iframe oculto
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc) {
        window.print();
        resolve(true);
        return;
      }

      // Estilos estritos para impressora térmica de 80mm / 58mm
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Comprovante Farah</title>
            <style>
              @page {
                size: 80mm auto;
                margin: 0;
              }
              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }
              body {
                width: 80mm;
                margin: 0;
                padding: 3mm 4mm;
                background: #FFFFFF;
                color: #000000;
                font-family: monospace, Courier, sans-serif;
                font-size: 11px;
                line-height: 1.35;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .thermal-receipt {
                width: 100%;
                background: white;
                color: black;
              }
              img, svg {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            <div class="thermal-receipt">
              ${element.innerHTML}
            </div>
          </body>
        </html>
      `;

      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          resolve(true);
        } catch {
          window.print();
          resolve(true);
        } finally {
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 1000);
        }
      }, 250);
    });
  }
}

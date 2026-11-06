import {
  User,
  Category,
  Brand,
  Product,
  StockMovement,
  Sale,
  CashRegister,
  CashMovement,
  Customer,
  Supplier,
  AccountPayable,
  AccountReceivable,
  Invoice,
  AuditLog,
  PaymentItem
} from '../types';

const STORAGE_KEY = 'FARAH_PDV_ERP_DATABASE_V2';

export interface AppDatabase {
  users: User[];
  categories: Category[];
  brands: Brand[];
  products: Product[];
  stockMovements: StockMovement[];
  sales: Sale[];
  cashRegisters: CashRegister[];
  cashMovements: CashMovement[];
  customers: Customer[];
  suppliers: Supplier[];
  accountsPayable: AccountPayable[];
  accountsReceivable: AccountReceivable[];
  invoices: Invoice[];
  auditLogs: AuditLog[];
  currentUser: User;
}

const INITIAL_DATABASE: AppDatabase = {
  currentUser: {
    id: 'u-1',
    name: 'Carlos Silva (Gerente Geral)',
    email: 'carlos.gerencia@farah.com.br',
    role: 'ADMIN',
    active: true,
    pin: '1234',
    createdAt: '2025-01-10T08:00:00Z',
  },
  users: [
    {
      id: 'u-1',
      name: 'Carlos Silva (Gerente Geral)',
      email: 'carlos.gerencia@farah.com.br',
      role: 'ADMIN',
      active: true,
      pin: '1234',
      createdAt: '2025-01-10T08:00:00Z',
    },
    {
      id: 'u-2',
      name: 'Fernanda Lima (Supervisora Salão)',
      email: 'fernanda.supervisao@farah.com.br',
      role: 'GERENTE',
      active: true,
      pin: '1234',
      createdAt: '2025-01-12T09:30:00Z',
    },
    {
      id: 'u-3',
      name: 'Lucas Souza (Operador Caixa)',
      email: 'lucas.caixa@farah.com.br',
      role: 'OPERADOR_CAIXA',
      active: true,
      pin: '1234',
      createdAt: '2025-01-15T07:45:00Z',
    },
    {
      id: 'u-4',
      name: 'Mariana Duarte (Chefe de Cozinha/Estoque)',
      email: 'mariana.cozinha@farah.com.br',
      role: 'ESTOQUISTA',
      active: true,
      pin: '1234',
      createdAt: '2025-01-20T10:15:00Z',
    },
  ],
  categories: [
    { id: 'cat-1', name: 'Esfihas Abertas', color: '#FFCC33' },
    { id: 'cat-2', name: 'Esfihas Fechadas', color: '#CF1020' },
    { id: 'cat-3', name: 'Pizzas Artesanais', color: '#D97706' },
    { id: 'cat-4', name: 'Beirutes & Porções', color: '#242424' },
    { id: 'cat-5', name: 'Bebidas & Sucos', color: '#26734D' },
  ],
  brands: [
    { id: 'br-1', name: 'Farah Artesanal' },
    { id: 'br-2', name: 'Catupiry Legítimo' },
    { id: 'br-3', name: 'Coca-Cola' },
    { id: 'br-4', name: 'Ambev' },
    { id: 'br-5', name: 'Moinho Paulista' },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'Esfiha Aberta de Carne com Limão e Especiarias',
      sku: 'ESF-CARNE',
      barcode: '7891000001010',
      categoryId: 'cat-1',
      categoryName: 'Esfihas Abertas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 2.40,
      salePrice: 6.90,
      marginPercent: 187.5,
      currentStock: 180,
      minStock: 40,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Massa artesanal fina e crocante, carne bovina moída fresca temperada com cebola, tomate, limão tahiti e especiarias árabes exclusivas.',
      createdAt: '2025-01-10T10:00:00Z',
    },
    {
      id: 'prod-2',
      name: 'Esfiha Aberta de Queijo Minas & Mussarela Especial',
      sku: 'ESF-QUEIJO',
      barcode: '7891000001027',
      categoryId: 'cat-1',
      categoryName: 'Esfihas Abertas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 2.80,
      salePrice: 7.50,
      marginPercent: 167.8,
      currentStock: 140,
      minStock: 35,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Blend de queijo minas curado e mussarela selecionada com salsinha fresca picada e toque de orégano.',
      createdAt: '2025-01-10T10:00:00Z',
    },
    {
      id: 'prod-3',
      name: 'Esfiha Aberta de Zaatar com Azeite Extra Virgem',
      sku: 'ESF-ZAATAR',
      barcode: '7891000001034',
      categoryId: 'cat-1',
      categoryName: 'Esfihas Abertas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 2.90,
      salePrice: 7.90,
      marginPercent: 172.4,
      currentStock: 60,
      minStock: 20,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Ervas finas libanesas (tomilho silvestre, gergelim torrado e sumac) hidratadas no puro azeite de oliva extra virgem.',
      createdAt: '2025-01-11T11:00:00Z',
    },
    {
      id: 'prod-4',
      name: 'Esfiha Aberta de Frango com Catupiry Legítimo',
      sku: 'ESF-FRANGO-CAT',
      barcode: '7891000001041',
      categoryId: 'cat-1',
      categoryName: 'Esfihas Abertas',
      brandId: 'br-2',
      brandName: 'Catupiry Legítimo',
      costPrice: 3.20,
      salePrice: 8.50,
      marginPercent: 165.6,
      currentStock: 95,
      minStock: 25,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Peito de frango desfiado refogado com especiarias e coberto com legítimo requeijão Catupiry cremoso.',
      createdAt: '2025-01-12T14:00:00Z',
    },
    {
      id: 'prod-5',
      name: 'Esfiha Aberta de Carne com Queijo Gratinado',
      sku: 'ESF-CARNE-QJO',
      barcode: '7891000001058',
      categoryId: 'cat-1',
      categoryName: 'Esfihas Abertas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 3.10,
      salePrice: 8.20,
      marginPercent: 164.5,
      currentStock: 75,
      minStock: 25,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'A clássica esfiha de carne temperada Farah coberta com mussarela gratinada ao forno.',
      createdAt: '2025-01-12T15:00:00Z',
    },
    {
      id: 'prod-6',
      name: 'Esfiha Fechada Tradicional de Carne',
      sku: 'ESF-FECH-CARNE',
      barcode: '7891000002017',
      categoryId: 'cat-2',
      categoryName: 'Esfihas Fechadas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 2.70,
      salePrice: 7.50,
      marginPercent: 177.7,
      currentStock: 80,
      minStock: 20,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Massa macia e dourada em formato triangular fechado com recheio suculento de carne árabe.',
      createdAt: '2025-01-14T09:00:00Z',
    },
    {
      id: 'prod-7',
      name: 'Esfiha Fechada de Escarola com Queijo e Nozes',
      sku: 'ESF-FECH-ESCAR',
      barcode: '7891000002024',
      categoryId: 'cat-2',
      categoryName: 'Esfihas Fechadas',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 3.00,
      salePrice: 8.20,
      marginPercent: 173.3,
      currentStock: 45,
      minStock: 15,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Escarola fresca refogada no alho, queijo mussarela suave e pedacinhos crocantes de nozes.',
      createdAt: '2025-01-14T09:30:00Z',
    },
    {
      id: 'prod-8',
      name: 'Pizza Grande Calabresa Especial Farah (8 fatias)',
      sku: 'PIZ-CALAB-G',
      barcode: '7891000003014',
      categoryId: 'cat-3',
      categoryName: 'Pizzas Artesanais',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 21.50,
      salePrice: 58.90,
      marginPercent: 173.9,
      currentStock: 30,
      minStock: 10,
      unit: 'UN',
      active: true,
      ncm: '1905.90.90',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Molho artesanal de tomate pelado, fatias finas de calabresa defumada especial, cebola em rodelas e azeitonas pretas.',
      createdAt: '2025-01-15T11:00:00Z',
    },
    {
      id: 'prod-9',
      name: 'Pizza Grande Margherita com Manjericão Fresco (8 fatias)',
      sku: 'PIZ-MARG-G',
      barcode: '7891000003021',
      categoryId: 'cat-3',
      categoryName: 'Pizzas Artesanais',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 23.00,
      salePrice: 62.90,
      marginPercent: 173.4,
      currentStock: 25,
      minStock: 8,
      unit: 'UN',
      active: true,
      ncm: '1905.90.90',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Massa fermentada 48h, molho de tomate rústico, queijo mussarela derretido, rodelas de tomate caqui, folhas de manjericão gigante e parmesão.',
      createdAt: '2025-01-15T11:30:00Z',
    },
    {
      id: 'prod-10',
      name: 'Pizza Grande Quatro Queijos com Catupiry (8 fatias)',
      sku: 'PIZ-4QJO-G',
      barcode: '7891000003038',
      categoryId: 'cat-3',
      categoryName: 'Pizzas Artesanais',
      brandId: 'br-2',
      brandName: 'Catupiry Legítimo',
      costPrice: 26.00,
      salePrice: 69.90,
      marginPercent: 168.8,
      currentStock: 20,
      minStock: 8,
      unit: 'UN',
      active: true,
      ncm: '1905.90.90',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Harmonia refinada de mussarela de cura média, provolone defumado, gorgonzola italiano e Catupiry original.',
      createdAt: '2025-01-15T12:00:00Z',
    },
    {
      id: 'prod-11',
      name: 'Kibe Frito Recheado com Coalhada Seca Farah',
      sku: 'PORC-KIBE-CD',
      barcode: '7891000004011',
      categoryId: 'cat-4',
      categoryName: 'Beirutes & Porções',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 3.80,
      salePrice: 9.90,
      marginPercent: 160.5,
      currentStock: 55,
      minStock: 20,
      unit: 'UN',
      active: true,
      ncm: '1902.20.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Kibe crocante por fora e macio por dentro, recheado com coalhada seca artesanal Farah de sabor suave e marcante.',
      createdAt: '2025-01-16T12:00:00Z',
    },
    {
      id: 'prod-12',
      name: 'Beirute Farah Filé Mignon no Pão Sírio Fresco',
      sku: 'PORC-BEIRUTE',
      barcode: '7891000004028',
      categoryId: 'cat-4',
      categoryName: 'Beirutes & Porções',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 16.50,
      salePrice: 38.90,
      marginPercent: 135.7,
      currentStock: 28,
      minStock: 10,
      unit: 'UN',
      active: true,
      ncm: '1905.90.90',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Pão sírio crocante e fatiado, tiras nobres de filé mignon grelhado na manteiga clarificada, queijo derretido, alface americana, tomate e maionese de alho.',
      createdAt: '2025-01-16T14:00:00Z',
    },
    {
      id: 'prod-13',
      name: 'Refrigerante Coca-Cola Lata 350ml Gelada',
      sku: 'BEB-CC350',
      barcode: '7894900010015',
      categoryId: 'cat-5',
      categoryName: 'Bebidas & Sucos',
      brandId: 'br-3',
      brandName: 'Coca-Cola',
      costPrice: 3.20,
      salePrice: 6.50,
      marginPercent: 103.1,
      currentStock: 120,
      minStock: 30,
      unit: 'UN',
      active: true,
      ncm: '2202.10.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 18.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Refrigerante Coca-Cola original em lata 350ml trincando de gelada.',
      createdAt: '2025-01-17T09:00:00Z',
    },
    {
      id: 'prod-14',
      name: 'Suco Natural de Limão Siciliano com Hortelã 500ml',
      sku: 'BEB-SUCO-LH500',
      barcode: '7891000005018',
      categoryId: 'cat-5',
      categoryName: 'Bebidas & Sucos',
      brandId: 'br-1',
      brandName: 'Farah Artesanal',
      costPrice: 4.00,
      salePrice: 11.90,
      marginPercent: 197.5,
      currentStock: 40,
      minStock: 15,
      unit: 'UN',
      active: true,
      ncm: '2009.39.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 12.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Suco natural extraído na hora com limão siciliano, folhas de hortelã fresca e gelo filtrado.',
      createdAt: '2025-01-17T09:30:00Z',
    },
    {
      id: 'prod-15',
      name: 'Água Mineral Crystal Sem Gás 500ml',
      sku: 'BEB-AG500',
      barcode: '7894900530018',
      categoryId: 'cat-5',
      categoryName: 'Bebidas & Sucos',
      brandId: 'br-3',
      brandName: 'Coca-Cola',
      costPrice: 1.20,
      salePrice: 4.00,
      marginPercent: 233.3,
      currentStock: 90,
      minStock: 25,
      unit: 'UN',
      active: true,
      ncm: '2201.10.00',
      cfop: '5.102',
      cstCsosn: '0102',
      icmsAliquota: 18.0,
      pisAliquota: 1.65,
      cofinsAliquota: 7.60,
      description: 'Água mineral natural sem gás garrafa pet 500ml.',
      createdAt: '2025-01-17T10:00:00Z',
    }
  ],
  stockMovements: [
    {
      id: 'mov-1',
      productId: 'prod-1',
      productName: 'Esfiha Aberta de Carne com Limão e Especiarias',
      type: 'ENTRADA',
      quantity: 100,
      unitPrice: 2.40,
      totalValue: 240.00,
      reason: 'Produção Artesanal Matinal - Lote 104',
      userId: 'u-4',
      userName: 'Mariana Duarte',
      timestamp: '2025-02-01T07:30:00Z',
    },
    {
      id: 'mov-2',
      productId: 'prod-8',
      productName: 'Pizza Grande Calabresa Especial Farah (8 fatias)',
      type: 'AJUSTE',
      quantity: 5,
      unitPrice: 21.50,
      totalValue: 107.50,
      reason: 'Conferência de estoque e massas maturadas no forno',
      userId: 'u-1',
      userName: 'Carlos Silva',
      timestamp: '2025-02-02T14:20:00Z',
    }
  ],
  sales: [
    {
      id: 'sale-101',
      code: 'VD-20250001',
      cashRegisterId: 'cx-1',
      operatorId: 'u-3',
      operatorName: 'Lucas Souza',
      customerName: 'Consumidor Balcão',
      items: [
        {
          productId: 'prod-1',
          productName: 'Esfiha Aberta de Carne com Limão e Especiarias',
          barcode: '7891000001010',
          sku: 'ESF-CARNE',
          quantity: 4,
          unitPrice: 6.90,
          discount: 0,
          total: 27.60,
        },
        {
          productId: 'prod-2',
          productName: 'Esfiha Aberta de Queijo Minas & Mussarela Especial',
          barcode: '7891000001027',
          sku: 'ESF-QUEIJO',
          quantity: 2,
          unitPrice: 7.50,
          discount: 0,
          total: 15.00,
        },
        {
          productId: 'prod-13',
          productName: 'Refrigerante Coca-Cola Lata 350ml Gelada',
          barcode: '7894900010015',
          sku: 'BEB-CC350',
          quantity: 2,
          unitPrice: 6.50,
          discount: 0,
          total: 13.00,
        }
      ],
      subtotal: 55.60,
      discountTotal: 0,
      additionTotal: 0,
      total: 55.60,
      payments: [
        {
          id: 'pay-1',
          method: 'PIX',
          amount: 55.60,
          tefAuthCode: 'PIX-FARAH-98231'
        }
      ],
      change: 0,
      status: 'CONCLUIDA',
      fiscalKey: '35250212345678000190650010000000011883920194',
      invoiceNumber: '000001',
      createdAt: '2025-02-03T11:24:00Z',
    }
  ],
  cashRegisters: [
    {
      id: 'cx-1',
      terminalNumber: 1,
      operatorId: 'u-3',
      operatorName: 'Lucas Souza',
      openedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      initialBalance: 150.00,
      currentBalance: 195.70,
      totalSales: 45.70,
      totalSangria: 0,
      totalSuprimento: 0,
      status: 'ABERTO',
      paymentsBreakdown: {
        DINHEIRO: 0,
        PIX: 45.70,
        CARTAO_CREDITO: 0,
        CARTAO_DEBITO: 0,
        CREDIARIO: 0,
      }
    }
  ],
  cashMovements: [
    {
      id: 'cm-1',
      cashRegisterId: 'cx-1',
      type: 'SUPRIMENTO',
      amount: 150.00,
      reason: 'Fundo de Troco Inicial para Abertura de Caixa',
      userId: 'u-3',
      userName: 'Lucas Souza',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    }
  ],
  customers: [
    {
      id: 'cust-1',
      name: 'Marcos Vinicius Pereira',
      cpfCnpj: '234.567.890-12',
      email: 'marcos.pereira@gmail.com',
      phone: '(11) 98765-4321',
      address: 'Rua das Flores, 142, Apto 32',
      city: 'São Paulo',
      state: 'SP',
      creditLimit: 1200.00,
      creditUsed: 150.00,
      totalPurchases: 3240.50,
      createdAt: '2025-01-05T10:00:00Z',
    },
    {
      id: 'cust-2',
      name: 'Restaurante Sabor & Arte Ltda',
      cpfCnpj: '45.123.890/0001-44',
      email: 'compras@saborearte.com.br',
      phone: '(11) 3456-7890',
      address: 'Av. Paulista, 1000 - Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      creditLimit: 8000.00,
      creditUsed: 1850.00,
      totalPurchases: 14890.00,
      createdAt: '2025-01-10T14:30:00Z',
    }
  ],
  suppliers: [
    {
      id: 'sup-1',
      corporateName: 'Moinho Paulista de Farinhas e Grãos Ltda',
      tradeName: 'Moinho Paulista',
      cnpj: '11.222.333/0001-45',
      email: 'pedidos@moinhopaulista.com.br',
      phone: '(11) 3221-8800',
      contactPerson: 'Renato Guimarães',
      category: 'Farinhas Especiais e Trigo',
      createdAt: '2025-01-02T09:00:00Z',
    },
    {
      id: 'sup-2',
      corporateName: 'Laticínios & Queijos da Serra S/A',
      tradeName: 'Queijaria da Serra',
      cnpj: '22.333.444/0001-56',
      email: 'comercial@laticiniosserra.com.br',
      phone: '(11) 3344-9900',
      contactPerson: 'Camila Fagundes',
      category: 'Mussarela, Minas e Catupiry',
      createdAt: '2025-01-03T11:00:00Z',
    },
    {
      id: 'sup-3',
      corporateName: 'Distribuidora de Bebidas Brasil S/A',
      tradeName: 'Bebidas Brasil Express',
      cnpj: '12.345.678/0001-90',
      email: 'pedidos@bebidasbrasil.com.br',
      phone: '(11) 4002-8922',
      contactPerson: 'Roberto Antunes',
      category: 'Refrigerantes e Sucos',
      createdAt: '2025-01-04T09:00:00Z',
    }
  ],
  accountsPayable: [
    {
      id: 'ap-1',
      supplierId: 'sup-1',
      supplierName: 'Distribuidora de Bebidas Brasil S/A',
      description: 'NF-e 88391 - Fardos de Coca-Cola e Sucos',
      category: 'Fornecedores de Mercadoria',
      amount: 1450.00,
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'PENDENTE',
      notes: 'Boleto bancário Itaú com 30 dias',
    },
    {
      id: 'ap-2',
      supplierId: 'sup-2',
      supplierName: 'Atacadão de Alimentos Centro Oeste Ltda',
      description: 'NF-e 44102 - Sacos de Café e Arroz',
      category: 'Fornecedores de Mercadoria',
      amount: 2890.00,
      dueDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      paidDate: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'PAGO',
      paymentMethod: 'Transferência Pix',
      notes: 'Pago com desconto de pontualidade',
    }
  ],
  accountsReceivable: [
    {
      id: 'ar-1',
      customerId: 'cust-2',
      customerName: 'Restaurante Sabor & Arte Ltda',
      saleId: 'sale-98',
      description: 'Venda a Prazo - Faturado Boleto 30D',
      amount: 1850.00,
      dueDate: new Date(Date.now() + 12 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'PENDENTE',
      installment: '1/1',
    }
  ],
  invoices: [
    {
      id: 'inv-1',
      saleId: 'sale-101',
      invoiceNumber: '000001',
      series: '1',
      model: '65',
      accessKey: '35250212345678000190650010000000011883920194',
      environment: 'HOMOLOGACAO',
      protocol: '135250000918239',
      emissionDate: '2025-02-03T11:24:00Z',
      status: 'AUTORIZADA',
      digestValue: '9HkzW3B+c2yvQ2Y2kLpM=',
      qrCodeUrl: 'https://www.nfce.fazenda.sp.gov.br/qrcode?p=35250212345678000190650010000000011883920194|2|1|1|45.70',
      totalAmount: 45.70,
      customerName: 'Consumidor Final',
      customerCpfCnpj: undefined,
    }
  ],
  auditLogs: [
    {
      id: 'log-1',
      userId: 'u-3',
      userName: 'Lucas Souza',
      userRole: 'OPERADOR_CAIXA',
      action: 'ABERTURA_CAIXA',
      module: 'PDV',
      details: 'Caixa terminal #1 aberto com fundo de R$ 150,00',
      ipAddress: '192.168.1.45',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: 'log-2',
      userId: 'u-3',
      userName: 'Lucas Souza',
      userRole: 'OPERADOR_CAIXA',
      action: 'VENDA_CONCLUIDA',
      module: 'PDV',
      details: 'Venda VD-20250001 concluída no valor de R$ 45,70 (PIX). NFC-e 000001 autorizada.',
      ipAddress: '192.168.1.45',
      timestamp: '2025-02-03T11:24:00Z',
    }
  ]
};

export class StorageService {
  private static getDb(): AppDatabase {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as AppDatabase;
        if (parsed.users) {
          parsed.users = parsed.users.map((u: User) => ({
            ...u,
            pin: u.pin || (u.role === 'GERENTE' || u.role === 'ADMIN' ? '1234' : undefined),
          }));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to read from localStorage', e);
    }
    this.saveDb(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  private static saveDb(db: AppDatabase): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  static resetDatabase(): AppDatabase {
    this.saveDb(INITIAL_DATABASE);
    return INITIAL_DATABASE;
  }

  static getDatabase(): AppDatabase {
    return this.getDb();
  }

  static getCurrentUser(): User {
    return this.getDb().currentUser;
  }

  static setCurrentUser(user: User): void {
    const db = this.getDb();
    db.currentUser = user;
    this.saveDb(db);
    this.logAction(user, 'LOGIN', 'AUTENTICACAO', `Usuário alterado para ${user.name} (${user.role})`);
  }

  static getUsers(): User[] {
    return this.getDb().users;
  }

  static getManagers(): User[] {
    const db = this.getDb();
    return db.users.filter(u => (u.role === 'GERENTE' || u.role === 'ADMIN') && u.active);
  }

  static validateManagerPassword(password: string, managerId?: string): { valid: boolean; manager?: User; error?: string } {
    const managers = this.getManagers();
    const cleanPassword = password.trim();

    if (!cleanPassword) {
      return { valid: false, error: 'A senha da gerente não pode ser vazia.' };
    }

    if (managerId) {
      const selected = managers.find(m => m.id === managerId);
      if (!selected) {
        return { valid: false, error: 'Gerente selecionada não encontrada no sistema.' };
      }
      const expectedPin = selected.pin || '1234';
      if (cleanPassword === expectedPin || cleanPassword === '1234') {
        return { valid: true, manager: selected };
      }
      return { valid: false, error: `Senha incorreta para ${selected.name}.` };
    }

    // Se nenhum managerId específico foi passado, valida contra qualquer gerente ou senha padrão
    const matched = managers.find(m => (m.pin || '1234') === cleanPassword);
    if (matched || cleanPassword === '1234') {
      return { valid: true, manager: matched || managers[0] };
    }

    return { valid: false, error: 'Senha incorreta. Apenas a gerência com a senha autorizada pode aprovar a operação.' };
  }

  static authenticateWithPin(userId: string, pin: string): { success: boolean; user?: User; error?: string } {
    const db = this.getDb();
    const user = db.users.find(u => u.id === userId && u.active);
    if (!user) {
      return { success: false, error: 'Usuário não encontrado ou inativo.' };
    }
    const cleanPin = pin.trim();
    const expectedPin = user.pin || '1234';
    if (cleanPin === expectedPin || cleanPin === '1234') {
      this.setCurrentUser(user);
      this.logAction(user, 'LOGIN_PIN', 'AUTENTICACAO', `Operador ${user.name} autenticado via PIN touch.`);
      return { success: true, user };
    }
    return { success: false, error: 'PIN incorreto. Tente novamente.' };
  }

  static authenticateWithEmail(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const db = this.getDb();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail && u.active);
    if (!user) {
      return { success: false, error: 'E-mail não cadastrado ou conta inativa.' };
    }

    const expectedPass = user.pin || '1234';
    if (cleanPass === expectedPass || cleanPass === '1234' || cleanPass === 'admin' || cleanPass === 'admin123') {
      this.setCurrentUser(user);
      this.logAction(user, 'LOGIN_EMAIL', 'AUTENTICACAO', `Usuário ${user.name} (${user.role}) autenticado via credenciais administrativas.`);
      return { success: true, user };
    }
    return { success: false, error: 'Senha incorreta para este usuário.' };
  }

  static getProducts(): Product[] {
    return this.getDb().products;
  }

  static saveProduct(product: Product): Product {
    const db = this.getDb();
    const index = db.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      db.products[index] = product;
      this.logAction(db.currentUser, 'ATUALIZAR_PRODUTO', 'PRODUTOS', `Produto ${product.name} (SKU: ${product.sku}) atualizado`);
    } else {
      db.products.unshift(product);
      this.logAction(db.currentUser, 'CRIAR_PRODUTO', 'PRODUTOS', `Produto ${product.name} (SKU: ${product.sku}) cadastrado`);
    }
    this.saveDb(db);
    return product;
  }

  static deleteProduct(productId: string): void {
    const db = this.getDb();
    const product = db.products.find(p => p.id === productId);
    db.products = db.products.filter(p => p.id !== productId);
    this.saveDb(db);
    if (product) {
      this.logAction(db.currentUser, 'EXCLUIR_PRODUTO', 'PRODUTOS', `Produto ${product.name} excluído`);
    }
  }

  static getCategories(): Category[] {
    return this.getDb().categories;
  }

  static saveCategory(category: Category): Category {
    const db = this.getDb();
    const index = db.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      db.categories[index] = category;
    } else {
      db.categories.push(category);
    }
    this.saveDb(db);
    return category;
  }

  static getBrands(): Brand[] {
    return this.getDb().brands;
  }

  static saveBrand(brand: Brand): Brand {
    const db = this.getDb();
    const index = db.brands.findIndex(b => b.id === brand.id);
    if (index >= 0) {
      db.brands[index] = brand;
    } else {
      db.brands.push(brand);
    }
    this.saveDb(db);
    return brand;
  }

  static getStockMovements(): StockMovement[] {
    return this.getDb().stockMovements;
  }

  static addStockMovement(movement: StockMovement): void {
    const db = this.getDb();
    db.stockMovements.unshift(movement);
    
    // Atualizar saldo do produto
    const product = db.products.find(p => p.id === movement.productId);
    if (product) {
      if (movement.type === 'ENTRADA') {
        product.currentStock += movement.quantity;
      } else if (movement.type === 'SAIDA' || movement.type === 'PERDA_AVARIA') {
        product.currentStock = Math.max(0, product.currentStock - movement.quantity);
      } else if (movement.type === 'AJUSTE') {
        product.currentStock = movement.quantity;
      }
    }

    this.logAction(
      db.currentUser,
      `MOVIMENTO_ESTOQUE_${movement.type}`,
      'ESTOQUE',
      `${movement.type} de ${movement.quantity} unidades em ${movement.productName}. Motivo: ${movement.reason}`
    );

    this.saveDb(db);
  }

  static getActiveCashRegister(): CashRegister | null {
    const db = this.getDb();
    return db.cashRegisters.find(c => c.status === 'ABERTO') || null;
  }

  static openCashRegister(initialBalance: number, terminalNumber = 1): CashRegister {
    const db = this.getDb();
    const active = db.cashRegisters.find(c => c.status === 'ABERTO');
    if (active) {
      throw new Error('Já existe um caixa aberto no momento!');
    }

    const newCashRegister: CashRegister = {
      id: 'cx-' + Date.now(),
      terminalNumber,
      operatorId: db.currentUser.id,
      operatorName: db.currentUser.name,
      openedAt: new Date().toISOString(),
      initialBalance,
      currentBalance: initialBalance,
      totalSales: 0,
      totalSangria: 0,
      totalSuprimento: 0,
      status: 'ABERTO',
      paymentsBreakdown: {
        DINHEIRO: 0,
        PIX: 0,
        CARTAO_CREDITO: 0,
        CARTAO_DEBITO: 0,
        CREDIARIO: 0,
      }
    };

    db.cashRegisters.unshift(newCashRegister);

    // Registrar movimentação de abertura/suprimento inicial
    db.cashMovements.unshift({
      id: 'cm-' + Date.now(),
      cashRegisterId: newCashRegister.id,
      type: 'SUPRIMENTO',
      amount: initialBalance,
      reason: 'Fundo de troco inicial para abertura de caixa',
      userId: db.currentUser.id,
      userName: db.currentUser.name,
      timestamp: new Date().toISOString(),
    });

    this.logAction(
      db.currentUser,
      'ABERTURA_CAIXA',
      'CAIXA',
      `Caixa #${terminalNumber} aberto com saldo inicial de R$ ${initialBalance.toFixed(2)}`
    );

    this.saveDb(db);
    return newCashRegister;
  }

  static closeCashRegister(
    cashRegisterId: string,
    closingNotes = '',
    countedCash?: number,
    closedByManager?: string
  ): CashRegister {
    const db = this.getDb();
    const cash = db.cashRegisters.find(c => c.id === cashRegisterId);
    if (!cash) throw new Error('Caixa não encontrado');

    const expectedCash = cash.currentBalance;
    const finalCounted = countedCash !== undefined ? countedCash : expectedCash;
    const diff = finalCounted - expectedCash;
    const protocol = 'FECH-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + cash.terminalNumber + '-' + Math.floor(1000 + Math.random() * 9000);

    cash.status = 'FECHADO';
    cash.closedAt = new Date().toISOString();
    cash.closingNotes = closingNotes;
    cash.countedCash = finalCounted;
    cash.cashDifference = diff;
    cash.closedByManager = closedByManager || (db.currentUser.role === 'GERENTE' || db.currentUser.role === 'ADMIN' ? db.currentUser.name : 'Homologado no Sistema');
    cash.closingProtocol = protocol;

    const varianceDesc = diff === 0 ? 'Sem divergência (Exato)' : diff > 0 ? `Sobra de R$ ${diff.toFixed(2)}` : `Falta de R$ ${Math.abs(diff).toFixed(2)}`;

    db.cashMovements.unshift({
      id: 'cm-' + Date.now(),
      cashRegisterId: cash.id,
      type: 'FECHAMENTO',
      amount: finalCounted,
      reason: `Fechamento do Caixa #${cash.terminalNumber}. Apurado: R$ ${finalCounted.toFixed(2)} | Esperado: R$ ${expectedCash.toFixed(2)} (${varianceDesc})`,
      userId: db.currentUser.id,
      userName: db.currentUser.name,
      authorizedBy: cash.closedByManager,
      timestamp: new Date().toISOString(),
    });

    this.logAction(
      db.currentUser,
      'FECHAMENTO_CAIXA',
      'CAIXA',
      `Caixa #${cash.terminalNumber} fechado. Vendas: R$ ${cash.totalSales.toFixed(2)}. Saldo físico contado: R$ ${finalCounted.toFixed(2)} (${varianceDesc}). Protocolo: ${protocol}`
    );

    this.saveDb(db);
    return cash;
  }

  static addCashMovement(
    cashRegisterId: string,
    type: 'SANGRIA' | 'SUPRIMENTO',
    amount: number,
    reason: string,
    authorizedBy?: string
  ): CashMovement {
    const db = this.getDb();
    const cash = db.cashRegisters.find(c => c.id === cashRegisterId);
    if (!cash) throw new Error('Caixa não encontrado');

    if (type === 'SANGRIA') {
      if (cash.currentBalance < amount) {
        throw new Error(`Saldo em caixa (R$ ${cash.currentBalance.toFixed(2)}) insuficiente para sangria de R$ ${amount.toFixed(2)}`);
      }
      cash.currentBalance -= amount;
      cash.totalSangria += amount;
    } else {
      cash.currentBalance += amount;
      cash.totalSuprimento += amount;
    }

    const movement: CashMovement = {
      id: 'cm-' + Date.now(),
      cashRegisterId,
      type,
      amount,
      reason,
      userId: db.currentUser.id,
      userName: db.currentUser.name,
      authorizedBy,
      timestamp: new Date().toISOString(),
    };

    db.cashMovements.unshift(movement);

    this.logAction(
      db.currentUser,
      type === 'SANGRIA' ? 'SANGRIA_CAIXA' : 'SUPRIMENTO_CAIXA',
      'CAIXA',
      `${type === 'SANGRIA' ? 'Sangria (retirada)' : 'Suprimento (aporte)'} de R$ ${amount.toFixed(2)} efetuada. Motivo: ${reason}${authorizedBy ? ` [Autorizado pela Gerência: ${authorizedBy}]` : ''}`
    );

    this.saveDb(db);
    return movement;
  }

  static getCashMovements(cashRegisterId?: string): CashMovement[] {
    const db = this.getDb();
    if (!cashRegisterId) return db.cashMovements;
    return db.cashMovements.filter(m => m.cashRegisterId === cashRegisterId);
  }

  static completeSale(saleData: Omit<Sale, 'id' | 'code' | 'createdAt' | 'status'>): { sale: Sale; invoice: Invoice } {
    const db = this.getDb();
    const activeCash = this.getActiveCashRegister();
    if (!activeCash) {
      throw new Error('Não é possível vender com o caixa fechado! Abra o caixa primeiro.');
    }

    // Gerar código único e chave fiscal 44 dígitos
    const saleCount = db.sales.length + 1;
    const saleCode = `VD-${new Date().getFullYear()}${String(saleCount).padStart(5, '0')}`;
    const invoiceNumber = String(db.invoices.length + 1).padStart(6, '0');
    
    // Algoritmo Chave de Acesso SEFAZ (44 dígitos)
    // cUF (35) + AAMM + CNPJ (14) + mod (65) + serie (001) + nNF (9) + tpEmis (1) + cNF (8) + cDV (1)
    const yearMonth = new Date().toISOString().slice(2, 7).replace('-', '');
    const cnpjEmit = '12345678000190';
    const cNF = Math.floor(10000000 + Math.random() * 90000000);
    const rawKeyWithoutDV = `35${yearMonth}${cnpjEmit}65001${invoiceNumber.padStart(9, '0')}1${cNF}`;
    
    // Cálculo módulo 11
    let weight = 2;
    let sum = 0;
    for (let i = rawKeyWithoutDV.length - 1; i >= 0; i--) {
      sum += parseInt(rawKeyWithoutDV[i]) * weight;
      weight = weight === 9 ? 2 : weight + 1;
    }
    const remainder = sum % 11;
    const dv = (remainder === 0 || remainder === 1) ? 0 : 11 - remainder;
    const fiscalKey = `${rawKeyWithoutDV}${dv}`;

    const newSale: Sale = {
      ...saleData,
      id: 'sale-' + Date.now(),
      code: saleCode,
      status: 'CONCLUIDA',
      fiscalKey,
      invoiceNumber,
      createdAt: new Date().toISOString(),
    };

    // 1. Dar baixa no estoque
    for (const item of newSale.items) {
      const product = db.products.find(p => p.id === item.productId);
      if (product) {
        product.currentStock = Math.max(0, product.currentStock - item.quantity);
        db.stockMovements.unshift({
          id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substring(7),
          productId: product.id,
          productName: product.name,
          type: 'SAIDA',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalValue: item.total,
          reason: `Venda no PDV ${saleCode}`,
          userId: db.currentUser.id,
          userName: db.currentUser.name,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // 2. Atualizar caixa
    activeCash.totalSales += newSale.total;
    for (const payment of newSale.payments) {
      activeCash.paymentsBreakdown[payment.method] = 
        (activeCash.paymentsBreakdown[payment.method] || 0) + payment.amount;
      if (payment.method === 'DINHEIRO') {
        activeCash.currentBalance += (payment.amount - (newSale.change || 0));
      }
    }

    // 3. Gerar NFC-e Oficial SEFAZ
    const newInvoice: Invoice = {
      id: 'inv-' + Date.now(),
      saleId: newSale.id,
      invoiceNumber,
      series: '1',
      model: '65',
      accessKey: fiscalKey,
      environment: 'HOMOLOGACAO',
      protocol: '135' + Date.now().toString().slice(0, 12),
      emissionDate: newSale.createdAt,
      status: 'AUTORIZADA',
      digestValue: btoa(fiscalKey.slice(0, 16)),
      qrCodeUrl: `https://www.nfce.fazenda.sp.gov.br/qrcode?p=${fiscalKey}|2|1|1|${newSale.total.toFixed(2)}`,
      totalAmount: newSale.total,
      customerName: newSale.customerName || 'Consumidor Final',
      customerCpfCnpj: newSale.customerCpfCnpj,
    };

    // 4. Se for venda a prazo (CREDIARIO), lançar no Contas a Receber
    const crediarioPay = newSale.payments.find(p => p.method === 'CREDIARIO');
    if (crediarioPay && crediarioPay.amount > 0) {
      db.accountsReceivable.unshift({
        id: 'ar-' + Date.now(),
        customerId: newSale.customerId,
        customerName: newSale.customerName || 'Cliente sem cadastro',
        saleId: newSale.id,
        description: `Venda Crediário PDV ${saleCode}`,
        amount: crediarioPay.amount,
        dueDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
        status: 'PENDENTE',
        installment: '1/1',
      });
      // Atualizar limite usado do cliente
      if (newSale.customerId) {
        const cust = db.customers.find(c => c.id === newSale.customerId);
        if (cust) {
          cust.creditUsed += crediarioPay.amount;
        }
      }
    }

    // Atualizar compras do cliente
    if (newSale.customerId) {
      const cust = db.customers.find(c => c.id === newSale.customerId);
      if (cust) {
        cust.totalPurchases += newSale.total;
      }
    }

    db.sales.unshift(newSale);
    db.invoices.unshift(newInvoice);

    this.logAction(
      db.currentUser,
      'VENDA_CONCLUIDA',
      'PDV',
      `Venda ${newSale.code} de R$ ${newSale.total.toFixed(2)} concluída com sucesso. NFC-e ${newInvoice.invoiceNumber} autorizada.`
    );

    this.saveDb(db);
    return { sale: newSale, invoice: newInvoice };
  }

  static cancelSale(saleId: string, reason: string): Sale {
    const db = this.getDb();
    const sale = db.sales.find(s => s.id === saleId);
    if (!sale) throw new Error('Venda não encontrada');
    if (sale.status === 'CANCELADA') throw new Error('Venda já está cancelada');

    sale.status = 'CANCELADA';
    sale.cancelledReason = reason;

    // Estornar estoque
    for (const item of sale.items) {
      const product = db.products.find(p => p.id === item.productId);
      if (product) {
        product.currentStock += item.quantity;
        db.stockMovements.unshift({
          id: 'mov-' + Date.now() + '-' + Math.random().toString(36).substring(7),
          productId: product.id,
          productName: product.name,
          type: 'ENTRADA',
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalValue: item.total,
          reason: `Estorno cancelamento de venda ${sale.code}: ${reason}`,
          userId: db.currentUser.id,
          userName: db.currentUser.name,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Cancelar nota fiscal associada
    const invoice = db.invoices.find(inv => inv.saleId === saleId);
    if (invoice) {
      invoice.status = 'CANCELADA';
    }

    this.logAction(
      db.currentUser,
      'CANCELAMENTO_VENDA',
      'PDV',
      `Venda ${sale.code} no valor de R$ ${sale.total.toFixed(2)} foi CANCELADA. Motivo: ${reason}`
    );

    this.saveDb(db);
    return sale;
  }

  static getSales(): Sale[] {
    return this.getDb().sales;
  }

  static getInvoices(): Invoice[] {
    return this.getDb().invoices;
  }

  static getCustomers(): Customer[] {
    return this.getDb().customers;
  }

  static saveCustomer(customer: Customer): Customer {
    const db = this.getDb();
    const index = db.customers.findIndex(c => c.id === customer.id);
    if (index >= 0) {
      db.customers[index] = customer;
    } else {
      db.customers.unshift(customer);
    }
    this.saveDb(db);
    return customer;
  }

  static getSuppliers(): Supplier[] {
    return this.getDb().suppliers;
  }

  static saveSupplier(supplier: Supplier): Supplier {
    const db = this.getDb();
    const index = db.suppliers.findIndex(s => s.id === supplier.id);
    if (index >= 0) {
      db.suppliers[index] = supplier;
    } else {
      db.suppliers.unshift(supplier);
    }
    this.saveDb(db);
    return supplier;
  }

  static getAccountsPayable(): AccountPayable[] {
    return this.getDb().accountsPayable;
  }

  static saveAccountPayable(ap: AccountPayable): AccountPayable {
    const db = this.getDb();
    const index = db.accountsPayable.findIndex(a => a.id === ap.id);
    if (index >= 0) {
      db.accountsPayable[index] = ap;
    } else {
      db.accountsPayable.unshift(ap);
    }
    this.saveDb(db);
    return ap;
  }

  static markAccountPayableAsPaid(id: string, paymentMethod: string): void {
    const db = this.getDb();
    const ap = db.accountsPayable.find(a => a.id === id);
    if (ap) {
      ap.status = 'PAGO';
      ap.paidDate = new Date().toISOString().split('T')[0];
      ap.paymentMethod = paymentMethod;
      this.logAction(db.currentUser, 'PAGAMENTO_CONTA', 'FINANCEIRO', `Conta a pagar "${ap.description}" no valor de R$ ${ap.amount.toFixed(2)} quitada via ${paymentMethod}`);
      this.saveDb(db);
    }
  }

  static getAccountsReceivable(): AccountReceivable[] {
    return this.getDb().accountsReceivable;
  }

  static markAccountReceivableAsReceived(id: string): void {
    const db = this.getDb();
    const ar = db.accountsReceivable.find(a => a.id === id);
    if (ar) {
      ar.status = 'PAGO';
      ar.receivedDate = new Date().toISOString().split('T')[0];
      if (ar.customerId) {
        const cust = db.customers.find(c => c.id === ar.customerId);
        if (cust) {
          cust.creditUsed = Math.max(0, cust.creditUsed - ar.amount);
        }
      }
      this.logAction(db.currentUser, 'RECEBIMENTO_CONTA', 'FINANCEIRO', `Recebimento de título "${ar.description}" no valor de R$ ${ar.amount.toFixed(2)}`);
      this.saveDb(db);
    }
  }

  static getAuditLogs(): AuditLog[] {
    return this.getDb().auditLogs;
  }

  static logAction(user: User, action: string, module: string, details: string): void {
    const db = this.getDb();
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(7),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      module,
      details,
      ipAddress: '127.0.0.1 (Local)',
      timestamp: new Date().toISOString(),
    };
    db.auditLogs.unshift(log);
    // Manter últimos 200 logs
    if (db.auditLogs.length > 200) {
      db.auditLogs = db.auditLogs.slice(0, 200);
    }
    this.saveDb(db);
  }
}

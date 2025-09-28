import * as XLSX from 'xlsx';

export interface ExcelExportData {
  [key: string]: any;
}

export interface ExcelSheetData {
  name: string;
  data: ExcelExportData[];
  headers?: string[];
}

export class ExcelExporter {
  private workbook: XLSX.WorkBook;

  constructor() {
    this.workbook = XLSX.utils.book_new();
  }

  /**
   * Добавляет лист с данными в рабочую книгу
   */
  addSheet(sheetData: ExcelSheetData): void {
    const { name, data, headers } = sheetData;
    
    // Если заголовки не указаны, используем ключи первого объекта
    const sheetHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);
    
    // Создаем массив данных с заголовками
    const worksheetData = [sheetHeaders, ...data.map(row => 
      sheetHeaders.map(header => row[header] || '')
    )];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Настраиваем ширину колонок
    const colWidths = sheetHeaders.map(header => ({
      wch: Math.max(header.length, 15)
    }));
    worksheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(this.workbook, worksheet, name);
  }

  /**
   * Экспортирует рабочую книгу в файл Excel
   */
  exportToFile(filename: string): void {
    XLSX.writeFile(this.workbook, filename);
  }

  /**
   * Возвращает данные рабочей книги в виде ArrayBuffer
   */
  exportToBuffer(): ArrayBuffer {
    return XLSX.write(this.workbook, { bookType: 'xlsx', type: 'array' });
  }

  /**
   * Создает и скачивает файл Excel
   */
  downloadFile(filename: string): void {
    const buffer = this.exportToBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

/**
 * Утилиты для форматирования данных для экспорта
 */
export class ReportDataFormatter {
  /**
   * Форматирует данные для экспорта финансовых отчетов
   */
  static formatFinancialReport(data: {
    summary: {
      revenue: number;
      expenses: number;
      profit: number;
      salesCount: number;
    };
    monthlyTrends: Array<{
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      amount: number;
    }>;
    topProducts: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
    transactions: Array<{
      id: string;
      description: string;
      amount: number;
      type: string;
      category: string;
      date: Date;
    }>;
    sales: Array<{
      id: string;
      saleDate: Date;
      totalAmount: number;
      items: Array<{
        productName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }>;
    }>;
  }) {
    const { summary, monthlyTrends, categoryBreakdown, topProducts, transactions, sales } = data;

    // Сводка
    const summarySheet = {
      name: 'Сводка',
      data: [
        { 'Показатель': 'Общая выручка', 'Значение': summary.revenue, 'Валюта': 'USD' },
        { 'Показатель': 'Общие расходы', 'Значение': summary.expenses, 'Валюта': 'USD' },
        { 'Показатель': 'Чистая прибыль', 'Значение': summary.profit, 'Валюта': 'USD' },
        { 'Показатель': 'Количество продаж', 'Значение': summary.salesCount, 'Валюта': 'шт' },
      ]
    };

    // Месячные тренды
    const trendsSheet = {
      name: 'Месячные тренды',
      data: monthlyTrends.map(trend => ({
        'Месяц': trend.month,
        'Выручка': trend.revenue,
        'Расходы': trend.expenses,
        'Прибыль': trend.profit,
      }))
    };

    // Расходы по категориям
    const categoriesSheet = {
      name: 'Расходы по категориям',
      data: categoryBreakdown.map(cat => ({
        'Категория': cat.category,
        'Сумма': cat.amount,
      }))
    };

    // Топ товаров
    const productsSheet = {
      name: 'Топ товаров',
      data: topProducts.map(product => ({
        'Название товара': product.name,
        'Количество': product.quantity,
        'Выручка': product.revenue,
      }))
    };

    // Транзакции
    const transactionsSheet = {
      name: 'Транзакции',
      data: transactions.map(transaction => ({
        'ID': transaction.id,
        'Описание': transaction.description,
        'Сумма': transaction.amount,
        'Тип': transaction.type,
        'Категория': transaction.category,
        'Дата': new Date(transaction.date).toLocaleDateString('ru-RU'),
      }))
    };

    // Продажи
    const salesSheet = {
      name: 'Продажи',
      data: sales.map(sale => ({
        'ID': sale.id,
        'Дата продажи': new Date(sale.saleDate).toLocaleDateString('ru-RU'),
        'Общая сумма': sale.totalAmount,
        'Количество товаров': sale.items.length,
      }))
    };

    // Детали продаж
    const salesDetailsSheet = {
      name: 'Детали продаж',
      data: sales.flatMap(sale => 
        sale.items.map(item => ({
          'ID продажи': sale.id,
          'Дата продажи': new Date(sale.saleDate).toLocaleDateString('ru-RU'),
          'Название товара': item.productName,
          'Количество': item.quantity,
          'Цена за единицу': item.unitPrice,
          'Общая цена': item.totalPrice,
        }))
      )
    };

    return [
      summarySheet,
      trendsSheet,
      categoriesSheet,
      productsSheet,
      transactionsSheet,
      salesSheet,
      salesDetailsSheet,
    ];
  }

  /**
   * Форматирует данные дашборда для экспорта
   */
  static formatDashboardReport(data: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalSales: number;
    recentTransactions: Array<{
      id: string;
      description: string;
      amount: number;
      type: string;
      date: Date;
    }>;
    lowStockItems: Array<{
      id: string;
      name: string;
      stockQuantity: number;
      minStockLevel: number;
    }>;
  }) {
    const { totalRevenue, totalExpenses, netProfit, totalSales, recentTransactions, lowStockItems } = data;

    // Основные показатели
    const mainMetricsSheet = {
      name: 'Основные показатели',
      data: [
        { 'Показатель': 'Общая выручка', 'Значение': totalRevenue, 'Валюта': 'USD' },
        { 'Показатель': 'Общие расходы', 'Значение': totalExpenses, 'Валюта': 'USD' },
        { 'Показатель': 'Чистая прибыль', 'Значение': netProfit, 'Валюта': 'USD' },
        { 'Показатель': 'Общее количество продаж', 'Значение': totalSales, 'Валюта': 'шт' },
      ]
    };

    // Последние транзакции
    const recentTransactionsSheet = {
      name: 'Последние транзакции',
      data: recentTransactions.map(transaction => ({
        'ID': transaction.id,
        'Описание': transaction.description,
        'Сумма': transaction.amount,
        'Тип': transaction.type,
        'Дата': transaction.date.toLocaleDateString('ru-RU'),
        'Время': transaction.date.toLocaleTimeString('ru-RU'),
      }))
    };

    // Товары с низким остатком
    const lowStockSheet = {
      name: 'Товары с низким остатком',
      data: lowStockItems.map(item => ({
        'ID': item.id,
        'Название товара': item.name,
        'Текущий остаток': item.stockQuantity,
        'Минимальный уровень': item.minStockLevel,
        'Статус': item.stockQuantity <= item.minStockLevel ? 'Критический' : 'Низкий',
      }))
    };

    return [
      mainMetricsSheet,
      recentTransactionsSheet,
      lowStockSheet,
    ];
  }
}

/**
 * Простая функция для быстрого экспорта данных
 */
export function exportToExcel(sheets: ExcelSheetData[], filename: string): void {
  const exporter = new ExcelExporter();
  
  sheets.forEach(sheet => {
    exporter.addSheet(sheet);
  });
  
  exporter.downloadFile(filename);
}

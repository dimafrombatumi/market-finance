import { ExcelExporter, ExcelSheetData } from './excelUtils';
import { Product, Sale, Transaction, Instructor, Workshop, WorkshopRegistration } from '../types';

export interface BackupData {
  version: string;
  timestamp: string;
  data: {
    products: Product[];
    sales: Sale[];
    transactions: Transaction[];
    instructors: Instructor[];
    workshops: Workshop[];
    workshopRegistrations: WorkshopRegistration[];
  };
  metadata: {
    totalRecords: number;
    backupType: 'full' | 'products' | 'sales' | 'transactions' | 'workshops' | 'instructors';
    appVersion: string;
  };
}

export interface BackupOptions {
  type: 'full' | 'products' | 'sales' | 'transactions' | 'workshops' | 'instructors';
  includeMetadata?: boolean;
  format?: 'json' | 'excel' | 'both';
}

export class BackupManager {
  private static readonly BACKUP_VERSION = '1.0.0';
  private static readonly APP_VERSION = '1.0.0';

  /**
   * Создает резервную копию данных
   */
  static createBackup(
    data: {
      products: Product[];
      sales: Sale[];
      transactions: Transaction[];
      instructors: Instructor[];
      workshops: Workshop[];
      workshopRegistrations: WorkshopRegistration[];
    },
    options: BackupOptions = { type: 'full', includeMetadata: true, format: 'json' }
  ): BackupData | ExcelSheetData[] {
    const timestamp = new Date().toISOString();
    const filteredData = this.filterDataByType(data, options.type);
    
    const backupData: BackupData = {
      version: this.BACKUP_VERSION,
      timestamp,
      data: filteredData,
      metadata: {
        totalRecords: this.getTotalRecords(filteredData),
        backupType: options.type,
        appVersion: this.APP_VERSION,
      },
    };

    if (options.format === 'excel' || options.format === 'both') {
      return this.createExcelBackup(backupData);
    }

    return backupData;
  }

  /**
   * Фильтрует данные по типу резервной копии
   */
  private static filterDataByType(
    data: {
      products: Product[];
      sales: Sale[];
      transactions: Transaction[];
      instructors: Instructor[];
      workshops: Workshop[];
      workshopRegistrations: WorkshopRegistration[];
    },
    type: BackupOptions['type']
  ) {
    switch (type) {
      case 'products':
        return {
          products: data.products,
          sales: [],
          transactions: [],
          instructors: [],
          workshops: [],
          workshopRegistrations: [],
        };
      case 'sales':
        return {
          products: [],
          sales: data.sales,
          transactions: [],
          instructors: [],
          workshops: [],
          workshopRegistrations: [],
        };
      case 'transactions':
        return {
          products: [],
          sales: [],
          transactions: data.transactions,
          instructors: [],
          workshops: [],
          workshopRegistrations: [],
        };
      case 'instructors':
        return {
          products: [],
          sales: [],
          transactions: [],
          instructors: data.instructors,
          workshops: [],
          workshopRegistrations: [],
        };
      case 'workshops':
        return {
          products: [],
          sales: [],
          transactions: [],
          instructors: [],
          workshops: data.workshops,
          workshopRegistrations: [],
        };
      case 'full':
      default:
        return data;
    }
  }

  /**
   * Подсчитывает общее количество записей
   */
  private static getTotalRecords(data: any): number {
    return Object.values(data).reduce((total: number, records: any) => {
      return total + (Array.isArray(records) ? records.length : 0);
    }, 0);
  }

  /**
   * Создает Excel резервную копию
   */
  private static createExcelBackup(backupData: BackupData): ExcelSheetData[] {
    const sheets: ExcelSheetData[] = [];

    // Метаданные
    sheets.push({
      name: 'Metadata',
      data: [
        { 'Field': 'Version', 'Value': backupData.version },
        { 'Field': 'Timestamp', 'Value': backupData.timestamp },
        { 'Field': 'Backup Type', 'Value': backupData.metadata.backupType },
        { 'Field': 'Total Records', 'Value': backupData.metadata.totalRecords },
        { 'Field': 'App Version', 'Value': backupData.metadata.appVersion },
      ],
    });

    // Товары
    if (backupData.data.products.length > 0) {
      sheets.push({
        name: 'Products',
        data: backupData.data.products.map(product => ({
          'ID': product.id,
          'Name': product.name,
          'Description': product.description,
          'Price': product.price,
          'Cost': product.cost,
          'Category': product.category,
          'Stock Quantity': product.stockQuantity,
          'Min Stock Level': product.minStockLevel,
          'SKU': product.sku || '',
          'Image URL': product.imageUrl || '',
          'Created At': new Date(product.createdAt).toLocaleString(),
          'Updated At': new Date(product.updatedAt).toLocaleString(),
        })),
      });
    }

    // Продажи
    if (backupData.data.sales.length > 0) {
      sheets.push({
        name: 'Sales',
        data: backupData.data.sales.map(sale => ({
          'ID': sale.id,
          'Sale Date': new Date(sale.saleDate).toLocaleString(),
          'Customer Name': sale.customerName || '',
          'Customer Email': sale.customerEmail || '',
          'Customer Phone': sale.customerPhone || '',
          'Subtotal': sale.subtotal,
          'Tax Amount': sale.taxAmount,
          'Discount Amount': sale.discountAmount,
          'Total Amount': sale.totalAmount,
          'Payment Method': sale.paymentMethod,
          'Status': sale.status,
          'Notes': sale.notes || '',
          'Items Count': sale.items.length,
        })),
      });

      // Детали продаж
      const salesDetails = backupData.data.sales.flatMap(sale =>
        sale.items.map(item => ({
          'Sale ID': sale.id,
          'Product ID': item.productId,
          'Product Name': item.productName,
          'Quantity': item.quantity,
          'Unit Price': item.unitPrice,
          'Total Price': item.totalPrice,
        }))
      );

      if (salesDetails.length > 0) {
        sheets.push({
          name: 'Sales Details',
          data: salesDetails,
        });
      }
    }

    // Транзакции
    if (backupData.data.transactions.length > 0) {
      sheets.push({
        name: 'Transactions',
        data: backupData.data.transactions.map(transaction => ({
          'ID': transaction.id,
          'Type': transaction.type,
          'Category': transaction.category,
          'Description': transaction.description,
          'Amount': transaction.amount,
          'Date': new Date(transaction.date).toLocaleString(),
          'Reference ID': transaction.referenceId || '',
          'Notes': transaction.notes || '',
        })),
      });
    }

    // Преподаватели
    if (backupData.data.instructors.length > 0) {
      sheets.push({
        name: 'Instructors',
        data: backupData.data.instructors.map(instructor => ({
          'ID': instructor.id,
          'Name': instructor.name,
          'Email': instructor.email,
          'Phone': instructor.phone || '',
          'Bio': instructor.bio || '',
          'Specialties': instructor.specialties.join(', '),
          'Experience': instructor.experience,
          'Hourly Rate': instructor.hourlyRate,
          'Image URL': instructor.imageUrl || '',
          'Instagram': instructor.socialLinks?.instagram || '',
          'Facebook': instructor.socialLinks?.facebook || '',
          'Website': instructor.socialLinks?.website || '',
          'Is Active': instructor.isActive ? 'Yes' : 'No',
          'Created At': new Date(instructor.createdAt).toLocaleString(),
          'Updated At': new Date(instructor.updatedAt).toLocaleString(),
        })),
      });
    }

    // Мастер-классы
    if (backupData.data.workshops.length > 0) {
      sheets.push({
        name: 'Workshops',
        data: backupData.data.workshops.map(workshop => ({
          'ID': workshop.id,
          'Title': workshop.title,
          'Description': workshop.description,
          'Short Description': workshop.shortDescription,
          'Instructor ID': workshop.instructorId,
          'Category': workshop.category,
          'Skill Level': workshop.skillLevel,
          'Duration': workshop.duration,
          'Max Participants': workshop.maxParticipants,
          'Price': workshop.price,
          'Materials Cost': workshop.materialsCost || '',
          'Image URL': workshop.imageUrl || '',
          'Requirements': workshop.requirements?.join(', ') || '',
          'Materials': workshop.materials?.join(', ') || '',
          'Status': workshop.status,
          'Is Recurring': workshop.isRecurring ? 'Yes' : 'No',
          'Recurring Pattern': workshop.recurringPattern || '',
          'Tags': workshop.tags.join(', '),
          'Created At': new Date(workshop.createdAt).toLocaleString(),
          'Updated At': new Date(workshop.updatedAt).toLocaleString(),
        })),
      });

      // Расписание мастер-классов
      const schedules = backupData.data.workshops.flatMap(workshop =>
        workshop.schedule.map(schedule => ({
          'Workshop ID': workshop.id,
          'Schedule ID': schedule.id,
          'Start Date': new Date(schedule.startDate).toLocaleDateString(),
          'End Date': new Date(schedule.endDate).toLocaleDateString(),
          'Start Time': schedule.startTime,
          'End Time': schedule.endTime,
          'Location': schedule.location,
          'Room': schedule.room || '',
          'Max Participants': schedule.maxParticipants,
          'Current Participants': schedule.currentParticipants,
          'Status': schedule.status,
          'Notes': schedule.notes || '',
        }))
      );

      if (schedules.length > 0) {
        sheets.push({
          name: 'Workshop Schedules',
          data: schedules,
        });
      }
    }

    // Записи на мастер-классы
    if (backupData.data.workshopRegistrations.length > 0) {
      sheets.push({
        name: 'Workshop Registrations',
        data: backupData.data.workshopRegistrations.map(registration => ({
          'ID': registration.id,
          'Workshop ID': registration.workshopId,
          'Schedule ID': registration.scheduleId,
          'Customer Name': registration.customerName,
          'Customer Email': registration.customerEmail,
          'Customer Phone': registration.customerPhone || '',
          'Registration Date': new Date(registration.registrationDate).toLocaleString(),
          'Status': registration.status,
          'Payment Status': registration.paymentStatus,
          'Payment Method': registration.paymentMethod,
          'Total Amount': registration.totalAmount,
          'Notes': registration.notes || '',
          'Special Requests': registration.specialRequests || '',
        })),
      });
    }

    return sheets;
  }

  /**
   * Скачивает JSON резервную копию
   */
  static downloadJsonBackup(backupData: BackupData, filename?: string): void {
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `backup_${backupData.timestamp.split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Скачивает Excel резервную копию
   */
  static downloadExcelBackup(sheets: ExcelSheetData[], filename?: string): void {
    const exporter = new ExcelExporter();
    
    sheets.forEach(sheet => {
      exporter.addSheet(sheet);
    });
    
    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = filename || `backup_${timestamp}.xlsx`;
    exporter.downloadFile(finalFilename);
  }

  /**
   * Восстанавливает данные из JSON резервной копии
   */
  static restoreFromJson(jsonString: string): BackupData {
    try {
      const backupData = JSON.parse(jsonString) as BackupData;
      
      // Валидация структуры
      if (!backupData.version || !backupData.timestamp || !backupData.data) {
        throw new Error('Invalid backup file format');
      }

      // Конвертация дат
      const convertDates = (obj: any): any => {
        if (obj && typeof obj === 'object') {
          if (Array.isArray(obj)) {
            return obj.map(convertDates);
          } else {
            const converted: any = {};
            for (const key in obj) {
              if (key.includes('Date') || key.includes('At')) {
                converted[key] = new Date(obj[key]);
              } else {
                converted[key] = convertDates(obj[key]);
              }
            }
            return converted;
          }
        }
        return obj;
      };

      return convertDates(backupData);
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Валидирует файл резервной копии
   */
  static validateBackupFile(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.json')) {
        reject(new Error('Invalid file format. Please select a JSON backup file.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const backupData = JSON.parse(content);
          
          if (backupData.version && backupData.timestamp && backupData.data) {
            resolve(true);
          } else {
            reject(new Error('Invalid backup file structure'));
          }
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * Получает размер файла в читаемом формате
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

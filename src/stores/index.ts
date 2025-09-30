// Export all stores
export { useProductStore } from './productStore';
export { useSalesStore } from './salesStore';
export { useTransactionStore } from './transactionStore';
export { useDashboardStore } from './dashboardStore';
export { useInstructorStore } from './instructorStore';
export { useWorkshopStore } from './workshopStore';
export { useWorkshopRegistrationStore } from './workshopRegistrationStore';

// Re-export types for convenience
export type { 
  Product, 
  Sale, 
  Transaction, 
  DashboardData,
  Instructor,
  Workshop,
  WorkshopSchedule,
  WorkshopRegistration,
  InstructorFormData,
  WorkshopFormData,
  WorkshopScheduleFormData,
  WorkshopRegistrationFormData
} from '../types';

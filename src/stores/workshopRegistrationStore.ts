import { create } from 'zustand';
import { WorkshopRegistration, WorkshopRegistrationFormData } from '../types';
import { supabase } from '../lib/supabase';

interface WorkshopRegistrationState {
  registrations: WorkshopRegistration[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRegistrations: (workshopId?: string) => Promise<void>;
  addRegistration: (registration: WorkshopRegistrationFormData & { workshopId: string; scheduleId: string }) => Promise<void>;
  updateRegistration: (id: string, registration: Partial<WorkshopRegistrationFormData>) => Promise<void>;
  deleteRegistration: (id: string) => Promise<void>;
  getRegistrationById: (id: string) => WorkshopRegistration | undefined;
  getRegistrationsByWorkshop: (workshopId: string) => WorkshopRegistration[];
  getRegistrationsBySchedule: (scheduleId: string) => WorkshopRegistration[];
  updateRegistrationStatus: (id: string, status: WorkshopRegistration['status']) => Promise<void>;
  updatePaymentStatus: (id: string, paymentStatus: WorkshopRegistration['paymentStatus']) => Promise<void>;
}

export const useWorkshopRegistrationStore = create<WorkshopRegistrationState>((set, get) => ({
  registrations: [],
  loading: false,
  error: null,

  fetchRegistrations: async (workshopId) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('workshop_registrations')
        .select('*')
        .order('registration_date', { ascending: false });

      if (workshopId) {
        query = query.eq('workshop_id', workshopId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const registrations = data?.map(registration => ({
        ...registration,
        workshopId: registration.workshop_id,
        scheduleId: registration.schedule_id,
        customerName: registration.customer_name,
        customerEmail: registration.customer_email,
        customerPhone: registration.customer_phone,
        paymentMethod: registration.payment_method,
        totalAmount: registration.total_amount,
        paidAmount: registration.paid_amount,
        refundAmount: registration.refund_amount,
        specialRequests: registration.special_requests,
        registrationDate: new Date(registration.registration_date),
      })) || [];

      set({ registrations, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch registrations',
        loading: false 
      });
    }
  },

  addRegistration: async (registrationData) => {
    set({ loading: true, error: null });
    try {
      // Check if there are available spots
      const { data: scheduleData, error: scheduleError } = await supabase
        .from('workshop_schedules')
        .select('max_participants, current_participants')
        .eq('id', registrationData.scheduleId)
        .single();

      if (scheduleError) throw scheduleError;

      if (scheduleData.current_participants >= scheduleData.max_participants) {
        throw new Error('Нет свободных мест на этот мастер-класс');
      }

      // Get workshop data to calculate total amount
      const { data: workshopData, error: workshopError } = await supabase
        .from('workshops')
        .select('price, materials_cost')
        .eq('id', registrationData.workshopId)
        .single();

      if (workshopError) throw workshopError;

      const totalAmount = workshopData.price + (workshopData.materials_cost || 0);

      const { data, error } = await supabase
        .from('workshop_registrations')
        .insert([{
          workshop_id: registrationData.workshopId,
          schedule_id: registrationData.scheduleId,
          customer_name: registrationData.customerName,
          customer_email: registrationData.customerEmail,
          customer_phone: registrationData.customerPhone,
          payment_method: registrationData.paymentMethod,
          total_amount: totalAmount,
          registration_date: new Date().toISOString(),
          notes: registrationData.notes,
          special_requests: registrationData.specialRequests,
        }])
        .select()
        .single();

      if (error) throw error;

      // Update current participants count
      await supabase
        .from('workshop_schedules')
        .update({ current_participants: scheduleData.current_participants + 1 })
        .eq('id', registrationData.scheduleId);

      const newRegistration = {
        ...data,
        workshopId: data.workshop_id,
        scheduleId: data.schedule_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        paymentMethod: data.payment_method,
        totalAmount: data.total_amount,
        paidAmount: data.paid_amount,
        refundAmount: data.refund_amount,
        specialRequests: data.special_requests,
        registrationDate: new Date(data.registration_date),
      };

      set(state => ({
        registrations: [newRegistration, ...state.registrations],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add registration',
        loading: false 
      });
    }
  },

  updateRegistration: async (id, registrationData) => {
    set({ loading: true, error: null });
    try {
      // Map form data to database fields
      const updateData: any = {};
      if (registrationData.customerName) updateData.customer_name = registrationData.customerName;
      if (registrationData.customerEmail) updateData.customer_email = registrationData.customerEmail;
      if (registrationData.customerPhone) updateData.customer_phone = registrationData.customerPhone;
      if (registrationData.paymentMethod) updateData.payment_method = registrationData.paymentMethod;
      if (registrationData.notes) updateData.notes = registrationData.notes;
      if (registrationData.specialRequests) updateData.special_requests = registrationData.specialRequests;

      const { data, error } = await supabase
        .from('workshop_registrations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedRegistration = {
        ...data,
        workshopId: data.workshop_id,
        scheduleId: data.schedule_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        paymentMethod: data.payment_method,
        totalAmount: data.total_amount,
        paidAmount: data.paid_amount,
        refundAmount: data.refund_amount,
        specialRequests: data.special_requests,
        registrationDate: new Date(data.registration_date),
      };

      set(state => ({
        registrations: state.registrations.map(registration =>
          registration.id === id ? updatedRegistration : registration
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update registration',
        loading: false 
      });
    }
  },

  deleteRegistration: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        registrations: state.registrations.filter(registration => registration.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete registration',
        loading: false 
      });
    }
  },

  getRegistrationById: (id) => {
    return get().registrations.find(registration => registration.id === id);
  },

  getRegistrationsByWorkshop: (workshopId) => {
    return get().registrations.filter(registration => registration.workshopId === workshopId);
  },

  getRegistrationsBySchedule: (scheduleId) => {
    return get().registrations.filter(registration => registration.scheduleId === scheduleId);
  },

  updateRegistrationStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedRegistration = {
        ...data,
        workshopId: data.workshop_id,
        scheduleId: data.schedule_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        paymentMethod: data.payment_method,
        totalAmount: data.total_amount,
        paidAmount: data.paid_amount,
        refundAmount: data.refund_amount,
        specialRequests: data.special_requests,
        registrationDate: new Date(data.registration_date),
      };

      set(state => ({
        registrations: state.registrations.map(registration =>
          registration.id === id ? updatedRegistration : registration
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update registration status',
        loading: false 
      });
    }
  },

  updatePaymentStatus: async (id, paymentStatus) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workshop_registrations')
        .update({ payment_status: paymentStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedRegistration = {
        ...data,
        workshopId: data.workshop_id,
        scheduleId: data.schedule_id,
        customerName: data.customer_name,
        customerEmail: data.customer_email,
        customerPhone: data.customer_phone,
        paymentMethod: data.payment_method,
        totalAmount: data.total_amount,
        paidAmount: data.paid_amount,
        refundAmount: data.refund_amount,
        specialRequests: data.special_requests,
        registrationDate: new Date(data.registration_date),
      };

      set(state => ({
        registrations: state.registrations.map(registration =>
          registration.id === id ? updatedRegistration : registration
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update payment status',
        loading: false 
      });
    }
  },
}));

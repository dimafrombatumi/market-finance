import { create } from 'zustand';
import { Workshop, WorkshopFormData, WorkshopSchedule, WorkshopScheduleFormData } from '../types';
import { supabase } from '../lib/supabase';

interface WorkshopState {
  workshops: Workshop[];
  schedules: WorkshopSchedule[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchWorkshops: () => Promise<void>;
  fetchSchedules: (workshopId?: string) => Promise<void>;
  addWorkshop: (workshop: WorkshopFormData) => Promise<void>;
  updateWorkshop: (id: string, workshop: WorkshopFormData) => Promise<void>;
  deleteWorkshop: (id: string) => Promise<void>;
  getWorkshopById: (id: string) => Workshop | undefined;
  getPublishedWorkshops: () => Workshop[];
  addSchedule: (workshopId: string, schedule: WorkshopScheduleFormData) => Promise<void>;
  updateSchedule: (id: string, schedule: WorkshopScheduleFormData) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
  getSchedulesByWorkshop: (workshopId: string) => WorkshopSchedule[];
  restoreWorkshops: (workshops: Workshop[]) => void;
  restoreSchedules: (schedules: WorkshopSchedule[]) => void;
}

export const useWorkshopStore = create<WorkshopState>((set, get) => ({
  workshops: [],
  schedules: [],
  loading: false,
  error: null,

  fetchWorkshops: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workshops')
        .select(`
          *,
          instructor:instructors(*),
          category:workshop_categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const workshops = data?.map(workshop => ({
        ...workshop,
        skillLevel: workshop.skill_level || 'beginner',
        shortDescription: workshop.short_description || '',
        instructorId: workshop.instructor_id || '',
        category: workshop.category?.name || '', // Map category name for form
        instructor: workshop.instructor ? {
          ...workshop.instructor,
          createdAt: new Date(workshop.instructor.created_at),
          updatedAt: new Date(workshop.instructor.updated_at),
        } : undefined,
        createdAt: new Date(workshop.created_at),
        updatedAt: new Date(workshop.updated_at),
        schedule: [], // Will be loaded separately
      })) || [];

      set({ workshops, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch workshops',
        loading: false 
      });
    }
  },

  fetchSchedules: async (workshopId) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('workshop_schedules')
        .select('*')
        .order('start_date', { ascending: true });

      if (workshopId) {
        query = query.eq('workshop_id', workshopId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const schedules = data?.map(schedule => ({
        ...schedule,
        workshopId: schedule.workshop_id, // Map workshop_id to workshopId
        startDate: new Date(schedule.start_date),
        endDate: new Date(schedule.end_date),
      })) || [];

      set({ schedules, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch schedules',
        loading: false 
      });
    }
  },

  addWorkshop: async (workshopData) => {
    set({ loading: true, error: null });
    try {
      // Get category_id based on category name
      let categoryId = null;
      if (workshopData.category) {
        const { data: categoryData } = await supabase
          .from('workshop_categories')
          .select('id')
          .eq('name', workshopData.category)
          .single();
        categoryId = categoryData?.id || null;
      }

      const { data, error } = await supabase
        .from('workshops')
        .insert([{
          title: workshopData.title,
          description: workshopData.description,
          short_description: workshopData.shortDescription,
          instructor_id: workshopData.instructorId,
          category_id: categoryId,
          skill_level: workshopData.skillLevel,
          duration: workshopData.duration,
          max_participants: workshopData.maxParticipants,
          price: workshopData.price,
          materials_cost: workshopData.materialsCost || 0,
          image_url: workshopData.imageUrl || null,
          gallery_images: [],
          requirements: workshopData.requirements || [],
          materials: workshopData.materials || [],
          status: 'draft',
          is_recurring: workshopData.isRecurring || false,
          recurring_pattern: workshopData.recurringPattern || null,
          tags: workshopData.tags || [],
          total_registrations: 0,
        }])
        .select(`
          *,
          instructor:instructors(*),
          category:workshop_categories(*)
        `)
        .single();

      if (error) throw error;

      const newWorkshop = {
        ...data,
        skillLevel: data.skill_level || 'beginner',
        shortDescription: data.short_description || '',
        instructorId: data.instructor_id || '',
        category: data.category?.name || '', // Map category name for form
        instructor: data.instructor ? {
          ...data.instructor,
          createdAt: new Date(data.instructor.created_at),
          updatedAt: new Date(data.instructor.updated_at),
        } : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        schedule: [],
      };

      set(state => ({
        workshops: [newWorkshop, ...state.workshops],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding workshop:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add workshop',
        loading: false 
      });
    }
  },

  updateWorkshop: async (id, workshopData) => {
    set({ loading: true, error: null });
    try {
      // Get category_id based on category name
      let categoryId = null;
      if (workshopData.category) {
        const { data: categoryData } = await supabase
          .from('workshop_categories')
          .select('id')
          .eq('name', workshopData.category)
          .single();
        categoryId = categoryData?.id || null;
      }

      const { data, error } = await supabase
        .from('workshops')
        .update({
          title: workshopData.title,
          description: workshopData.description,
          short_description: workshopData.shortDescription,
          instructor_id: workshopData.instructorId,
          category_id: categoryId,
          skill_level: workshopData.skillLevel,
          duration: workshopData.duration,
          max_participants: workshopData.maxParticipants,
          price: workshopData.price,
          materials_cost: workshopData.materialsCost || 0,
          image_url: workshopData.imageUrl || null,
          requirements: workshopData.requirements || [],
          materials: workshopData.materials || [],
          is_recurring: workshopData.isRecurring || false,
          recurring_pattern: workshopData.recurringPattern || null,
          tags: workshopData.tags || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          instructor:instructors(*),
          category:workshop_categories(*)
        `)
        .single();

      if (error) throw error;

      const updatedWorkshop = {
        ...data,
        skillLevel: data.skill_level || 'beginner',
        shortDescription: data.short_description || '',
        instructorId: data.instructor_id || '',
        category: data.category?.name || '', // Map category name for form
        instructor: data.instructor ? {
          ...data.instructor,
          createdAt: new Date(data.instructor.created_at),
          updatedAt: new Date(data.instructor.updated_at),
        } : undefined,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        schedule: get().getSchedulesByWorkshop(id),
      };

      set(state => ({
        workshops: state.workshops.map(workshop =>
          workshop.id === id ? updatedWorkshop : workshop
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating workshop:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update workshop',
        loading: false 
      });
    }
  },

  deleteWorkshop: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('workshops')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        workshops: state.workshops.filter(workshop => workshop.id !== id),
        schedules: state.schedules.filter(schedule => schedule.workshopId !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete workshop',
        loading: false 
      });
    }
  },

  getWorkshopById: (id) => {
    return get().workshops.find(workshop => workshop.id === id);
  },

  getPublishedWorkshops: () => {
    return get().workshops.filter(workshop => workshop.status === 'published');
  },

  addSchedule: async (workshopId, scheduleData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workshop_schedules')
        .insert([{
          workshop_id: workshopId,
          start_date: scheduleData.startDate.toISOString().split('T')[0],
          end_date: scheduleData.endDate.toISOString().split('T')[0],
          start_time: scheduleData.startTime,
          end_time: scheduleData.endTime,
          location: scheduleData.location,
          room: scheduleData.room,
          max_participants: scheduleData.maxParticipants,
          notes: scheduleData.notes,
        }])
        .select()
        .single();

      if (error) throw error;

      const newSchedule = {
        ...data,
        workshopId: data.workshop_id, // Map workshop_id to workshopId
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
      };

      set(state => ({
        schedules: [...state.schedules, newSchedule],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add schedule',
        loading: false 
      });
    }
  },

  updateSchedule: async (id, scheduleData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('workshop_schedules')
        .update({
          start_date: scheduleData.startDate.toISOString().split('T')[0],
          end_date: scheduleData.endDate.toISOString().split('T')[0],
          start_time: scheduleData.startTime,
          end_time: scheduleData.endTime,
          location: scheduleData.location,
          room: scheduleData.room,
          max_participants: scheduleData.maxParticipants,
          notes: scheduleData.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSchedule = {
        ...data,
        workshopId: data.workshop_id, // Map workshop_id to workshopId
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
      };

      set(state => ({
        schedules: state.schedules.map(schedule =>
          schedule.id === id ? updatedSchedule : schedule
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update schedule',
        loading: false 
      });
    }
  },

  deleteSchedule: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('workshop_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        schedules: state.schedules.filter(schedule => schedule.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete schedule',
        loading: false 
      });
    }
  },

  getSchedulesByWorkshop: (workshopId) => {
    return get().schedules.filter(schedule => schedule.workshopId === workshopId);
  },

  restoreWorkshops: (workshops: Workshop[]) => {
    set({ workshops, loading: false, error: null });
  },

  restoreSchedules: (schedules: WorkshopSchedule[]) => {
    set({ schedules, loading: false, error: null });
  },
}));

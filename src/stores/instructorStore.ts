import { create } from 'zustand';
import { Instructor, InstructorFormData } from '../types';
import { supabase } from '../lib/supabase';

interface InstructorState {
  instructors: Instructor[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchInstructors: () => Promise<void>;
  addInstructor: (instructor: InstructorFormData) => Promise<void>;
  updateInstructor: (id: string, instructor: InstructorFormData) => Promise<void>;
  deleteInstructor: (id: string) => Promise<void>;
  getInstructorById: (id: string) => Instructor | undefined;
  getActiveInstructors: () => Instructor[];
  restoreInstructors: (instructors: Instructor[]) => void;
}

export const useInstructorStore = create<InstructorState>((set, get) => ({
  instructors: [],
  loading: false,
  error: null,

  fetchInstructors: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('instructors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const instructors = data?.map(instructor => ({
        ...instructor,
        createdAt: new Date(instructor.created_at),
        updatedAt: new Date(instructor.updated_at),
      })) || [];

      set({ instructors, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch instructors',
        loading: false 
      });
    }
  },

  addInstructor: async (instructorData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('instructors')
        .insert([{
          ...instructorData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;

      const newInstructor = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set(state => ({
        instructors: [newInstructor, ...state.instructors],
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to add instructor',
        loading: false 
      });
    }
  },

  updateInstructor: async (id, instructorData) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('instructors')
        .update({
          ...instructorData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedInstructor = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      set(state => ({
        instructors: state.instructors.map(instructor =>
          instructor.id === id ? updatedInstructor : instructor
        ),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update instructor',
        loading: false 
      });
    }
  },

  deleteInstructor: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('instructors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        instructors: state.instructors.filter(instructor => instructor.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete instructor',
        loading: false 
      });
    }
  },

  getInstructorById: (id) => {
    return get().instructors.find(instructor => instructor.id === id);
  },

  getActiveInstructors: () => {
    return get().instructors.filter(instructor => instructor.isActive);
  },

  restoreInstructors: (instructors: Instructor[]) => {
    set({ instructors, loading: false, error: null });
  },
}));

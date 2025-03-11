export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      animals: {
        Row: {
          id: string
          national_id: string
          name: string | null
          birth_date: string
          gender: string
          breed: string
          status: string
          group_type: string
          weight: number | null
          height: number | null
          body_condition_score: number | null
          lactation_number: number
          welfare_score: number | null
          mother_id: string | null
          father_id: string | null
          reproductive_status: string | null
          last_insemination_date: string | null
          expected_calving_date: string | null
          rfid_tag: string | null
          image_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          national_id: string
          name?: string | null
          birth_date: string
          gender: string
          breed: string
          status?: string
          group_type: string
          weight?: number | null
          height?: number | null
          body_condition_score?: number | null
          lactation_number?: number
          welfare_score?: number | null
          mother_id?: string | null
          father_id?: string | null
          reproductive_status?: string | null
          last_insemination_date?: string | null
          expected_calving_date?: string | null
          rfid_tag?: string | null
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          national_id?: string
          name?: string | null
          birth_date?: string
          gender?: string
          breed?: string
          status?: string
          group_type?: string
          weight?: number | null
          height?: number | null
          body_condition_score?: number | null
          lactation_number?: number
          welfare_score?: number | null
          mother_id?: string | null
          father_id?: string | null
          reproductive_status?: string | null
          last_insemination_date?: string | null
          expected_calving_date?: string | null
          rfid_tag?: string | null
          image_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milk_sessions: {
        Row: {
          id: string
          session_date: string
          session_type: string
          start_time: string | null
          end_time: string | null
          total_milk: number | null
          milker_id: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_date: string
          session_type: string
          start_time?: string | null
          end_time?: string | null
          total_milk?: number | null
          milker_id: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_date?: string
          session_type?: string
          start_time?: string | null
          end_time?: string | null
          total_milk?: number | null
          milker_id?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      milk_records: {
        Row: {
          id: string
          session_id: string
          animal_id: string
          quantity: number
          temperature: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          animal_id: string
          quantity: number
          temperature?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          animal_id?: string
          quantity?: number
          temperature?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          animal_id: string
          record_date: string
          record_type: string
          diagnosis: string | null
          treatment: string | null
          medication: Json | null
          performed_by: string
          follow_up_date: string | null
          priority: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          animal_id: string
          record_date: string
          record_type: string
          diagnosis?: string | null
          treatment?: string | null
          medication?: Json | null
          performed_by: string
          follow_up_date?: string | null
          priority?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          animal_id?: string
          record_date?: string
          record_type?: string
          diagnosis?: string | null
          treatment?: string | null
          medication?: Json | null
          performed_by?: string
          follow_up_date?: string | null
          priority?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stock_items: {
        Row: {
          id: string
          name: string
          category: string
          sku: string
          barcode: string | null
          unit: string
          quantity: number
          min_quantity: number
          max_quantity: number | null
          location: string | null
          price: number
          expiry_date: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          sku: string
          barcode?: string | null
          unit: string
          quantity: number
          min_quantity: number
          max_quantity?: number | null
          location?: string | null
          price: number
          expiry_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          sku?: string
          barcode?: string | null
          unit?: string
          quantity?: number
          min_quantity?: number
          max_quantity?: number | null
          location?: string | null
          price?: number
          expiry_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          status: string
          priority: string
          assigned_to: string | null
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          status?: string
          priority?: string
          assigned_to?: string | null
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          status?: string
          priority?: string
          assigned_to?: string | null
          category?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
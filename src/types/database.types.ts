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
      freelance_contacts: {
        Row: {
          id: string
          profile_id: string
          whatsapp_link: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          whatsapp_link: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          whatsapp_link?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type FreelanceContact = Database['public']['Tables']['freelance_contacts']['Row']

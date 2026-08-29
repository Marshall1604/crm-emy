export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      team_members: {
        Row: {
          id: string;
          name: string;
          initials: string;
          role: string;
          email: string;
          phone: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          initials: string;
          role?: string;
          email: string;
          phone: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          initials?: string;
          role?: string;
          email?: string;
          phone?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          initials: string;
          first_name: string;
          middle_name: string | null;
          last_name: string;
          ssn: string;
          dob: string | null;
          filing_status: string;
          phone: string;
          email: string;
          address: string;
          city: string;
          state: string;
          zip: string;
          spouse_first_name: string | null;
          spouse_last_name: string | null;
          spouse_ssn: string | null;
          spouse_dob: string | null;
          tax_year: string;
          return_type: string;
          status: string;
          assigned_staff: string;
          federal_tax: number;
          fee: number;
          amount_paid: number;
          balance: number;
          state_taxes: Json;
          dependents: Json;
          notes: string | null;
          client_since: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          initials: string;
          first_name?: string;
          middle_name?: string | null;
          last_name?: string;
          ssn?: string;
          dob?: string | null;
          filing_status?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          spouse_first_name?: string | null;
          spouse_last_name?: string | null;
          spouse_ssn?: string | null;
          spouse_dob?: string | null;
          tax_year?: string;
          return_type?: string;
          status?: string;
          assigned_staff?: string;
          federal_tax?: number;
          fee?: number;
          amount_paid?: number;
          balance?: number;
          state_taxes?: Json;
          dependents?: Json;
          notes?: string | null;
          client_since?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          initials?: string;
          first_name?: string;
          middle_name?: string | null;
          last_name?: string;
          ssn?: string;
          dob?: string | null;
          filing_status?: string;
          phone?: string;
          email?: string;
          address?: string;
          city?: string;
          state?: string;
          zip?: string;
          spouse_first_name?: string | null;
          spouse_last_name?: string | null;
          spouse_ssn?: string | null;
          spouse_dob?: string | null;
          tax_year?: string;
          return_type?: string;
          status?: string;
          assigned_staff?: string;
          federal_tax?: number;
          fee?: number;
          amount_paid?: number;
          balance?: number;
          state_taxes?: Json;
          dependents?: Json;
          notes?: string | null;
          client_since?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tax_returns: {
        Row: {
          id: string;
          client_id: string;
          tax_year: string;
          return_type: string;
          filing_status: string;
          status: string;
          assigned_staff: string;
          federal_tax_amount: number;
          preparation_fee: number;
          amount_paid: number;
          balance: number;
          internal_notes: string | null;
          taxpayer_name_snapshot: string;
          address_snapshot: string;
          filing_status_snapshot: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          client_id: string;
          tax_year: string;
          return_type?: string;
          filing_status?: string;
          status?: string;
          assigned_staff?: string;
          federal_tax_amount?: number;
          preparation_fee?: number;
          amount_paid?: number;
          balance?: number;
          internal_notes?: string | null;
          taxpayer_name_snapshot?: string;
          address_snapshot?: string;
          filing_status_snapshot?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          tax_year?: string;
          return_type?: string;
          filing_status?: string;
          status?: string;
          assigned_staff?: string;
          federal_tax_amount?: number;
          preparation_fee?: number;
          amount_paid?: number;
          balance?: number;
          internal_notes?: string | null;
          taxpayer_name_snapshot?: string;
          address_snapshot?: string;
          filing_status_snapshot?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      client_documents: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          size: string;
          type: string;
          tax_year: string | null;
          file_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          client_id: string;
          name: string;
          size?: string;
          type?: string;
          tax_year?: string | null;
          file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          name?: string;
          size?: string;
          type?: string;
          tax_year?: string | null;
          file_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      client_notes: {
        Row: {
          id: string;
          client_id: string;
          author: string;
          content: string;
          tax_year: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          client_id: string;
          author?: string;
          content: string;
          tax_year?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          author?: string;
          content?: string;
          tax_year?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

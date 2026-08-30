export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'user';
export type UserStatus = 'active' | 'blocked' | 'suspended';
export type SubscriptionPlan = 'trial' | 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'past_due' | 'trial';
export type PaymentProvider = 'manual' | 'stripe' | 'zelle' | 'cash' | 'bank_transfer' | 'usdt' | 'other';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          status: UserStatus;
          created_at: string;
          updated_at: string;
          last_sign_in_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          status?: UserStatus;
          created_at?: string;
          updated_at?: string;
          last_sign_in_at?: string | null;
        };
        Relationships: [];
      };
      roles: {
        Row: {
          id: UserRole;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: UserRole;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: UserRole;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          category: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      role_permissions: {
        Row: {
          role_id: UserRole;
          permission_id: string;
        };
        Insert: {
          role_id: UserRole;
          permission_id: string;
        };
        Update: {
          role_id?: UserRole;
          permission_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role_id: UserRole;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role_id: UserRole;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          role_id?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      plans: {
        Row: {
          id: SubscriptionPlan;
          name: string;
          description: string | null;
          price: number;
          interval: string;
          features: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id: SubscriptionPlan;
          name: string;
          description?: string | null;
          price?: number;
          interval: string;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: SubscriptionPlan;
          name?: string;
          description?: string | null;
          price?: number;
          interval?: string;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: SubscriptionPlan;
          status: SubscriptionStatus;
          start_date: string;
          expire_date: string | null;
          lifetime: boolean;
          auto_renew: boolean;
          payment_provider: PaymentProvider;
          payment_id: string | null;
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          start_date?: string;
          expire_date?: string | null;
          lifetime?: boolean;
          auto_renew?: boolean;
          payment_provider?: PaymentProvider;
          payment_id?: string | null;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: SubscriptionPlan;
          status?: SubscriptionStatus;
          start_date?: string;
          expire_date?: string | null;
          lifetime?: boolean;
          auto_renew?: boolean;
          payment_provider?: PaymentProvider;
          payment_id?: string | null;
          amount?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_user_id: string | null;
          target_user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          old_value: Json | null;
          new_value: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          target_user_id?: string | null;
          action: string;
          entity_type?: string | null;
          entity_id?: string | null;
          old_value?: Json | null;
          new_value?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          target_user_id?: string | null;
          action?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          old_value?: Json | null;
          new_value?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          user_id: string | null;
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
          user_id?: string | null;
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
          user_id?: string | null;
          name?: string;
          initials?: string;
          role?: string;
          email?: string;
          phone?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      clients: {
        Row: {
          id: string;
          user_id: string | null;
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
          user_id?: string | null;
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
          user_id?: string | null;
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
        Relationships: [];
      };
      tax_returns: {
        Row: {
          id: string;
          user_id: string | null;
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
          user_id?: string | null;
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
          user_id?: string | null;
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      user_status: UserStatus;
      subscription_plan: SubscriptionPlan;
      subscription_status: SubscriptionStatus;
      payment_provider: PaymentProvider;
    };
    CompositeTypes: Record<string, never>;
  };
}

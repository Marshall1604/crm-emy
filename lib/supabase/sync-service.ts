import { supabase, isSupabaseConfigured } from './client';
import type { ClientRecord } from '@/features/clients/create-client-modal';
import type { TeamMember, MemberRole, MemberStatus } from '@/features/team/member-store';
import type { Json } from './types';

export interface BusinessRecord {
  id: string;
  name: string;
  dba?: string;
  ein: string;
  entityType: string;
  returnType: string;
  year: string;
  status: string;
  preparer: string;
  fee: number;
  balance: number;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  partners?: Array<{
    firstName: string;
    lastName: string;
    ssn: string;
    dob: string;
    phone?: string;
    email?: string;
    address?: string;
    ownership: number;
  }>;
  updated: string;
  link: string;
}

// ─────────────────────────────────────────────────────────────
// 1. INDIVIDUAL CLIENTS
// ─────────────────────────────────────────────────────────────

export async function fetchClientsFromSupabase(userId?: string): Promise<ClientRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    let query = supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.warn('Supabase fetch clients error:', error);
      return null;
    }

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      initials: row.initials || 'CL',
      firstName: row.first_name || '',
      middleName: row.middle_name || '',
      lastName: row.last_name || '',
      ssn: row.ssn || '',
      dob: row.dob || '',
      filingStatus: row.filing_status || 'Single',
      phone: row.phone || '',
      email: row.email || '',
      address: row.address || '',
      city: row.city || '',
      state: row.state || '',
      zip: row.zip || '',
      spouseFirstName: row.spouse_first_name || '',
      spouseLastName: row.spouse_last_name || '',
      spouseSsn: row.spouse_ssn || '',
      spouseDob: row.spouse_dob || '',
      year: row.tax_year || '2025',
      returnType: row.return_type || 'Form 1040',
      status: row.status || 'Waiting Documents',
      staff: row.assigned_staff || 'Unassigned',
      federalTax: Number(row.federal_tax || 0),
      fee: row.fee !== null && row.fee !== undefined ? Number(row.fee) : 0,
      amountPaid: Number(row.amount_paid || 0),
      balance: Number(row.balance || 0),
      stateTaxes: Array.isArray(row.state_taxes) ? (row.state_taxes as unknown as ClientRecord['stateTaxes']) : [],
      dependents: Array.isArray(row.dependents) ? (row.dependents as unknown as ClientRecord['dependents']) : [],
      notes: row.notes || '',
      updated: row.client_since || 'Today',
    }));
  } catch (err) {
    console.error('fetchClientsFromSupabase exception:', err);
    return null;
  }
}

export async function saveClientToSupabase(c: ClientRecord, userId?: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    let authUserId = userId;
    if (!authUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      authUserId = user?.id;
    }

    const payload = {
      id: c.id,
      user_id: authUserId || null,
      name: c.name,
      initials: c.initials,
      first_name: c.firstName,
      middle_name: c.middleName || null,
      last_name: c.lastName,
      ssn: c.ssn,
      dob: c.dob || null,
      filing_status: c.filingStatus,
      phone: c.phone,
      email: c.email,
      address: c.address,
      city: c.city,
      state: c.state,
      zip: c.zip,
      spouse_first_name: c.spouseFirstName || null,
      spouse_last_name: c.spouseLastName || null,
      spouse_ssn: c.spouseSsn || null,
      spouse_dob: c.spouseDob || null,
      tax_year: c.year,
      return_type: c.returnType,
      status: c.status,
      assigned_staff: c.staff,
      federal_tax: c.federalTax,
      fee: c.fee,
      amount_paid: c.amountPaid,
      balance: c.balance,
      state_taxes: (c.stateTaxes as unknown as Json) || [],
      dependents: ((c.dependents || []) as unknown as Json) || [],
      notes: c.notes || null,
      client_since: c.updated,
    };

    const { error } = await supabase.from('clients').upsert(payload);
    if (error) {
      console.error('Failed to save client to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('saveClientToSupabase exception:', err);
    return false;
  }
}

export async function deleteClientFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('clients').delete().eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. TEAM MEMBERS
// ─────────────────────────────────────────────────────────────

export async function fetchTeamFromSupabase(): Promise<TeamMember[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error || !data) return null;

    return data.map((row) => ({
      id: row.id,
      name: row.name,
      initials: row.initials,
      role: (row.role || 'Staff') as MemberRole,
      email: row.email,
      phone: row.phone || '',
      status: (row.status || 'Active') as MemberStatus,
      assigned: 0,
      lastActive: 'Active recently',
    }));
  } catch {
    return null;
  }
}

export async function saveTeamMemberToSupabase(member: TeamMember): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  try {
    const { error } = await supabase.from('team_members').upsert({
      id: member.id,
      name: member.name,
      initials: member.initials,
      role: member.role,
      email: member.email,
      phone: member.phone || '',
      status: member.status,
    });
    return !error;
  } catch {
    return false;
  }
}

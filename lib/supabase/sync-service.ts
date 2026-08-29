import { supabase, isSupabaseConfigured } from './client';
import type { ClientRecord } from '@/features/clients/create-client-modal';
import type { TeamMember } from '@/features/team/member-store';
import type { ClientDocument, ClientNote, TaxReturnEngagement } from '@/features/clients/client-store';

export async function fetchClientsFromSupabase(): Promise<ClientRecord[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.warn('Supabase fetch clients error:', error);
    return null;
  }

  return (data as any[]).map((row) => ({
    id: row.id,
    name: row.name,
    initials: row.initials,
    firstName: row.first_name,
    middleName: row.middle_name || '',
    lastName: row.last_name,
    ssn: row.ssn,
    dob: row.dob || '',
    filingStatus: row.filing_status,
    phone: row.phone,
    email: row.email,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    spouseFirstName: row.spouse_first_name || '',
    spouseLastName: row.spouse_last_name || '',
    spouseSsn: row.spouse_ssn || '',
    spouseDob: row.spouse_dob || '',
    year: row.tax_year,
    returnType: row.return_type,
    status: row.status,
    staff: row.assigned_staff,
    federalTax: Number(row.federal_tax || 0),
    fee: Number(row.fee || 650),
    amountPaid: Number(row.amount_paid || 0),
    balance: Number(row.balance || 0),
    stateTaxes: Array.isArray(row.state_taxes) ? (row.state_taxes as any) : [],
    dependents: Array.isArray(row.dependents) ? (row.dependents as any) : [],
    notes: row.notes || '',
    updated: row.client_since || 'Aug 29, 2026',
  }));
}

export async function saveClientToSupabase(c: ClientRecord): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  const payload = {
    id: c.id,
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
    state_taxes: c.stateTaxes as any,
    dependents: (c.dependents || []) as any,
    notes: c.notes || null,
    client_since: c.updated,
  };

  const { error } = await (supabase.from('clients') as any).upsert(payload);
  if (error) {
    console.error('Failed to save client to Supabase:', error);
    return false;
  }
  return true;
}

export async function deleteClientFromSupabase(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await (supabase.from('clients') as any).delete().eq('id', id);
  return !error;
}

export async function fetchTeamFromSupabase(): Promise<TeamMember[] | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data, error } = await (supabase.from('team_members') as any).select('*');
  if (error || !data) return null;

  return (data as any[]).map((row) => ({
    id: row.id,
    name: row.name,
    initials: row.initials,
    role: row.role as any,
    email: row.email,
    phone: row.phone || '',
    status: row.status as any,
    assigned: Number(row.assigned || 0),
    lastActive: row.last_active || 'Active',
  }));
}

export async function saveTeamMemberToSupabase(member: TeamMember): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;
  const { error } = await (supabase.from('team_members') as any).upsert({
    id: member.id,
    name: member.name,
    initials: member.initials,
    role: member.role,
    email: member.email,
    phone: member.phone,
    status: member.status,
  });
  return !error;
}

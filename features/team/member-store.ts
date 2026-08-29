'use client';
import { useState, useCallback } from 'react';

export type MemberRole = 'Super Admin' | 'Tax Preparer' | 'Reviewer' | 'Staff';
export type MemberStatus = 'Active' | 'Invited' | 'Inactive';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  assigned: number;
  lastActive: string;
  initials: string;
  phone?: string;
}

const makeInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

const seed: TeamMember[] = [
  { id: '1', name: 'Amy Tran',     email: 'amy@crmemy.com',     role: 'Super Admin',  status: 'Active',  assigned: 48, lastActive: 'Just now',           initials: 'AT' },
  { id: '2', name: 'Daniel Lee',   email: 'daniel@crmemy.com',  role: 'Tax Preparer', status: 'Active',  assigned: 37, lastActive: '12 minutes ago',      initials: 'DL' },
  { id: '3', name: 'Sarah Kim',    email: 'sarah@crmemy.com',   role: 'Reviewer',     status: 'Active',  assigned: 24, lastActive: '1 hour ago',           initials: 'SK' },
  { id: '4', name: 'Michael Pham', email: 'michael@crmemy.com', role: 'Staff',        status: 'Invited', assigned: 0,  lastActive: 'Invitation pending',   initials: 'MP' },
];

export function useMemberStore() {
  const [members, setMembers] = useState<TeamMember[]>(seed);

  const addMember = useCallback((data: Omit<TeamMember, 'id' | 'initials' | 'assigned' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...data,
      id: crypto.randomUUID(),
      initials: makeInitials(data.name),
      assigned: 0,
      lastActive: data.status === 'Active' ? 'Just now' : 'Invitation pending',
    };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  }, []);

  const updateMember = useCallback((id: string, data: Partial<Omit<TeamMember, 'id' | 'initials'>>) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, ...data, initials: data.name ? makeInitials(data.name) : m.initials }
          : m
      )
    );
  }, []);

  const deleteMember = useCallback((id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { members, addMember, updateMember, deleteMember };
}

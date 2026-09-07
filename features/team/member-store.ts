'use client';

import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/auth-context';

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

const seedMembers: TeamMember[] = [
  { id: '1', name: 'Amy Tran',     email: 'amy@crmemy.com',     role: 'Super Admin',  status: 'Active',  assigned: 48, lastActive: 'Just now',           initials: 'AT' },
  { id: '2', name: 'Daniel Lee',   email: 'daniel@crmemy.com',  role: 'Tax Preparer', status: 'Active',  assigned: 37, lastActive: '12 minutes ago',      initials: 'DL' },
  { id: '3', name: 'Sarah Kim',    email: 'sarah@crmemy.com',   role: 'Tax Preparer', status: 'Active',  assigned: 24, lastActive: '1 hour ago',           initials: 'SK' },
  { id: '4', name: 'Michael Pham', email: 'michael@crmemy.com', role: 'Tax Preparer', status: 'Invited', assigned: 0,  lastActive: 'Invitation pending',   initials: 'MP' },
];

export function useMemberStore() {
  const { user, profile } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const saved = localStorage.getItem(`crm_emy_team_${user.id}`);
        if (saved) return JSON.parse(saved);
      } catch {}
      const ownerName = profile?.full_name || user.email?.split('@')[0] || 'Administrator';
      const ownerEmail = user.email || 'admin@crmemy.com';
      return [
        {
          id: user.id,
          name: ownerName,
          email: ownerEmail,
          role: 'Super Admin',
          status: 'Active',
          assigned: 0,
          lastActive: 'Just now',
          initials: makeInitials(ownerName),
        },
      ];
    }
    return user ? [] : seedMembers;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      if (user) {
        try {
          const saved = localStorage.getItem(`crm_emy_team_${user.id}`);
          if (saved) {
            setMembers(JSON.parse(saved));
            return;
          }
        } catch {}
        const ownerName = profile?.full_name || user.email?.split('@')[0] || 'Administrator';
        const ownerEmail = user.email || 'admin@crmemy.com';
        setMembers([
          {
            id: user.id,
            name: ownerName,
            email: ownerEmail,
            role: 'Super Admin',
            status: 'Active',
            assigned: 0,
            lastActive: 'Just now',
            initials: makeInitials(ownerName),
          },
        ]);
      } else {
        setMembers(seedMembers);
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        // If regular staff, fallback to profiles query
        const { data: dbProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, status, created_at');

        if (dbProfiles && dbProfiles.length > 0) {
          const mapped: TeamMember[] = dbProfiles.map((p) => ({
            id: p.id,
            name: p.full_name || p.email.split('@')[0],
            email: p.email,
            phone: p.phone || undefined,
            role: 'Staff',
            status: p.status === 'blocked' ? 'Inactive' : 'Active',
            assigned: 0,
            lastActive: 'Active recently',
            initials: makeInitials(p.full_name || p.email),
          }));
          setMembers(mapped);
        } else if (user) {
          const ownerName = profile?.full_name || user.email?.split('@')[0] || 'Administrator';
          const ownerEmail = user.email || 'admin@crmemy.com';
          setMembers([
            {
              id: user.id,
              name: ownerName,
              email: ownerEmail,
              role: 'Super Admin',
              status: 'Active',
              assigned: 0,
              lastActive: 'Just now',
              initials: makeInitials(ownerName),
            },
          ]);
        }
        return;
      }

      const data = (await res.json()) as {
        users?: Array<{
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          status: string;
          primaryRole: string;
          roles: string[];
        }>;
      };

      if (data.users && Array.isArray(data.users)) {
        const mapped: TeamMember[] = data.users.map((u) => {
          const uiRole: MemberRole =
            u.primaryRole === 'super_admin'
              ? 'Super Admin'
              : u.primaryRole === 'admin'
              ? 'Reviewer'
              : u.primaryRole === 'staff'
              ? 'Tax Preparer'
              : 'Staff';

          const uiStatus: MemberStatus =
            u.status === 'active'
              ? 'Active'
              : u.status === 'blocked' || u.status === 'suspended'
              ? 'Inactive'
              : 'Invited';

          return {
            id: u.id,
            name: u.full_name || u.email.split('@')[0],
            email: u.email,
            phone: u.phone || undefined,
            role: uiRole,
            status: uiStatus,
            assigned: 0,
            lastActive: 'Active recently',
            initials: makeInitials(u.full_name || u.email),
          };
        });
        setMembers(mapped);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch team members';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!supabase || !isSupabaseConfigured) {
        if (active) setMembers(seedMembers);
        return;
      }
      try {
        const res = await fetch('/api/admin/users');
        if (!res.ok) {
          const { data: dbProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, status, created_at');

          if (active && dbProfiles && dbProfiles.length > 0) {
            const mapped: TeamMember[] = dbProfiles.map((p) => ({
              id: p.id,
              name: p.full_name || p.email.split('@')[0],
              email: p.email,
              phone: p.phone || undefined,
              role: 'Staff',
              status: p.status === 'blocked' ? 'Inactive' : 'Active',
              assigned: 0,
              lastActive: 'Active recently',
              initials: makeInitials(p.full_name || p.email),
            }));
            setMembers(mapped);
          }
          return;
        }

        const data = (await res.json()) as {
          users?: Array<{
            id: string;
            email: string;
            full_name: string | null;
            phone: string | null;
            status: string;
            primaryRole: string;
            roles: string[];
          }>;
        };

        if (active && data.users && Array.isArray(data.users)) {
          const mapped: TeamMember[] = data.users.map((u) => {
            const uiRole: MemberRole =
              u.primaryRole === 'super_admin'
                ? 'Super Admin'
                : u.primaryRole === 'admin'
                ? 'Reviewer'
                : u.primaryRole === 'staff'
                ? 'Tax Preparer'
                : 'Staff';

            const uiStatus: MemberStatus =
              u.status === 'active'
                ? 'Active'
                : u.status === 'blocked' || u.status === 'suspended'
                ? 'Inactive'
                : 'Invited';

            return {
              id: u.id,
              name: u.full_name || u.email.split('@')[0],
              email: u.email,
              phone: u.phone || undefined,
              role: uiRole,
              status: uiStatus,
              assigned: 0,
              lastActive: 'Active recently',
              initials: makeInitials(u.full_name || u.email),
            };
          });
          setMembers(mapped);
        }
      } catch (err: unknown) {
        if (active) {
          const msg = err instanceof Error ? err.message : 'Failed to fetch team members';
          setError(msg);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const addMember = useCallback(
    async (data: Omit<TeamMember, 'id' | 'initials' | 'assigned' | 'lastActive'>) => {
      const newMember: TeamMember = {
        ...data,
        id: crypto.randomUUID(),
        initials: makeInitials(data.name),
        assigned: 0,
        lastActive: data.status === 'Active' ? 'Just now' : 'Invitation pending',
      };

      if (supabase && isSupabaseConfigured) {
        try {
          const dbRole =
            data.role === 'Super Admin'
              ? 'super_admin'
              : data.role === 'Reviewer'
              ? 'admin'
              : data.role === 'Tax Preparer'
              ? 'staff'
              : 'user';

          const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'invite_user',
              payload: {
                email: data.email,
                fullName: data.name,
                phone: data.phone || null,
                role: dbRole,
                plan: 'monthly',
              },
            }),
          });
          const resData = (await res.json()) as { user?: { id: string } };
          if (resData.user?.id) {
            newMember.id = resData.user.id;
          }
        } catch (e) {
          console.error('Error inviting user on server:', e);
        }
      }

      setMembers((prev) => {
        const updated = [...prev, newMember];
        if (typeof window !== 'undefined' && user) {
          try {
            localStorage.setItem(`crm_emy_team_${user.id}`, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });
      return newMember;
    },
    [user]
  );

  const updateMember = useCallback(
    async (id: string, data: Partial<Omit<TeamMember, 'id' | 'initials'>>) => {
      if (supabase && isSupabaseConfigured) {
        try {
          if (data.status) {
            await fetch('/api/admin/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'update_status',
                targetUserId: id,
                payload: { status: data.status === 'Inactive' ? 'blocked' : 'active' },
              }),
            });
          }

          if (data.role) {
            const dbRole =
              data.role === 'Super Admin'
                ? 'super_admin'
                : data.role === 'Reviewer'
                ? 'admin'
                : data.role === 'Tax Preparer'
                ? 'staff'
                : 'user';

            await fetch('/api/admin/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'change_role',
                targetUserId: id,
                payload: { newRole: dbRole },
              }),
            });
          }
        } catch (e) {
          console.error('Error updating member on server:', e);
        }
      }

      setMembers((prev) => {
        const updated = prev.map((m) =>
          m.id === id
            ? { ...m, ...data, initials: data.name ? makeInitials(data.name) : m.initials }
            : m
        );
        if (typeof window !== 'undefined' && user) {
          try {
            localStorage.setItem(`crm_emy_team_${user.id}`, JSON.stringify(updated));
          } catch {}
        }
        return updated;
      });
    },
    [user]
  );

  const deleteMember = useCallback(async (id: string) => {
    if (supabase && isSupabaseConfigured) {
      try {
        await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete_user',
            targetUserId: id,
          }),
        });
      } catch (e) {
        console.error('Error deleting member on server:', e);
      }
    }

    setMembers((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      if (typeof window !== 'undefined' && user) {
        try {
          localStorage.setItem(`crm_emy_team_${user.id}`, JSON.stringify(updated));
        } catch {}
      }
      return updated;
    });
  }, [user]);

  return { members, isLoading, error, addMember, updateMember, deleteMember, refreshMembers: fetchMembers };
}

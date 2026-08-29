'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { Database, UserRole, SubscriptionPlan, SubscriptionStatus } from '@/lib/supabase/types';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'blocked' | 'suspended';
  created_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: string;
  expire_date: string | null;
  lifetime: boolean;
  auto_renew: boolean;
  payment_provider: string;
  amount: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  roles: UserRole[];
  subscription: UserSubscription | null;
  permissions: string[];
  isLoading: boolean;
  isEmailVerified: boolean;
  isSubscriptionActive: boolean;
  isLifetime: boolean;
  isBlocked: boolean;
  hasPermission: (permission: string) => boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default mock admin profile if Supabase is not configured or in preview
const defaultPreviewProfile: UserProfile = {
  id: 'preview-admin',
  email: 'admin@crmemy.com',
  full_name: 'Amy Tran',
  phone: '(714) 555-0188',
  avatar_url: null,
  status: 'active',
  created_at: new Date().toISOString(),
};

const defaultPreviewSubscription: UserSubscription = {
  id: 'sub-preview',
  user_id: 'preview-admin',
  plan: 'lifetime',
  status: 'active',
  start_date: new Date().toISOString(),
  expire_date: null,
  lifetime: true,
  auto_renew: false,
  payment_provider: 'manual',
  amount: 0,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('super_admin');
  const [roles, setRoles] = useState<UserRole[]>(['super_admin']);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (currentUser: User) => {
    if (!supabase) return;

    try {
      // 1. Fetch Profile
      const { data: profileData } = await (supabase.from('profiles') as any)
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
      } else {
        // Fallback profile
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || 'User',
          phone: currentUser.phone || null,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
          status: 'active',
          created_at: currentUser.created_at,
        });
      }

      // 2. Fetch User Roles
      const { data: userRolesData } = await (supabase.from('user_roles') as any)
      // Check for Super Admin Email
      const isKnownSuperAdmin =
        currentUser.email?.toLowerCase() === 'www.junky3@yahoo.com' ||
        currentUser.email?.toLowerCase() === 'admin@crmemy.com';

      if (userRolesData && userRolesData.length > 0) {
        const assignedRoles = (userRolesData as any[]).map((r) => r.role_id as UserRole);
        if (isKnownSuperAdmin && !assignedRoles.includes('super_admin')) {
          assignedRoles.push('super_admin');
        }
        setRoles(assignedRoles);
        // Primary role priority
        if (assignedRoles.includes('super_admin')) setRole('super_admin');
        else if (assignedRoles.includes('admin')) setRole('admin');
        else if (assignedRoles.includes('staff')) setRole('staff');
        else setRole('user');
      } else {
        if (isKnownSuperAdmin) {
          setRoles(['super_admin']);
          setRole('super_admin');
        } else {
          setRoles(['user']);
          setRole('user');
        }
      }

      // 3. Fetch Subscription
      const { data: subData } = await (supabase.from('subscriptions') as any)
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subData) {
        setSubscription(subData as UserSubscription);
      } else if (isKnownSuperAdmin) {
        setSubscription({
          id: 'sub-super-admin',
          user_id: currentUser.id,
          plan: 'lifetime',
          status: 'active',
          start_date: new Date().toISOString(),
          expire_date: null,
          lifetime: true,
          auto_renew: false,
          payment_provider: 'manual',
          amount: 0,
        });
      }

      // 4. Fetch Role Permissions
      const { data: permData } = await (supabase.from('role_permissions') as any)
        .select('permission_id')
        .in('role_id', (userRolesData as any[])?.map((r) => r.role_id) || ['user']);

      if (permData) {
        setPermissions((permData as any[]).map((p) => p.permission_id));
      }
    } catch (err) {
      console.error('Error fetching auth user profile:', err);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setProfile(defaultPreviewProfile);
      setSubscription(defaultPreviewSubscription);
      setRole('super_admin');
      setRoles(['super_admin']);
      setIsLoading(false);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setRoles(['user']);
        setRole('user');
      }
    } catch (err) {
      console.error('Error getting auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    refreshSession();

    if (!supabase) return;

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user);
      } else {
        setUser(null);
        setProfile(null);
        setSubscription(null);
        setRoles(['user']);
        setRole('user');
      }
      setIsLoading(false);
    });

    return () => {
      authSub.unsubscribe();
    };
  }, [refreshSession, fetchUserData]);

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setRoles(['user']);
    setRole('user');
    window.location.href = '/login';
  };

  const isEmailVerified = Boolean(
    !isSupabaseConfigured ||
      !user ||
      user.email_confirmed_at ||
      user.app_metadata?.provider !== 'email' ||
      role === 'super_admin'
  );

  const isBlocked = profile?.status === 'blocked' || profile?.status === 'suspended';

  const isLifetime = Boolean(subscription?.lifetime);

  const isSubscriptionActive = Boolean(
    !isSupabaseConfigured || // In offline preview mode, allow access
      role === 'super_admin' || // Super Admin always active
      isLifetime ||
      (subscription &&
        (subscription.status === 'active' || subscription.status === 'trial') &&
        (!subscription.expire_date || new Date(subscription.expire_date) > new Date()))
  );

  const hasPermission = (permission: string) => {
    if (role === 'super_admin') return true;
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        roles,
        subscription,
        permissions,
        isLoading,
        isEmailVerified,
        isSubscriptionActive,
        isLifetime,
        isBlocked,
        hasPermission,
        refreshSession,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

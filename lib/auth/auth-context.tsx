'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { UserRole, SubscriptionPlan, SubscriptionStatus, UserStatus } from '@/lib/supabase/types';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: UserStatus;
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

// Default limited preview profile only for local development when Supabase is unconfigured
const defaultPreviewProfile: UserProfile = {
  id: 'preview-user',
  email: 'preview@crmemy.com',
  full_name: 'Preview User',
  phone: '(714) 555-0188',
  avatar_url: null,
  status: 'active',
  created_at: new Date().toISOString(),
};

const defaultPreviewSubscription: UserSubscription = {
  id: 'sub-preview',
  user_id: 'preview-user',
  plan: 'trial',
  status: 'trial',
  start_date: new Date().toISOString(),
  expire_date: null,
  lifetime: false,
  auto_renew: false,
  payment_provider: 'manual',
  amount: 0,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [roles, setRoles] = useState<UserRole[]>(['user']);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (currentUser: User) => {
    if (!supabase) return;

    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData as UserProfile);
      } else {
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

      // 2. Fetch User Roles strictly from Database
      const { data: userRolesData } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', currentUser.id);

      if (userRolesData && userRolesData.length > 0) {
        const assignedRoles = userRolesData.map((r: { role_id: UserRole }) => r.role_id);
        setRoles(assignedRoles);

        if (assignedRoles.includes('super_admin')) setRole('super_admin');
        else if (assignedRoles.includes('admin')) setRole('admin');
        else if (assignedRoles.includes('staff')) setRole('staff');
        else setRole('user');
      } else {
        setRoles(['user']);
        setRole('user');
      }

      // 3. Fetch Subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (subData) {
        setSubscription(subData as UserSubscription);
      } else {
        setSubscription(null);
      }

      // 4. Fetch Role Permissions
      const assignedRoleIds = userRolesData && userRolesData.length > 0
        ? userRolesData.map((r: { role_id: UserRole }) => r.role_id)
        : ['user'];

      const { data: permData } = await supabase
        .from('role_permissions')
        .select('permission_id')
        .in('role_id', assignedRoleIds as UserRole[]);

      if (permData) {
        setPermissions(permData.map((p: { permission_id: string }) => p.permission_id));
      }
    } catch (err) {
      console.error('Error fetching auth user profile from database:', err);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    if (!supabase || !isSupabaseConfigured) {
      setProfile(defaultPreviewProfile);
      setSubscription(defaultPreviewSubscription);
      setRole('user');
      setRoles(['user']);
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
      console.error('Error retrieving auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      if (!supabase || !isSupabaseConfigured) {
        if (isMounted) {
          setProfile(defaultPreviewProfile);
          setSubscription(defaultPreviewSubscription);
          setRole('user');
          setRoles(['user']);
          setIsLoading(false);
        }
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (isMounted) {
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
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    if (!supabase) return;

    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
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
      isMounted = false;
      authSub.unsubscribe();
    };
  }, [fetchUserData]);

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

  const isLifetime = subscription?.lifetime === true;
  const isSubscriptionActive = Boolean(
    !isSupabaseConfigured ||
      role === 'super_admin' ||
      role === 'admin' ||
      isLifetime ||
      (subscription &&
        (subscription.status === 'active' || subscription.status === 'trial') &&
        (!subscription.expire_date || new Date(subscription.expire_date) > new Date()))
  );

  const isBlocked = profile?.status === 'blocked' || profile?.status === 'suspended';

  const hasPermission = (permission: string) => {
    if (role === 'super_admin') return true;
    if (permissions.includes(permission) || permissions.includes('*')) return true;
    return false;
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

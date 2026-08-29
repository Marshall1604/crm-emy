import { NextResponse, type NextRequest } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if admin
    const { data: userRoles } = await (supabase.from('user_roles') as any)
      .select('role_id')
      .eq('user_id', user.id);

    const roles = (userRoles as any[])?.map((r) => r.role_id) || [];
    if (!roles.includes('super_admin') && !roles.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body: any = await request.json();
    const { targetUserId, action, plan, daysToAdd, paymentProvider, amount } = body;
    const adminClient = createAdminClient();

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Browser';

    // Fetch existing subscription
    const { data: existingSub } = await (adminClient.from('subscriptions') as any)
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (action === 'extend') {
      let baseDate = new Date();
      if (existingSub?.expire_date && new Date(existingSub.expire_date) > baseDate) {
        baseDate = new Date(existingSub.expire_date);
      }

      const newExpireDate = new Date(baseDate.getTime() + (daysToAdd || 30) * 24 * 60 * 60 * 1000);

      const updatedSub = {
        user_id: targetUserId,
        plan: plan || existingSub?.plan || 'monthly',
        status: 'active',
        expire_date: newExpireDate.toISOString(),
        lifetime: false,
        payment_provider: paymentProvider || 'manual',
        amount: Number(amount) || 0,
        updated_at: new Date().toISOString(),
      };

      if (existingSub?.id) {
        await (adminClient.from('subscriptions') as any).update(updatedSub).eq('id', existingSub.id);
      } else {
        await (adminClient.from('subscriptions') as any).insert(updatedSub);
      }

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: `subscription_extended_${daysToAdd}days`,
        entity_type: 'subscription',
        entity_id: existingSub?.id || null,
        old_value: existingSub,
        new_value: updatedSub,
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, newExpireDate });
    }

    if (action === 'convert_lifetime') {
      const updatedSub = {
        user_id: targetUserId,
        plan: 'lifetime',
        status: 'active',
        start_date: new Date().toISOString(),
        expire_date: null,
        lifetime: true,
        auto_renew: false,
        payment_provider: paymentProvider || 'manual',
        amount: Number(amount) || 999,
        updated_at: new Date().toISOString(),
      };

      if (existingSub?.id) {
        await (adminClient.from('subscriptions') as any).update(updatedSub).eq('id', existingSub.id);
      } else {
        await (adminClient.from('subscriptions') as any).insert(updatedSub);
      }

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: 'subscription_converted_to_lifetime',
        entity_type: 'subscription',
        entity_id: existingSub?.id || null,
        old_value: existingSub,
        new_value: updatedSub,
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, lifetime: true });
    }

    if (action === 'cancel') {
      await (adminClient.from('subscriptions') as any)
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('user_id', targetUserId);

      // Audit log
      await (adminClient.from('audit_logs') as any).insert({
        actor_user_id: user.id,
        target_user_id: targetUserId,
        action: 'subscription_cancelled',
        entity_type: 'subscription',
        entity_id: existingSub?.id || null,
        old_value: existingSub,
        new_value: { status: 'cancelled' },
        ip_address: ip,
        user_agent: userAgent,
      });

      return NextResponse.json({ success: true, status: 'cancelled' });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin, recordAuditLog } from '@/lib/auth/require-admin';
import { z } from 'zod';
import type { SubscriptionPlan, PaymentProvider } from '@/lib/supabase/types';

const SubscriptionActionSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('extend'),
    targetUserId: z.string().uuid(),
    plan: z.enum(['trial', 'monthly', 'yearly', 'lifetime']).optional(),
    daysToAdd: z.number().int().positive().default(30),
    paymentProvider: z.enum(['manual', 'stripe', 'zelle', 'cash', 'bank_transfer', 'usdt', 'other']).default('manual'),
    amount: z.number().nonnegative().default(0),
  }),
  z.object({
    action: z.literal('convert_lifetime'),
    targetUserId: z.string().uuid(),
    paymentProvider: z.enum(['manual', 'stripe', 'zelle', 'cash', 'bank_transfer', 'usdt', 'other']).default('manual'),
    amount: z.number().nonnegative().default(999),
  }),
  z.object({
    action: z.literal('cancel'),
    targetUserId: z.string().uuid(),
  }),
  z.object({
    action: z.literal('reset_trial'),
    targetUserId: z.string().uuid(),
  }),
]);

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.success) return auth.response;

  const { user: actorUser, adminClient } = auth.data;

  try {
    const rawBody = (await request.json()) as unknown;
    const parseResult = SubscriptionActionSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid subscription modification payload.', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const body = parseResult.data;
    const { targetUserId, action } = body;

    // Fetch existing subscription
    const { data: existingSub } = await adminClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const now = new Date();

    if (action === 'extend') {
      const { plan, daysToAdd, paymentProvider, amount } = body;
      let baseDate = new Date();
      if (existingSub?.expire_date && new Date(existingSub.expire_date) > baseDate) {
        baseDate = new Date(existingSub.expire_date);
      }

      const newExpireDate = new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

      const updatedSub = {
        user_id: targetUserId,
        plan: (plan || existingSub?.plan || 'monthly') as SubscriptionPlan,
        status: 'active' as const,
        expire_date: newExpireDate.toISOString(),
        lifetime: false,
        payment_provider: paymentProvider as PaymentProvider,
        amount,
        updated_at: now.toISOString(),
      };

      if (existingSub?.id) {
        await adminClient.from('subscriptions').update(updatedSub).eq('id', existingSub.id);
      } else {
        await adminClient.from('subscriptions').insert(updatedSub);
      }

      await recordAuditLog(actorUser.id, `subscription_extended_${daysToAdd}d`, 'subscription', targetUserId, {
        newExpireDate: newExpireDate.toISOString(),
      });

      return NextResponse.json({ success: true, newExpireDate });
    }

    if (action === 'convert_lifetime') {
      const { paymentProvider, amount } = body;
      const updatedSub = {
        user_id: targetUserId,
        plan: 'lifetime' as SubscriptionPlan,
        status: 'active' as const,
        start_date: now.toISOString(),
        expire_date: null,
        lifetime: true,
        auto_renew: false,
        payment_provider: paymentProvider as PaymentProvider,
        amount,
        updated_at: now.toISOString(),
      };

      if (existingSub?.id) {
        await adminClient.from('subscriptions').update(updatedSub).eq('id', existingSub.id);
      } else {
        await adminClient.from('subscriptions').insert(updatedSub);
      }

      await recordAuditLog(actorUser.id, 'subscription_converted_lifetime', 'subscription', targetUserId);

      return NextResponse.json({ success: true, lifetime: true });
    }

    if (action === 'cancel') {
      if (existingSub?.id) {
        await adminClient
          .from('subscriptions')
          .update({ status: 'cancelled', updated_at: now.toISOString() })
          .eq('id', existingSub.id);
      }

      await recordAuditLog(actorUser.id, 'subscription_cancelled', 'subscription', targetUserId);

      return NextResponse.json({ success: true, status: 'cancelled' });
    }

    if (action === 'reset_trial') {
      const trialExpire = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const updatedSub = {
        user_id: targetUserId,
        plan: 'trial' as SubscriptionPlan,
        status: 'trial' as const,
        start_date: now.toISOString(),
        expire_date: trialExpire,
        lifetime: false,
        payment_provider: 'manual' as PaymentProvider,
        amount: 0,
        updated_at: now.toISOString(),
      };

      if (existingSub?.id) {
        await adminClient.from('subscriptions').update(updatedSub).eq('id', existingSub.id);
      } else {
        await adminClient.from('subscriptions').insert(updatedSub);
      }

      await recordAuditLog(actorUser.id, 'subscription_reset_trial', 'subscription', targetUserId, {
        trialExpire,
      });

      return NextResponse.json({ success: true, status: 'trial', expire_date: trialExpire });
    }

    return NextResponse.json({ error: 'Unsupported subscription action.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Internal server exception while updating subscription.' }, { status: 500 });
  }
}

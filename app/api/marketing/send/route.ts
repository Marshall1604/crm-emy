import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

const RecipientSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  personalizedSubject: z.string().max(300).optional(),
  personalizedBody: z.string().max(20000).optional(),
});

const SendMarketingSchema = z.object({
  recipients: z.array(RecipientSchema).min(1).max(100),
  subject: z.string().min(1).max(300),
  bodyText: z.string().min(1).max(20000),
  isTest: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user session
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required to send marketing broadcasts.' },
        { status: 401 }
      );
    }

    // 2. Validate request payload using Zod
    const rawBody = (await request.json()) as unknown;
    const parseResult = SendMarketingSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid marketing campaign payload.', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { recipients, subject, bodyText, isTest } = parseResult.data;

    // 3. Read server environment variables strictly
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const fromName = process.env.RESEND_FROM_NAME || 'CRM EMY Tax Practice';
    const isDemoMode = process.env.MARKETING_DEMO_MODE === 'true';

    // 4. If real Resend API Key is available, dispatch emails securely
    if (resendKey && !resendKey.includes('placeholder')) {
      const results: Array<{ email: string; success: boolean }> = [];

      for (const recipient of recipients) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${fromName} <${fromEmail}>`,
              to: [recipient.email],
              subject: recipient.personalizedSubject || subject,
              text: recipient.personalizedBody || bodyText,
            }),
          });

          results.push({ email: recipient.email, success: res.ok });
        } catch {
          results.push({ email: recipient.email, success: false });
        }
      }

      // Record audit log
      try {
        const adminClient = createAdminClient();
        await adminClient.from('audit_logs').insert({
          actor_user_id: user.id,
          action: isTest ? 'marketing_test_sent' : 'marketing_broadcast_sent',
          entity_type: 'campaign',
          new_value: {
            recipientCount: recipients.length,
            successCount: results.filter((r) => r.success).length,
            isTest,
          },
          created_at: new Date().toISOString(),
        });
      } catch {}

      return NextResponse.json({
        success: true,
        isRealDelivery: true,
        sentCount: results.filter((r) => r.success).length,
        total: recipients.length,
        results,
      });
    }

    // 5. If key is not configured and server explicitly allows demo mode
    if (isDemoMode) {
      return NextResponse.json({
        success: true,
        isRealDelivery: false,
        isDemoSimulation: true,
        sentCount: recipients.length,
        total: recipients.length,
        message: 'Dispatched in sandbox simulation mode (MARKETING_DEMO_MODE=true).',
      });
    }

    // 6. Fail-closed on production when RESEND_API_KEY is not configured
    return NextResponse.json(
      {
        error: 'Email service configuration error: RESEND_API_KEY is not configured on this server.',
      },
      { status: 503 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server exception while sending email.' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

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
  provider: z.enum(['gmail', 'resend']).optional().default('resend'),
  // Gmail SMTP credentials
  gmailEmail: z.string().optional(),
  gmailAppPassword: z.string().optional(),
  // Resend credentials
  apiKey: z.string().optional(),
  fromEmail: z.string().optional(),
  fromName: z.string().optional(),
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

    const {
      recipients,
      subject,
      bodyText,
      isTest,
      provider,
      gmailEmail,
      gmailAppPassword,
      apiKey: clientApiKey,
      fromEmail: clientFromEmail,
      fromName: clientFromName,
    } = parseResult.data;

    const effectiveFromName = (clientFromName && clientFromName.trim().length > 0)
      ? clientFromName.trim()
      : (process.env.RESEND_FROM_NAME || 'CRM EMY Tax Practice');

    // ==========================================
    // OPTION A: GMAIL / GOOGLE SMTP (NO DOMAIN REQUIRED)
    // ==========================================
    const isGmailMode = provider === 'gmail' || (gmailEmail && gmailAppPassword);
    if (isGmailMode) {
      const cleanUser = gmailEmail?.trim() || process.env.GMAIL_USER;
      const cleanPass = gmailAppPassword?.replace(/\s+/g, '') || process.env.GMAIL_APP_PASSWORD;

      if (!cleanUser || !cleanPass) {
        return NextResponse.json(
          {
            error: 'Vui lòng nhập đầy đủ Địa chỉ Gmail và Mật khẩu ứng dụng (Google App Password 16 ký tự).',
          },
          { status: 400 }
        );
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
      });

      const results: Array<{ email: string; success: boolean; error?: string }> = [];

      for (const recipient of recipients) {
        try {
          await transporter.sendMail({
            from: `"${effectiveFromName}" <${cleanUser}>`,
            to: recipient.email,
            subject: recipient.personalizedSubject || subject,
            text: recipient.personalizedBody || bodyText,
          });
          results.push({ email: recipient.email, success: true });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : 'Gmail SMTP Error';
          results.push({ email: recipient.email, success: false, error: errMsg });
        }
      }

      const successCount = results.filter((r) => r.success).length;

      if (isTest && successCount === 0 && results.length > 0) {
        const firstError = results[0]?.error || 'Failed to dispatch email via Gmail.';
        return NextResponse.json(
          {
            error: firstError.includes('Invalid login') || firstError.includes('BadCredentials')
              ? 'Mật khẩu ứng dụng Gmail (App Password) không chính xác. Vui lòng kiểm tra lại 16 ký tự tạo từ Google.'
              : firstError,
            details: results,
          },
          { status: 400 }
        );
      }

      // Record audit log
      try {
        const adminClient = createAdminClient();
        await adminClient.from('audit_logs').insert({
          actor_user_id: user.id,
          action: isTest ? 'marketing_test_sent_gmail' : 'marketing_broadcast_sent_gmail',
          entity_type: 'campaign',
          new_value: {
            recipientCount: recipients.length,
            successCount,
            isTest,
            provider: 'gmail',
            sender: `${effectiveFromName} <${cleanUser}>`,
          },
          created_at: new Date().toISOString(),
        });
      } catch {}

      return NextResponse.json({
        success: successCount > 0,
        isRealDelivery: true,
        sentCount: successCount,
        total: recipients.length,
        results,
      });
    }

    // ==========================================
    // OPTION B: RESEND API (CUSTOM DOMAIN)
    // ==========================================
    const effectiveKey = (clientApiKey && clientApiKey.trim().length > 5)
      ? clientApiKey.trim()
      : process.env.RESEND_API_KEY;

    const effectiveFromEmail = (clientFromEmail && clientFromEmail.trim().length > 0)
      ? clientFromEmail.trim()
      : (process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev');

    const isDemoMode = process.env.MARKETING_DEMO_MODE === 'true';

    // If a valid Resend API Key is provided, dispatch emails securely
    if (effectiveKey && !effectiveKey.includes('placeholder')) {
      const results: Array<{ email: string; success: boolean; error?: string }> = [];

      for (const recipient of recipients) {
        try {
          const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${effectiveKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: `${effectiveFromName} <${effectiveFromEmail}>`,
              to: [recipient.email],
              subject: recipient.personalizedSubject || subject,
              text: recipient.personalizedBody || bodyText,
            }),
          });

          const resData = (await res.json().catch(() => null)) as { message?: string; name?: string } | null;

          if (res.ok) {
            results.push({ email: recipient.email, success: true });
          } else {
            const errorMsg = resData?.message || resData?.name || `Resend Error (HTTP ${res.status})`;
            results.push({ email: recipient.email, success: false, error: errorMsg });
          }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : 'Network error';
          results.push({ email: recipient.email, success: false, error: msg });
        }
      }

      const successCount = results.filter((r) => r.success).length;

      if (isTest && successCount === 0 && results.length > 0) {
        const firstError = results[0]?.error || 'Failed to dispatch test email.';
        return NextResponse.json(
          {
            error: firstError,
            details: results,
          },
          { status: 400 }
        );
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
            successCount,
            isTest,
            provider: 'resend',
            sender: `${effectiveFromName} <${effectiveFromEmail}>`,
          },
          created_at: new Date().toISOString(),
        });
      } catch {}

      return NextResponse.json({
        success: successCount > 0,
        isRealDelivery: true,
        sentCount: successCount,
        total: recipients.length,
        results,
      });
    }

    // Sandbox / Simulation fallback
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

    return NextResponse.json(
      {
        error: 'Vui lòng chọn và cấu hình phương thức gửi: Gmail (App Password) hoặc Resend API.',
      },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Internal server exception while sending email.' },
      { status: 500 }
    );
  }
}

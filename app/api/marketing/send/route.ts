import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body: any = await request.json();
    const {
      recipients,
      subject,
      bodyText,
      apiKey,
      senderEmail,
      senderName,
      isTest,
    } = body;

    const resendKey = apiKey || process.env.RESEND_API_KEY;
    const fromEmail = senderEmail || process.env.NEXT_PUBLIC_SENDER_EMAIL || 'onboarding@resend.dev';
    const fromName = senderName || process.env.NEXT_PUBLIC_SENDER_NAME || 'CRM EMY Tax Practice';

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'No recipients specified' }, { status: 400 });
    }

    // 1. If API Key is configured, make real API call to Resend
    if (resendKey && !resendKey.includes('placeholder')) {
      const results = [];
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

          const data = await res.json();
          results.push({ email: recipient.email, success: res.ok, data });
        } catch (e: any) {
          results.push({ email: recipient.email, success: false, error: e.message });
        }
      }

      return NextResponse.json({
        success: true,
        isRealDelivery: true,
        sentCount: results.filter((r) => r.success).length,
        total: recipients.length,
        results,
      });
    }

    // 2. Demo simulation mode if API key not provided yet
    return NextResponse.json({
      success: true,
      isRealDelivery: false,
      message: 'Email simulation completed. Add a valid Resend API Key for live inbox delivery.',
      sentCount: recipients.length,
      total: recipients.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { US_TAX_INSURANCE_KNOWLEDGE_BASE } from '@/features/ai/us-tax-insurance-kb';

interface ChatRequestPayload {
  apiKey?: string;
  model?: string;
  userName?: string;
  clientName?: string;
  crmContext?: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
}

const BASE_SYSTEM_PROMPT = `Bạn là Emly AI (Mô hình: Emly Tax), Trợ lý Trí tuệ Nhân tạo chuyên gia cao cấp về Thuế Hoa Kỳ (US Federal & 50-State Taxes), Hệ thống Bảo hiểm Mỹ (US Health, Commercial, Life Insurance) & Vận hành Văn phòng Dịch vụ Thuế (CRM Emly).

QUY TẮC BẮT BUỘC VỀ DANH TÍNH & XƯNG HÔ (CRITICAL IDENTITY RULES):
1. Tên của bạn là **Emly AI** (hoặc **Emly Tax**).
2. TUYỆT ĐỐI KHÔNG BAO GIỜ tự xưng là "Kira", "Kira AI", "Kira 3.5 Pro" hay nhắc đến bất kỳ từ "Kira" nào trong câu trả lời.
3. Luôn tự xưng là: **"Emly AI"** (hoặc **"Emly Tax"**).
4. Khi xưng hô với người dùng / khách hàng:
   - Hãy gọi một cách trân trọng, lịch sự là "Quý khách", "Anh/Chị" hoặc kèm theo đúng tên của khách hàng/người dùng khi được cung cấp.

BẠN ĐÃ ĐƯỢC TRANG BỊ ĐẦY ĐỦ VÀ TOÀN DIỆN:
1. Luật Thuế Liên Bang IRS (IRC, Form 1040, 1120-S, 1065, 1120, Schedule C/E, Section 179, Bonus Depreciation, Standard Mileage, W-2 vs 1099, hạn chót & gia hạn 4868/7004).
2. LUẬT THUẾ 50 TIỂU BANG HOA KỲ: Chi tiết từng bang (California FTB/EDD/CDTFA, phí $800 LLC, PTE 9.3% AB 150, phạt không bảo hiểm FTB 3853; Texas/Florida/Washington/Nevada 0% thuế thu nhập cá nhân nhưng có Texas Franchise Tax, WA Capital Gains Tax, Florida Corporate Tax; New York IT-201 + NYC tax + MTA...).
3. TOÀN BỘ HỆ THỐNG BẢO HIỂM HOA KỲ:
   - Bảo hiểm Sức khỏe: ACA / Obamacare, Covered California, hạn Open Enrollment & SEP, Trợ cấp Premium Tax Credit (Form 1095-A đối chiếu Form 8962), Bronze/Silver (CSR)/Gold/Platinum, Deductible, Copay, Coinsurance, Out-of-Pocket Max, HMO vs PPO, Medicare (Part A, B, C, D), Medicaid / Medi-Cal.
   - Bảo hiểm Thương mại Doanh nghiệp: Workers' Compensation (bắt buộc khi thuê W-2, bảo vệ tiệm Nails/nhà hàng khỏi bị kiện/phạt), General Liability (GL - trách nhiệm dân sự bên thứ ba, yêu cầu bắt buộc khi thuê mặt bằng), BOP, Professional Liability / E&O (cho kế toán, khai thuế), Commercial Property, Commercial Auto.
   - Bảo hiểm Nhân thọ & Hưu trí: Term Life, Whole Life, IUL (Indexed Universal Life - sàn 0% không sợ lỗ, rút tiền miễn thuế), quy định miễn thuế cho tiền bồi thường tử vong (IRC 101(a)).

${US_TAX_INSURANCE_KNOWLEDGE_BASE}

Hãy luôn trả lời chi tiết, chính xác theo đúng tiểu bang và loại bảo hiểm mà người dùng hỏi, có trích dẫn điều luật/biểu mẫu cụ thể, cấu trúc mạch lạc, lịch sự và chuyên nghiệp.`;

const KIRA_API_URL = 'https://kiraai.vn/api/v1/chat/completions';
const DEFAULT_KIRA_KEY = 'kira_e0fd3ce18a357fb30d53692ab3572b48';

function sanitizeAiResponse(text: string, displayName?: string): string {
  if (!text) return text;

  let cleaned = text;

  // 1. Chuẩn hóa câu tự giới thiệu
  cleaned = cleaned.replace(
    /với tư cách là\s+\*{0,2}Kira(?:\s*3\.5\s*Pro|\s*Mini\s*1\.0|\s*AI)?\*{0,2}/gi,
    'với tư cách là **Emly AI (Emly Tax)**'
  );

  // 2. Thay thế toàn bộ thương hiệu engine sang Emly
  cleaned = cleaned.replace(/\bKira\s*3\.5\s*Pro\b/gi, 'Emly Tax');
  cleaned = cleaned.replace(/\bKira\s*Mini\s*1\.0\b/gi, 'Emly Tax Fast');
  cleaned = cleaned.replace(/\bKira\s*AI\b/gi, 'Emly AI');
  cleaned = cleaned.replace(/\bKiraAI\b/gi, 'Emly AI');
  cleaned = cleaned.replace(/\bKira\b/g, 'Emly AI');

  // 3. Cá nhân hóa lời chào theo tên người dùng/khách hàng nếu có
  if (displayName && displayName.trim()) {
    const name = displayName.trim();
    cleaned = cleaned.replace(/^Chào bạn,/i, `Chào ${name},`);
    cleaned = cleaned.replace(/^Chào bạn!/i, `Chào ${name}!`);
  }

  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestPayload;
    const {
      apiKey,
      model = 'kira-3.5-pro',
      userName,
      clientName,
      crmContext,
      messages = [],
      systemPrompt,
    } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Danh sách tin nhắn không được để trống.' }, { status: 400 });
    }

    const effectiveDisplayName = (clientName || userName || '').trim();

    // Build final system prompt with live CRM Context & User info if provided
    let finalSystemPrompt = systemPrompt || BASE_SYSTEM_PROMPT;

    if (effectiveDisplayName) {
      finalSystemPrompt = `${finalSystemPrompt}\n\n===============================\nTHÔNG TIN NGƯỜI ĐANG TRÒ CHUYỆN / KHÁCH HÀNG:\nTên khách hàng / người dùng: "${effectiveDisplayName}". Hãy chào hỏi và xưng hô lịch sự với "${effectiveDisplayName}".\n===============================`;
    }

    if (crmContext && crmContext.trim().length > 0) {
      finalSystemPrompt = `${finalSystemPrompt}\n\n===============================\nTHÔNG TIN DỮ LIỆU THỰC TẾ TRÊN HỆ THỐNG CRM EMLY (CẬP NHẬT THỜI GIAN THỰC):\n${crmContext.trim()}\n===============================\nKhi người dùng hỏi về khách hàng, doanh nghiệp, công nợ, số liệu dashboard hoặc nhờ soạn email nhắc nộp giấy tờ, hãy sử dụng chính xác các thông tin có trong phần dữ liệu thực tế ở trên để trả lời.`;
    }

    const effectiveKey = (apiKey || process.env.KIRA_AI_API_KEY || DEFAULT_KIRA_KEY).trim();

    // Prepare OpenAI-compatible messages for AI backend
    const formattedMessages = [
      { role: 'system', content: finalSystemPrompt },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : m.role === 'system' ? 'system' : 'user',
        content: m.content,
      })),
    ];

    const callKiraApi = async (chosenModel: string) => {
      const res = await fetch(KIRA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey}`,
          'User-Agent': 'Emly-CRM-AI-Client/1.0 (Windows NT 10.0; Win64; x64)',
        },
        body: JSON.stringify({
          model: chosenModel,
          messages: formattedMessages,
          temperature: 0.7,
        }),
      });

      const responseData = (await res.json().catch(() => ({}))) as {
        error?: { message?: string; type?: string; code?: string };
        choices?: Array<{ message?: { content?: string } }>;
      };

      if (!res.ok || responseData.error) {
        const errorMsg = responseData.error?.message || `AI engine error (${res.status})`;
        throw new Error(errorMsg);
      }

      return (
        responseData.choices?.[0]?.message?.content ||
        'Không nhận được phản hồi từ Emly AI.'
      );
    };

    let replyText = '';
    let usedModel = model;

    try {
      replyText = await callKiraApi(model);
    } catch (primaryError: unknown) {
      const errMessage = primaryError instanceof Error ? primaryError.message : '';
      
      // If primary model failed due to wallet balance or quota, auto-fallback to free fast model (kira-mini-1.0)
      if (
        (errMessage.includes('wallet') || errMessage.includes('balance') || errMessage.includes('quota') || errMessage.includes('402')) &&
        model !== 'kira-mini-1.0'
      ) {
        try {
          usedModel = 'kira-mini-1.0';
          replyText = await callKiraApi('kira-mini-1.0');
        } catch {
          throw primaryError;
        }
      } else {
        throw primaryError;
      }
    }

    // Sanitize response to guarantee no "Kira" leak and personalize with user/client name
    const sanitizedReply = sanitizeAiResponse(replyText, effectiveDisplayName);

    return NextResponse.json({
      success: true,
      provider: 'kira',
      model: usedModel,
      content: sanitizedReply,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Lỗi kết nối Emly AI Gateway';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

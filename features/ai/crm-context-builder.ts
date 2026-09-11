export interface CrmDataSummary {
  totalClients: number;
  totalBusinesses: number;
  totalRevenue: number;
  totalPaid: number;
  totalBalance: number;
  statusCounts: Record<string, number>;
  contextMarkdown: string;
}

export function buildClientSideCrmContext(userId?: string): CrmDataSummary {
  if (typeof window === 'undefined') {
    return {
      totalClients: 0,
      totalBusinesses: 0,
      totalRevenue: 0,
      totalPaid: 0,
      totalBalance: 0,
      statusCounts: {},
      contextMarkdown: 'Chưa có dữ liệu CRM thời gian thực.',
    };
  }

  const userPrefix = userId ? `crm_emy_${userId}` : 'crm_emy_guest';

  // 1. Load Clients
  let clients: any[] = [];
  try {
    const rawClients =
      localStorage.getItem(`${userPrefix}_clients`) ||
      localStorage.getItem(`crm_emy_clients_${userId || 'guest'}`) ||
      localStorage.getItem('crm_emy_clients') ||
      localStorage.getItem('crm_emy_clients_list');
    if (rawClients) {
      clients = JSON.parse(rawClients);
    }
  } catch (e) {
    console.warn('Could not parse clients from localStorage:', e);
  }

  // Fallback sample clients if empty
  if (!clients || clients.length === 0) {
    clients = [
      {
        name: 'Minh Nguyen',
        firstName: 'Minh',
        lastName: 'Nguyen',
        phone: '(714) 555-0184',
        email: 'minh.nguyen@example.com',
        city: 'Westminster',
        state: 'CA',
        year: '2026',
        returnType: '1040',
        status: 'Waiting Documents',
        staff: 'Amy Tran',
        fee: 650,
        amountPaid: 325,
        balance: 325,
        notes: 'Awaiting W-2 and 1099-INT from client.',
      },
      {
        name: 'Olivia Johnson',
        firstName: 'Olivia',
        lastName: 'Johnson',
        phone: '(415) 555-0128',
        email: 'olivia.j@example.com',
        city: 'San Francisco',
        state: 'CA',
        year: '2025',
        returnType: '1040',
        status: 'Review',
        staff: 'Daniel Lee',
        fee: 875,
        amountPaid: 875,
        balance: 0,
        notes: 'Reviewing mortgage interest and charitable contributions.',
      },
      {
        name: 'Kevin Tran',
        firstName: 'Kevin',
        lastName: 'Tran',
        phone: '(408) 555-0192',
        email: 'ktran@example.com',
        city: 'Sunnyvale',
        state: 'CA',
        year: '2026',
        returnType: '1040',
        status: 'In Preparation',
        staff: 'Sarah Kim',
        fee: 720,
        amountPaid: 500,
        balance: 220,
        notes: 'Both spouses have W-2. Kevin has consulting 1099-NEC.',
      },
      {
        name: 'Michael Brown',
        firstName: 'Michael',
        lastName: 'Brown',
        phone: '(212) 555-0166',
        email: 'michael.b@example.com',
        city: 'New York',
        state: 'NY',
        year: '2026',
        returnType: '1040-NR',
        status: 'New',
        staff: 'Amy Tran',
        fee: 950,
        amountPaid: 0,
        balance: 950,
        notes: 'Nonresident alien on F-1 visa.',
      },
      {
        name: 'Sophia Garcia',
        firstName: 'Sophia',
        lastName: 'Garcia',
        phone: '(305) 555-0144',
        email: 'sophia.g@example.com',
        city: 'Miami',
        state: 'FL',
        year: '2025',
        returnType: '1040',
        status: 'Completed',
        staff: 'Sarah Kim',
        fee: 600,
        amountPaid: 600,
        balance: 0,
        notes: 'Return accepted by IRS.',
      },
    ];
  }

  // 2. Load Businesses
  let businesses: any[] = [];
  try {
    const rawBiz =
      localStorage.getItem(`${userPrefix}_businesses`) ||
      localStorage.getItem(`crm_emy_businesses_${userId || 'guest'}`) ||
      localStorage.getItem('crm_emy_businesses');
    if (rawBiz) {
      businesses = JSON.parse(rawBiz);
    }
  } catch (e) {
    console.warn('Could not parse businesses from localStorage:', e);
  }

  if (!businesses || businesses.length === 0) {
    businesses = [
      {
        name: 'ABC Logistics LLC',
        dba: 'ABC Freight & Logistics',
        ein: '12-3456789',
        entityType: 'Partnership',
        returnType: 'Form 1065',
        year: '2025',
        status: 'In Preparation',
        preparer: 'Daniel Lee',
        fee: 2400,
        balance: 1200,
        phone: '(415) 555-0138',
        email: 'office@abclogistics.com',
      },
      {
        name: 'Golden Lotus Beauty Bar Inc',
        dba: 'Golden Lotus Nails & Spa',
        ein: '98-7654321',
        entityType: 'S-Corporation',
        returnType: 'Form 1120-S',
        year: '2025',
        status: 'Review',
        preparer: 'Sarah Kim',
        fee: 2800,
        balance: 0,
        phone: '(714) 555-0199',
        email: 'contact@goldenlotusspa.com',
      },
      {
        name: 'VN Express Delivery Corp',
        dba: 'VN Express',
        ein: '45-6789012',
        entityType: 'C-Corporation',
        returnType: 'Form 1120',
        year: '2025',
        status: 'Waiting Documents',
        preparer: 'Amy Tran',
        fee: 3500,
        balance: 3500,
        phone: '(408) 555-0177',
        email: 'admin@vnexpressdelivery.com',
      },
      {
        name: 'Luxury Nails Studio LLC',
        dba: 'Luxury Nails',
        ein: '33-9988771',
        entityType: 'Partnership',
        returnType: 'Form 1065',
        year: '2025',
        status: 'Ready to File',
        preparer: 'Amy Tran',
        fee: 1450,
        balance: 0,
        phone: '(714) 332-1199',
        email: 'info@luxurynails.com',
      },
    ];
  }

  // Calculate Financials & Status Counts
  let totalRevenue = 0;
  let totalPaid = 0;
  let totalBalance = 0;
  const statusCounts: Record<string, number> = {};

  clients.forEach((c) => {
    const fee = Number(c.fee) || 0;
    const paid = Number(c.amountPaid) || 0;
    const bal = Number(c.balance) || (fee - paid);
    totalRevenue += fee;
    totalPaid += paid;
    totalBalance += bal;

    const st = c.status || 'Unknown';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  businesses.forEach((b) => {
    const fee = Number(b.fee) || 0;
    const bal = Number(b.balance) || 0;
    const paid = fee - bal;
    totalRevenue += fee;
    totalPaid += paid;
    totalBalance += bal;

    const st = b.status || 'Unknown';
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  // Build Context Markdown for AI
  const lines: string[] = [];

  lines.push('### [CƠ SỞ DỮ LIỆU HIỆN TẠI CỦA VĂN PHÒNG CRM EMLY]');
  lines.push('');
  lines.push('#### 1. TỔNG QUAN DASHBOARD & TÀI CHÍNH');
  lines.push(`- **Tổng số khách hàng cá nhân**: ${clients.length}`);
  lines.push(`- **Tổng số khách hàng doanh nghiệp**: ${businesses.length}`);
  lines.push(`- **Tổng doanh thu dự kiến (Fees)**: $${totalRevenue.toLocaleString('en-US')}`);
  lines.push(`- **Đã thu (Amount Paid)**: $${totalPaid.toLocaleString('en-US')}`);
  lines.push(`- **Công nợ còn thiếu (Total Outstanding Balance)**: $${totalBalance.toLocaleString('en-US')}`);
  lines.push('');
  lines.push('- **Phân bổ theo trạng thái hồ sơ:**');
  Object.entries(statusCounts).forEach(([st, cnt]) => {
    lines.push(`  * ${st}: ${cnt} hồ sơ`);
  });
  lines.push('');

  lines.push('#### 2. DANH SÁCH KHÁCH HÀNG CÁ NHÂN (INDIVIDUAL CLIENTS)');
  clients.forEach((c, idx) => {
    const fullName = c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim();
    lines.push(
      `${idx + 1}. **${fullName}** | Form: ${c.returnType || '1040'} (${c.year || '2026'}) | Trạng thái: **${c.status || 'New'}** | Phụ trách: **${c.staff || 'Chưa gán'}**`
    );
    lines.push(
      `   - Email: ${c.email || 'N/A'} | SĐT: ${c.phone || 'N/A'} | Địa chỉ: ${[c.address, c.city, c.state, c.zip].filter(Boolean).join(', ') || 'N/A'}`
    );
    lines.push(
      `   - Phí dịch vụ: $${Number(c.fee || 0).toLocaleString()} | Đã trả: $${Number(c.amountPaid || 0).toLocaleString()} | Còn nợ: **$${Number(c.balance || 0).toLocaleString()}**`
    );
    if (c.notes) {
      lines.push(`   - Ghi chú/Chứng từ còn thiếu: *${c.notes}*`);
    }
  });
  lines.push('');

  lines.push('#### 3. DANH SÁCH DOANH NGHIỆP (BUSINESS CLIENTS)');
  businesses.forEach((b, idx) => {
    lines.push(
      `${idx + 1}. **${b.name}** (DBA: ${b.dba || 'N/A'}) | EIN: ${b.ein || 'N/A'} | Loại hình: ${b.entityType || 'LLC'} | Form: ${b.returnType || '1065'} (${b.year || '2025'})`
    );
    lines.push(
      `   - Trạng thái: **${b.status || 'In Preparation'}** | Phụ trách: **${b.preparer || 'Chưa gán'}**`
    );
    lines.push(
      `   - Email: ${b.email || 'N/A'} | SĐT: ${b.phone || 'N/A'} | Phí: $${Number(b.fee || 0).toLocaleString()} | Còn nợ: **$${Number(b.balance || 0).toLocaleString()}**`
    );
  });

  return {
    totalClients: clients.length,
    totalBusinesses: businesses.length,
    totalRevenue,
    totalPaid,
    totalBalance,
    statusCounts,
    contextMarkdown: lines.join('\n'),
  };
}

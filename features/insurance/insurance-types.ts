export type InsuranceStatus = 'Mới' | 'Đang tư vấn' | 'Đang phục vụ' | 'Ngừng chăm sóc' | 'new' | 'consulting' | 'active' | 'inactive';

export type InsuranceType =
  | 'Original Medicare'
  | 'Medicare Advantage'
  | 'Medigap'
  | 'Part D'
  | 'ACA (Obamacare)'
  | 'Life Insurance'
  | 'Khác'
  | 'Other';

export interface InsuranceClient {
  id: string;
  fullName: string; // 1. Họ và tên (Bắt buộc)
  phone: string; // 2. Số điện thoại (Bắt buộc khi có)
  dob?: string; // 3. Ngày sinh (Nên có - tự tính tuổi)
  state?: string; // 4. Bang
  zipCode?: string; // 4. ZIP Code
  status: string; // 5. Trạng thái khách hàng (Bắt buộc)
  assignedStaff: string; // 6. Nhân viên phụ trách (Bắt buộc)
  carrier?: string; // 7. Hãng bảo hiểm hiện tại (Nên có)
  insuranceType?: string; // 8. Loại bảo hiểm (Nên có)
  planName?: string; // 9. Tên gói bảo hiểm (Tùy chọn)
  effectiveDate?: string; // 10. Ngày hiệu lực bảo hiểm (Nên có)
  nextFollowUpDate?: string; // 11. Ngày liên hệ tiếp theo (Nên có)
  notes?: string; // 12. Ghi chú ngắn (Tùy chọn)
  createdAt: string;
  updatedAt: string;
}

export function calculateAge(dob?: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function formatInsuranceStatus(status: string, lang: 'vi' | 'en'): string {
  if (lang === 'vi') {
    switch (status) {
      case 'new':
      case 'Mới':
      case 'New':
        return 'Mới';
      case 'consulting':
      case 'Đang tư vấn':
      case 'In Consultation':
        return 'Đang tư vấn';
      case 'active':
      case 'Đang phục vụ':
      case 'Active Service':
      case 'Active':
        return 'Đang phục vụ';
      case 'inactive':
      case 'Ngừng chăm sóc':
      case 'Inactive':
      case 'Inactive / Paused':
        return 'Ngừng chăm sóc';
      default:
        return status;
    }
  } else {
    switch (status) {
      case 'new':
      case 'Mới':
      case 'New':
        return 'New';
      case 'consulting':
      case 'Đang tư vấn':
      case 'In Consultation':
        return 'In Consultation';
      case 'active':
      case 'Đang phục vụ':
      case 'Active Service':
      case 'Active':
        return 'Active Service';
      case 'inactive':
      case 'Ngừng chăm sóc':
      case 'Inactive':
      case 'Inactive / Paused':
        return 'Inactive';
      default:
        return status;
    }
  }
}

export function formatInsuranceType(type: string, lang: 'vi' | 'en'): string {
  if (lang === 'vi') {
    if (type === 'Other') return 'Khác';
    return type;
  } else {
    if (type === 'Khác') return 'Other';
    return type;
  }
}

'use client';

import React, { useState } from 'react';
import { Building2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLanguage } from '@/lib/i18n/language-context';

export interface BusinessData {
  name: string;
  dba: string;
  ein: string;
  entityType: string;
  status: string;
  assignedStaff: string;
  email: string;
  phone: string;
  address: string;
  primaryContact: string;
  federalTax: number;
  stateTax: number;
  fee: number;
  amountPaid: number;
}

interface EditBusinessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: BusinessData;
  onSave: (updated: BusinessData) => void;
}

export function EditBusinessModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditBusinessModalProps) {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<BusinessData>(initialData);

  // Sync initialData when modal opens
  React.useEffect(() => {
    if (open) {
      setFormData(initialData);
    }
  }, [open, initialData]);

  const handleChange = (field: keyof BusinessData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const balance = Math.max(0, (Number(formData.fee) || 0) - (Number(formData.amountPaid) || 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 rounded-2xl bg-white flex flex-col">
        <header className="p-6 pb-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#092c5c] flex items-center justify-center border border-blue-100 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {language === 'vi' ? 'Chỉnh Sửa Thông Tin Doanh Nghiệp' : 'Edit Business Information'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {language === 'vi'
                  ? 'Cập nhật pháp nhân công ty, tiến độ xử lý, thông tin liên lạc và chi phí thuế.'
                  : 'Update entity profile, workflow status, contact, and tax fees.'}
              </DialogDescription>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Basic Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {language === 'vi' ? '1. Thông Tin Pháp Nhân & Trạng Thái' : '1. Business Identity & Status'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Tên Pháp Lý Doanh Nghiệp' : 'Legal Business Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Tên Thương Mại Hoạt Động (DBA)' : 'DBA (Doing Business As)'}
                </label>
                <input
                  type="text"
                  value={formData.dba}
                  onChange={(e) => handleChange('dba', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Mã Số Thuế EIN' : 'EIN'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.ein}
                  onChange={(e) => handleChange('ein', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Loại Hình Doanh Nghiệp' : 'Entity Type'}
                </label>
                <select
                  value={formData.entityType}
                  onChange={(e) => handleChange('entityType', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Partnership">{language === 'vi' ? 'Hợp danh (Partnership Form 1065)' : 'Partnership (Form 1065)'}</option>
                  <option value="S Corporation">{language === 'vi' ? 'Công ty S-Corp (Form 1120-S)' : 'S Corporation (Form 1120-S)'}</option>
                  <option value="C Corporation">{language === 'vi' ? 'Công ty C-Corp (Form 1120)' : 'C Corporation (Form 1120)'}</option>
                  <option value="Sole Proprietor">{language === 'vi' ? 'Hộ kinh doanh cá thể (Schedule C)' : 'Sole Proprietor (Schedule C)'}</option>
                  <option value="Single Member LLC">{language === 'vi' ? 'Công ty LLC 1 thành viên' : 'Single Member LLC'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Trạng Thái Xử Lý' : 'Workflow Status'}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-500 cursor-pointer font-semibold"
                >
                  <option value="New">{language === 'vi' ? 'Mới tạo' : 'New'}</option>
                  <option value="Waiting Documents">{language === 'vi' ? 'Chờ Giấy Tờ' : 'Waiting Documents'}</option>
                  <option value="Documents Received">{language === 'vi' ? 'Đã Nhận Giấy Tờ' : 'Documents Received'}</option>
                  <option value="In Preparation">{language === 'vi' ? 'Đang Soạn Hồ Sơ' : 'In Preparation'}</option>
                  <option value="Missing Information">{language === 'vi' ? 'Thiếu Thông Tin' : 'Missing Information'}</option>
                  <option value="Review">{language === 'vi' ? 'Đang Kiểm Tra' : 'Review'}</option>
                  <option value="Ready to File">{language === 'vi' ? 'Sẵn Sàng Nộp' : 'Ready to File'}</option>
                  <option value="Completed">{language === 'vi' ? 'Đã Hoàn Tất' : 'Completed'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Nhân Viên Phụ Trách' : 'Assigned Staff'}
                </label>
                <select
                  value={formData.assignedStaff}
                  onChange={(e) => handleChange('assignedStaff', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Amy Tran">Amy Tran (Admin)</option>
                  <option value="Daniel Lee">Daniel Lee (Preparer)</option>
                  <option value="Sarah Kim">Sarah Kim (Reviewer)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {language === 'vi' ? '2. Thông Tin Liên Hệ' : '2. Contact Information'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Địa Chỉ Email' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Số Điện Thoại' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Địa Chỉ Trụ Sở Doanh Nghiệp' : 'Business Address'}
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Người Đại Diện Chính' : 'Primary Contact Person'}
                </label>
                <input
                  type="text"
                  value={formData.primaryContact}
                  onChange={(e) => handleChange('primaryContact', e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 3. Financial & Tax Fees */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {language === 'vi' ? '3. Biểu Phí & Nghĩa Vụ Thuế' : '3. Tax & Fee Engagements'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Ước Tính Thuế Liên Bang ($)' : 'Estimated Federal Tax ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.federalTax}
                  onChange={(e) => handleChange('federalTax', Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Ước Tính Thuế Tiểu Bang ($)' : 'Estimated State Tax ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stateTax}
                  onChange={(e) => handleChange('stateTax', Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Phí Dịch Vụ Khai Thuế ($)' : 'Preparation Fee ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.fee}
                  onChange={(e) => handleChange('fee', Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'vi' ? 'Số Tiền Đã Thanh Toán ($)' : 'Amount Paid ($)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.amountPaid}
                  onChange={(e) => handleChange('amountPaid', Number(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950">{language === 'vi' ? 'Số Tiền Còn Nợ Phải Thu:' : 'Calculated Balance Due:'}</span>
              <span className={`text-base font-extrabold ${balance > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                ${balance.toLocaleString()}
              </span>
            </div>
          </div>
        </form>

        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 text-xs font-semibold cursor-pointer"
          >
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            className="h-10 px-5 text-xs font-bold gap-2 bg-[#092c5c] hover:bg-[#072247] text-white shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

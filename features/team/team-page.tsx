'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock3, Mail, MoreHorizontal, Pencil, ShieldCheck, Trash2, UserPlus, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/i18n/language-context';
import { useMemberStore, type TeamMember, type MemberRole, type MemberStatus } from './member-store';

// ─── Schema ──────────────────────────────────────────────────────────────────

const memberSchema = z.object({
  name:   z.string().trim().min(2, 'Full name is required'),
  email:  z.string().trim().email('Enter a valid email address'),
  phone:  z.string().optional(),
  role:   z.enum(['Super Admin', 'Tax Preparer', 'Reviewer', 'Staff']),
  status: z.enum(['Active', 'Invited', 'Inactive']),
});

type MemberFormValues = z.infer<typeof memberSchema>;

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLES: MemberRole[]   = ['Super Admin', 'Tax Preparer', 'Reviewer', 'Staff'];
const STATUSES: MemberStatus[] = ['Active', 'Invited', 'Inactive'];

const roleClass: Record<MemberRole, string> = {
  'Super Admin':  'super-admin',
  'Tax Preparer': 'tax-preparer',
  'Reviewer':     'reviewer',
  'Staff':        'staff',
};

// ─── Member Form Modal ────────────────────────────────────────────────────────

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: MemberFormValues) => void;
  initial?: TeamMember | null;
}

function MemberModal({ open, onClose, onSubmit, initial }: MemberModalProps) {
  const { language } = useLanguage();
  const isEdit = !!initial;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name:   initial?.name   ?? '',
      email:  initial?.email  ?? '',
      phone:  initial?.phone  ?? '',
      role:   initial?.role   ?? 'Staff',
      status: initial?.status ?? 'Invited',
    },
  });

  const handleClose = () => { reset(); onClose(); };

  const submit = (data: MemberFormValues) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const roleLabelVi: Record<string, string> = {
    'Super Admin': 'Quản Trị Viên Cấp Cao (Super Admin)',
    'Tax Preparer': 'Nhân Viên Khai Thuế (Preparer)',
    'Reviewer': 'Nhân Viên Kiểm Tra (Reviewer)',
    'Staff': 'Nhân Viên Văn Phòng (Staff)',
  };

  const statusLabelVi: Record<string, string> = {
    'Active': 'Đang Hoạt Động (Active)',
    'Invited': 'Đã Gửi Lời Mời (Invited)',
    'Inactive': 'Tạm Ngưng (Inactive)',
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="member-modal-content">
        <div className="member-modal-header">
          <div>
            <DialogTitle>{isEdit ? (language === 'vi' ? 'Chỉnh Sửa Nhân Viên' : 'Edit Member') : (language === 'vi' ? 'Mời Thành Viên Vào Nhóm' : 'Invite Team Member')}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? (language === 'vi' ? 'Cập nhật thông tin tài khoản và vai trò nhân sự.' : "Update the member's information and role.")
                : (language === 'vi' ? 'Thêm nhân viên mới vào hệ thống quản lý thuế EMLY CUSTOMER LIST.' : 'Add a new staff member to EMLY CUSTOMER LIST.')}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="member-modal-form">
          {/* Name */}
          <div className="member-form-field">
            <Label htmlFor="m-name">{language === 'vi' ? 'Họ và Tên' : 'Full Name'} <span>*</span></Label>
            <Input id="m-name" placeholder={language === 'vi' ? 'Ví dụ: Nguyễn Văn A' : 'e.g. Jane Smith'} {...register('name')} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="member-form-field">
            <Label htmlFor="m-email">{language === 'vi' ? 'Địa Chỉ Email' : 'Email Address'} <span>*</span></Label>
            <Input id="m-email" type="email" placeholder="jane@emlylist.com" {...register('email')} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="member-form-field">
            <Label htmlFor="m-phone">{language === 'vi' ? 'Số Điện Thoại' : 'Phone'} <span className="optional">{language === 'vi' ? '(không bắt buộc)' : '(optional)'}</span></Label>
            <Input id="m-phone" placeholder="(555) 000-0000" {...register('phone')} />
          </div>

          {/* Role + Status row */}
          <div className="member-form-row">
            <div className="member-form-field">
              <Label htmlFor="m-role">{language === 'vi' ? 'Vai Trò / Quyền Hạn' : 'Role'} <span>*</span></Label>
              <select id="m-role" {...register('role')} className="crm-select">
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {language === 'vi' ? roleLabelVi[r] || r : r}
                  </option>
                ))}
              </select>
              {errors.role && <p className="field-error">{errors.role.message}</p>}
            </div>

            <div className="member-form-field">
              <Label htmlFor="m-status">{language === 'vi' ? 'Trạng Thái Tài Khoản' : 'Status'} <span>*</span></Label>
              <select id="m-status" {...register('status')} className="crm-select">
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {language === 'vi' ? statusLabelVi[s] || s : s}
                  </option>
                ))}
              </select>
              {errors.status && <p className="field-error">{errors.status.message}</p>}
            </div>
          </div>

          <div className="member-modal-actions">
            <Button type="button" variant="outline" onClick={handleClose} className="cursor-pointer">
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isEdit ? (language === 'vi' ? 'Lưu Thay Đổi' : 'Save Changes') : <><UserPlus size={14} />{language === 'vi' ? 'Gửi Lời Mời' : 'Send Invite'}</>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

interface DeleteDialogProps {
  member: TeamMember | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteDialog({ member, onClose, onConfirm }: DeleteDialogProps) {
  const { language } = useLanguage();
  return (
    <Dialog open={!!member} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="delete-modal-content">
        <div className="delete-modal-icon"><Trash2 size={20} /></div>
        <DialogTitle>{language === 'vi' ? 'Xóa Thành Viên Khỏi Nhóm' : 'Remove Team Member'}</DialogTitle>
        <DialogDescription>
          {language === 'vi' ? (
            <>Bạn có chắc chắn muốn xóa nhân viên <strong>{member?.name}</strong> khỏi hệ thống? Thao tác này không thể hoàn tác.</>
          ) : (
            <>Are you sure you want to remove <strong>{member?.name}</strong>? This action cannot be undone.</>
          )}
        </DialogDescription>
        <div className="delete-modal-actions">
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            {language === 'vi' ? 'Hủy' : 'Cancel'}
          </Button>
          <Button className="btn-danger cursor-pointer" onClick={onConfirm}>
            {language === 'vi' ? 'Xác Nhận Xóa' : 'Remove Member'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row Actions Menu ─────────────────────────────────────────────────────────

interface RowMenuProps {
  member: TeamMember;
  onEdit: () => void;
  onDelete: () => void;
}

function RowMenu({ member, onEdit, onDelete }: RowMenuProps) {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleOpen = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    }
    setOpen((v) => !v);
  };

  return (
    <div className="row-menu-wrap">
      <button
        ref={btnRef}
        type="button"
        className="row-menu-trigger cursor-pointer"
        aria-label={`Actions for ${member.name}`}
        onClick={handleOpen}
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <>
          <div className="row-menu-backdrop" onClick={() => setOpen(false)} />
          <div
            className="row-menu-dropdown"
            style={{ position: 'fixed', top: pos.top, right: pos.right, left: 'auto' }}
          >
            <button type="button" onClick={() => { setOpen(false); onEdit(); }} className="cursor-pointer">
              <Pencil size={13} /> {language === 'vi' ? 'Chỉnh sửa' : 'Edit'}
            </button>
            <button type="button" className="danger cursor-pointer" onClick={() => { setOpen(false); onDelete(); }}>
              <Trash2 size={13} /> {language === 'vi' ? 'Xóa nhân viên' : 'Remove'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Team Page ────────────────────────────────────────────────────────────────

export function TeamPage() {
  const { language } = useLanguage();
  const { members, addMember, updateMember, deleteMember } = useMemberStore();

  const [addOpen,    setAddOpen]    = useState(false);
  const [editTarget, setEditTarget] = useState<TeamMember | null>(null);
  const [delTarget,  setDelTarget]  = useState<TeamMember | null>(null);

  const totalAssigned  = members.reduce((s, m) => s + m.assigned, 0);
  const activeCount    = members.filter((m) => m.status === 'Active').length;

  const handleAdd = (data: MemberFormValues) => addMember(data);

  const handleEdit = (data: MemberFormValues) => {
    if (editTarget) updateMember(editTarget.id, data);
  };

  const handleDelete = () => {
    if (delTarget) { deleteMember(delTarget.id); setDelTarget(null); }
  };

  const roleLabelVi: Record<string, string> = {
    'Super Admin': 'Quản Trị Viên Cấp Cao',
    'Tax Preparer': 'Nhân Viên Khai Thuế',
    'Reviewer': 'Nhân Viên Kiểm Tra',
    'Staff': 'Nhân Viên Văn Phòng',
  };

  const statusLabelVi: Record<string, string> = {
    'Active': 'Đang Hoạt Động',
    'Invited': 'Đã Gửi Lời Mời',
    'Inactive': 'Tạm Ngưng',
  };

  return (
    <main className="team-page">
      {/* ── Header ── */}
      <header className="team-head">
        <div>
          <p>{language === 'vi' ? 'QUẢN TRỊ NHÂN SỰ' : 'TAX CRM'}</p>
          <h1>{language === 'vi' ? 'Đội Ngũ Nhân Viên' : 'Team'}</h1>
          <span>{language === 'vi' ? 'Quản lý quyền truy cập nhân sự, phân quyền vai trò và phân công hồ sơ khai thuế.' : 'Manage staff access, roles, and tax return assignments.'}</span>
        </div>
        <Button onClick={() => setAddOpen(true)} className="cursor-pointer">
          <UserPlus size={14} /> {language === 'vi' ? 'Mời Thành Viên Mới' : 'Invite Team Member'}
        </Button>
      </header>

      {/* ── Summary cards ── */}
      <section className="team-summary">
        <article>
          <span><UsersRound /></span>
          <div><small>{language === 'vi' ? 'Tổng Thành Viên' : 'Team Members'}</small><b>{members.length}</b></div>
        </article>
        <article>
          <span className="green"><ShieldCheck /></span>
          <div><small>{language === 'vi' ? 'Đang Hoạt Động' : 'Active Staff'}</small><b>{activeCount}</b></div>
        </article>
        <article>
          <span className="violet"><Clock3 /></span>
          <div><small>{language === 'vi' ? 'Hồ Sơ Đã Phân Công' : 'Assigned Returns'}</small><b>{totalAssigned}</b></div>
        </article>
      </section>

      {/* ── Table card ── */}
      <section className="team-table-card">
        <header>
          <div>
            <b>{language === 'vi' ? 'Danh Sách Nhân Sự Văn Phòng' : 'CRM Staff'}</b>
            <span>{language === 'vi' ? 'Vai trò và quyền hạn được bảo mật qua phân quyền Supabase' : 'Roles and permissions are sourced from profiles'}</span>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {language === 'vi' ? 'Quản Lý Quyền' : 'Manage Roles'}
          </Button>
        </header>

        <div className="team-table-wrap">
          {members.length === 0 ? (
            <div className="team-empty">
              <UsersRound size={32} />
              <p>{language === 'vi' ? 'Chưa có thành viên nào.' : 'No team members yet.'}</p>
              <Button size="sm" onClick={() => setAddOpen(true)} className="cursor-pointer">
                <UserPlus size={13} /> {language === 'vi' ? 'Mời thành viên đầu tiên' : 'Invite first member'}
              </Button>
            </div>
          ) : (
            <table className="crm-team-table">
              <thead>
                <tr>
                  <th>{language === 'vi' ? 'HỌ VÀ TÊN' : 'NAME'}</th>
                  <th>EMAIL</th>
                  <th>{language === 'vi' ? 'VAI TRÒ' : 'ROLE'}</th>
                  <th>{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</th>
                  <th>{language === 'vi' ? 'HỒ SƠ PHỤ TRÁCH' : 'ASSIGNED RETURNS'}</th>
                  <th>{language === 'vi' ? 'HOẠT ĐỘNG GẦN NHẤT' : 'LAST ACTIVE'}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, index) => (
                  <tr key={member.id}>
                    <td>
                      <div className={`team-avatar client-tone-${index % 6}`}>{member.initials}</div>
                      <b>{member.name}</b>
                    </td>
                    <td><Mail size={12} />{member.email}</td>
                    <td>
                      <span className={`role-pill ${roleClass[member.role]}`}>
                        <ShieldCheck size={11} />{language === 'vi' ? roleLabelVi[member.role] || member.role : member.role}
                      </span>
                    </td>
                    <td>
                      <span className={`member-status ${member.status.toLowerCase()}`}>
                        <i />{language === 'vi' ? statusLabelVi[member.status] || member.status : member.status}
                      </span>
                    </td>
                    <td><b>{member.assigned}</b></td>
                    <td>{member.lastActive}</td>
                    <td>
                      <RowMenu
                        member={member}
                        onEdit={() => setEditTarget(member)}
                        onDelete={() => setDelTarget(member)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Modals ── */}
      <MemberModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
      />

      <MemberModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEdit}
        initial={editTarget}
      />

      <DeleteDialog
        member={delTarget}
        onClose={() => setDelTarget(null)}
        onConfirm={handleDelete}
      />
    </main>
  );
}

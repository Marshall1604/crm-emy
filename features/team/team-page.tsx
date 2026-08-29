'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Clock3, Mail, MoreHorizontal, Pencil, ShieldCheck, Trash2, UserPlus, UsersRound, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="member-modal-content">
        <div className="member-modal-header">
          <div>
            <DialogTitle>{isEdit ? 'Edit Member' : 'Invite Team Member'}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update the member's information and role." : 'Add a new staff member to CRM EMY.'}
            </DialogDescription>
          </div>
        </div>

        <form onSubmit={handleSubmit(submit)} className="member-modal-form">
          {/* Name */}
          <div className="member-form-field">
            <Label htmlFor="m-name">Full Name <span>*</span></Label>
            <Input id="m-name" placeholder="e.g. Jane Smith" {...register('name')} />
            {errors.name && <p className="field-error">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="member-form-field">
            <Label htmlFor="m-email">Email Address <span>*</span></Label>
            <Input id="m-email" type="email" placeholder="jane@crmemy.com" {...register('email')} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="member-form-field">
            <Label htmlFor="m-phone">Phone <span className="optional">(optional)</span></Label>
            <Input id="m-phone" placeholder="(555) 000-0000" {...register('phone')} />
          </div>

          {/* Role + Status row */}
          <div className="member-form-row">
            <div className="member-form-field">
              <Label htmlFor="m-role">Role <span>*</span></Label>
              <select id="m-role" {...register('role')} className="crm-select">
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="field-error">{errors.role.message}</p>}
            </div>

            <div className="member-form-field">
              <Label htmlFor="m-status">Status <span>*</span></Label>
              <select id="m-status" {...register('status')} className="crm-select">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.status && <p className="field-error">{errors.status.message}</p>}
            </div>
          </div>

          <div className="member-modal-actions">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? 'Save Changes' : <><UserPlus size={14} />Send Invite</>}
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
  return (
    <Dialog open={!!member} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="delete-modal-content">
        <div className="delete-modal-icon"><Trash2 size={20} /></div>
        <DialogTitle>Remove Team Member</DialogTitle>
        <DialogDescription>
          Are you sure you want to remove <strong>{member?.name}</strong> from CRM EMY?
          This action cannot be undone.
        </DialogDescription>
        <div className="delete-modal-actions">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="btn-danger" onClick={onConfirm}>Remove Member</Button>
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
        className="row-menu-trigger"
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
            <button type="button" onClick={() => { setOpen(false); onEdit(); }}>
              <Pencil size={13} /> Edit
            </button>
            <button type="button" className="danger" onClick={() => { setOpen(false); onDelete(); }}>
              <Trash2 size={13} /> Remove
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Team Page ────────────────────────────────────────────────────────────────

export function TeamPage() {
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

  return (
    <main className="team-page">
      {/* ── Header ── */}
      <header className="team-head">
        <div>
          <p>TAX CRM</p>
          <h1>Team</h1>
          <span>Manage staff access, roles, and tax return assignments.</span>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <UserPlus size={14} /> Invite Team Member
        </Button>
      </header>

      {/* ── Summary cards ── */}
      <section className="team-summary">
        <article>
          <span><UsersRound /></span>
          <div><small>Team Members</small><b>{members.length}</b></div>
        </article>
        <article>
          <span className="green"><ShieldCheck /></span>
          <div><small>Active Staff</small><b>{activeCount}</b></div>
        </article>
        <article>
          <span className="violet"><Clock3 /></span>
          <div><small>Assigned Returns</small><b>{totalAssigned}</b></div>
        </article>
      </section>

      {/* ── Table card ── */}
      <section className="team-table-card">
        <header>
          <div>
            <b>CRM Staff</b>
            <span>Roles and permissions are sourced from profiles</span>
          </div>
          <Button variant="outline" size="sm">Manage Roles</Button>
        </header>

        <div className="team-table-wrap">
          {members.length === 0 ? (
            <div className="team-empty">
              <UsersRound size={32} />
              <p>No team members yet.</p>
              <Button size="sm" onClick={() => setAddOpen(true)}>
                <UserPlus size={13} /> Invite first member
              </Button>
            </div>
          ) : (
            <table className="crm-team-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ASSIGNED RETURNS</th>
                  <th>LAST ACTIVE</th>
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
                        <ShieldCheck size={11} />{member.role}
                      </span>
                    </td>
                    <td>
                      <span className={`member-status ${member.status.toLowerCase()}`}>
                        <i />{member.status}
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

        <footer>
          <ShieldCheck size={13} />
          <span>Access control is enforced by Supabase Row Level Security. Role changes are never trusted from frontend state.</span>
        </footer>
      </section>

      <p className="preview-note">
        Preview staff are shown because Supabase environment credentials are not configured.
        Production data is read from the database-backed team_members view.
      </p>

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

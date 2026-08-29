# CRM EMY database schema

## Relationship overview

```text
auth.users
  └── profiles

clients
  ├── businesses (only when client_type = business)
  │     └── business_partners (unlimited)
  ├── tax_cases (one per tax year/month/return type)
  │     ├── tax_jurisdictions (Federal + unlimited State/Local)
  │     │     └── tax_amounts
  │     ├── notes
  │     └── activities
  ├── notes
  └── activities
```

## Design decisions

- `clients` is the common CRM record. Individual-only identity/contact data lives directly on it. A Business client has exactly one related `businesses` row.
- `business_partners` is one-to-many, so a business can have any number of partners. Ownership is `numeric(5,2)` with a 0–100 constraint.
- `tax_cases` belongs to the common client record, so the same workflow works for Individuals and Businesses.
- `tax_cases.return_type` stores the filing form independently from the legal entity type. Business choices initially include `1065`, `1120-S`, `1120`, and `Schedule C`.
- Tax workflow status follows the operational sequence from `new` through document collection, preparation, review, signature, e-file acceptance/rejection, extension, and completion. Filing deadlines remain a separate future domain rather than being encoded into status.
- `tax_jurisdictions` normalizes Federal, State, and Local filings. A case uses `US` for Federal and can add unlimited state codes such as `CA`, `NY`, or `TX`.
- `tax_amounts` contains monetary rows by jurisdiction and amount type. There are no `state1`, `state2`, or `state3` columns.
- `notes` is separate because each client or case can have unlimited notes. `activities` is an append-only audit timeline.
- SSN and EIN values are represented by encrypted `bytea` columns plus last-four columns for masked display. Plaintext identifiers must never be written to PostgreSQL logs or stored in the clear. Encryption/decryption belongs in a tightly controlled server-only service in a later implementation migration.
- All primary keys are UUIDs. Foreign keys use cascading deletes for owned records and `set null` for deleted staff references.
- Every mutable table has `created_at`, `updated_at`, and an update trigger. `activities` remains append-only despite retaining both timestamps for a consistent record shape.
- Phase 1 assumes one tax office. The RLS policies allow active staff to work with office records, reserve destructive client/case actions for owner/admin roles, and make activities append-only. Before multi-office support, add `workspace_id` to tenant-owned tables and scope every policy by membership.

## Applying the migration

The migration is located at:

`supabase/migrations/202608290001_initial_tax_crm_schema.sql`

Run it through the Supabase CLI against a local project first, then execute RLS isolation tests before linking a production project.

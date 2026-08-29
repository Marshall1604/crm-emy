'use client';

export interface PermanentClient {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  name: string;
  ssnOrItin: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  filingStatusDefault?: string;
  workflowStatus?: string;
  assignedStaff?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaxReturnEngagement {
  id: string;
  clientId: string;
  taxYear: string;
  returnType: string;
  filingStatus: string;
  status: string;
  assignedStaffId?: string;
  assignedStaff: string;
  federalTaxAmount: number;
  preparationFee: number;
  amountPaid: number;
  balance: number;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;

  // Snapshot fields preserving historical state at filing time
  taxpayerNameSnapshot: string;
  addressSnapshot: string;
  filingStatusSnapshot: string;
  spouseSnapshot?: {
    name?: string;
    ssn?: string;
    dob?: string;
  };
}

export interface ClientDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  taxYear?: string;
  updatedAt: string;
  fileUrl?: string;
  fileData?: string;
}

export interface ClientNote {
  id: string;
  author: string;
  content: string;
  taxYear?: string;
  createdAt: string;
}

export interface ClientActivity {
  id: string;
  icon: string;
  title: string;
  detail: string;
  actor: string;
  time: string;
  tone: 'blue' | 'violet' | 'amber' | 'green' | 'red';
}

export const initialClientsList: PermanentClient[] = [
  {
    id: 'minh-nguyen',
    firstName: 'Minh',
    middleName: 'V',
    lastName: 'Nguyen',
    name: 'Minh Nguyen',
    ssnOrItin: '584-29-6789',
    dateOfBirth: '1988-05-14',
    phone: '(714) 555-0184',
    email: 'minh.nguyen@example.com',
    address: '1280 Harbor Blvd',
    city: 'Anaheim',
    state: 'CA',
    zipCode: '92801',
    filingStatusDefault: 'Single',
    createdAt: 'Jan 10, 2024',
    updatedAt: 'Aug 29, 2026',
  },
  {
    id: 'olivia-johnson',
    firstName: 'Olivia',
    middleName: 'M',
    lastName: 'Johnson',
    name: 'Olivia Johnson',
    ssnOrItin: '415-38-4128',
    dateOfBirth: '1992-11-20',
    phone: '(415) 555-0128',
    email: 'olivia.j@example.com',
    address: '450 California St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94104',
    filingStatusDefault: 'Head of Household',
    createdAt: 'Jan 15, 2024',
    updatedAt: 'Aug 28, 2026',
  },
  {
    id: 'kevin-mai-tran',
    firstName: 'Kevin',
    lastName: 'Tran',
    name: 'Kevin & Mai Tran',
    ssnOrItin: '408-72-8192',
    dateOfBirth: '1985-03-12',
    phone: '(408) 555-0192',
    email: 'ktran@example.com',
    address: '1820 Story Rd',
    city: 'San Jose',
    state: 'CA',
    zipCode: '95122',
    filingStatusDefault: 'Married Filing Jointly',
    createdAt: 'Feb 01, 2025',
    updatedAt: 'Aug 27, 2026',
  },
  {
    id: 'michael-brown',
    firstName: 'Michael',
    lastName: 'Brown',
    name: 'Michael Brown',
    ssnOrItin: '212-64-9166',
    dateOfBirth: '1995-07-08',
    phone: '(212) 555-0166',
    email: 'michael.b@example.com',
    address: '740 Broadway',
    city: 'New York',
    state: 'NY',
    zipCode: '10003',
    filingStatusDefault: 'Nonresident Alien (Single)',
    createdAt: 'Aug 26, 2026',
    updatedAt: 'Aug 26, 2026',
  },
  {
    id: 'sophia-garcia',
    firstName: 'Sophia',
    lastName: 'Garcia',
    name: 'Sophia Garcia',
    ssnOrItin: '602-91-5141',
    dateOfBirth: '1990-12-03',
    phone: '(602) 555-0141',
    email: 'sophia.g@example.com',
    address: '2400 E Camelback Rd',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85016',
    filingStatusDefault: 'Single',
    createdAt: 'Jan 12, 2024',
    updatedAt: 'Aug 24, 2026',
  },
];

export const initialTaxReturnsList: TaxReturnEngagement[] = [
  // Minh Nguyen - Multiple years
  {
    id: 'tr-minh-2026',
    clientId: 'minh-nguyen',
    taxYear: '2026',
    returnType: 'Form 1040',
    filingStatus: 'Single',
    status: 'Waiting Documents',
    assignedStaff: 'Amy Tran',
    federalTaxAmount: 1450,
    preparationFee: 650,
    amountPaid: 325,
    balance: 325,
    internalNotes: 'Waiting for 1099-NEC from freelance consulting and donation receipts.',
    taxpayerNameSnapshot: 'Minh Nguyen',
    addressSnapshot: '1280 Harbor Blvd, Anaheim, CA 92801',
    filingStatusSnapshot: 'Single',
    createdAt: 'Aug 01, 2026',
    updatedAt: 'Aug 29, 2026',
  },
  {
    id: 'tr-minh-2025',
    clientId: 'minh-nguyen',
    taxYear: '2025',
    returnType: 'Form 1040',
    filingStatus: 'Single',
    status: 'Completed',
    assignedStaff: 'Amy Tran',
    federalTaxAmount: 3400,
    preparationFee: 600,
    amountPaid: 600,
    balance: 0,
    internalNotes: 'Completed standard filing. Delivered copy via portal.',
    taxpayerNameSnapshot: 'Minh Nguyen',
    addressSnapshot: '1280 Harbor Blvd, Anaheim, CA 92801',
    filingStatusSnapshot: 'Single',
    createdAt: 'Jan 15, 2025',
    updatedAt: 'Apr 12, 2025',
  },
  {
    id: 'tr-minh-2024',
    clientId: 'minh-nguyen',
    taxYear: '2024',
    returnType: 'Form 1040',
    filingStatus: 'Single',
    status: 'Completed',
    assignedStaff: 'Daniel Lee',
    federalTaxAmount: 2950,
    preparationFee: 550,
    amountPaid: 550,
    balance: 0,
    internalNotes: 'First year client engagement. W-2 only.',
    taxpayerNameSnapshot: 'Minh Nguyen',
    addressSnapshot: '890 Euclid St, Garden Grove, CA 92840',
    filingStatusSnapshot: 'Single',
    createdAt: 'Jan 20, 2024',
    updatedAt: 'Mar 15, 2024',
  },

  // Olivia Johnson
  {
    id: 'tr-olivia-2025',
    clientId: 'olivia-johnson',
    taxYear: '2025',
    returnType: 'Form 1040',
    filingStatus: 'Head of Household',
    status: 'Review',
    assignedStaff: 'Daniel Lee',
    federalTaxAmount: 2800,
    preparationFee: 875,
    amountPaid: 875,
    balance: 0,
    internalNotes: 'Child tax credit and dependent care verified. Awaiting secondary review.',
    taxpayerNameSnapshot: 'Olivia Johnson',
    addressSnapshot: '450 California St, San Francisco, CA 94104',
    filingStatusSnapshot: 'Head of Household',
    createdAt: 'Jan 18, 2025',
    updatedAt: 'Aug 28, 2026',
  },
  {
    id: 'tr-olivia-2024',
    clientId: 'olivia-johnson',
    taxYear: '2024',
    returnType: 'Form 1040',
    filingStatus: 'Head of Household',
    status: 'Completed',
    assignedStaff: 'Daniel Lee',
    federalTaxAmount: 2400,
    preparationFee: 800,
    amountPaid: 800,
    balance: 0,
    internalNotes: 'Accepted by IRS.',
    taxpayerNameSnapshot: 'Olivia Johnson',
    addressSnapshot: '450 California St, San Francisco, CA 94104',
    filingStatusSnapshot: 'Head of Household',
    createdAt: 'Feb 10, 2024',
    updatedAt: 'Apr 05, 2024',
  },

  // Kevin & Mai Tran
  {
    id: 'tr-kevin-2026',
    clientId: 'kevin-mai-tran',
    taxYear: '2026',
    returnType: 'Form 1040',
    filingStatus: 'Married Filing Jointly',
    status: 'In Preparation',
    assignedStaff: 'Sarah Kim',
    federalTaxAmount: 3200,
    preparationFee: 720,
    amountPaid: 500,
    balance: 220,
    internalNotes: 'W-2 and mortgage interest statements received.',
    taxpayerNameSnapshot: 'Kevin & Mai Tran',
    addressSnapshot: '1820 Story Rd, San Jose, CA 95122',
    filingStatusSnapshot: 'Married Filing Jointly',
    spouseSnapshot: { name: 'Mai Tran', ssn: '408-72-9014', dob: '1987-09-25' },
    createdAt: 'Aug 05, 2026',
    updatedAt: 'Aug 27, 2026',
  },
  {
    id: 'tr-kevin-2025',
    clientId: 'kevin-mai-tran',
    taxYear: '2025',
    returnType: 'Form 1040',
    filingStatus: 'Married Filing Jointly',
    status: 'Completed',
    assignedStaff: 'Sarah Kim',
    federalTaxAmount: 5100,
    preparationFee: 680,
    amountPaid: 680,
    balance: 0,
    internalNotes: 'Joint return with solar tax credit Schedule 5695.',
    taxpayerNameSnapshot: 'Kevin & Mai Tran',
    addressSnapshot: '1820 Story Rd, San Jose, CA 95122',
    filingStatusSnapshot: 'Married Filing Jointly',
    spouseSnapshot: { name: 'Mai Tran', ssn: '408-72-9014', dob: '1987-09-25' },
    createdAt: 'Feb 01, 2025',
    updatedAt: 'Apr 10, 2025',
  },

  // Michael Brown
  {
    id: 'tr-michael-2026',
    clientId: 'michael-brown',
    taxYear: '2026',
    returnType: 'Form 1040-NR',
    filingStatus: 'Nonresident Alien (Single)',
    status: 'New',
    assignedStaff: 'Amy Tran',
    federalTaxAmount: 0,
    preparationFee: 950,
    amountPaid: 0,
    balance: 950,
    internalNotes: 'International treaty analysis required for visa status.',
    taxpayerNameSnapshot: 'Michael Brown',
    addressSnapshot: '740 Broadway, New York, NY 10003',
    filingStatusSnapshot: 'Nonresident Alien (Single)',
    createdAt: 'Aug 26, 2026',
    updatedAt: 'Aug 26, 2026',
  },

  // Sophia Garcia
  {
    id: 'tr-sophia-2025',
    clientId: 'sophia-garcia',
    taxYear: '2025',
    returnType: 'Form 1040',
    filingStatus: 'Single',
    status: 'Completed',
    assignedStaff: 'Daniel Lee',
    federalTaxAmount: 980,
    preparationFee: 600,
    amountPaid: 600,
    balance: 0,
    internalNotes: 'Return e-filed and accepted by IRS.',
    taxpayerNameSnapshot: 'Sophia Garcia',
    addressSnapshot: '2400 E Camelback Rd, Phoenix, AZ 85016',
    filingStatusSnapshot: 'Single',
    createdAt: 'Jan 12, 2025',
    updatedAt: 'Aug 24, 2026',
  },
  {
    id: 'tr-sophia-2024',
    clientId: 'sophia-garcia',
    taxYear: '2024',
    returnType: 'Form 1040',
    filingStatus: 'Single',
    status: 'Completed',
    assignedStaff: 'Daniel Lee',
    federalTaxAmount: 1100,
    preparationFee: 550,
    amountPaid: 550,
    balance: 0,
    internalNotes: 'Standard deduction filing.',
    taxpayerNameSnapshot: 'Sophia Garcia',
    addressSnapshot: '2400 E Camelback Rd, Phoenix, AZ 85016',
    filingStatusSnapshot: 'Single',
    createdAt: 'Jan 14, 2024',
    updatedAt: 'Mar 20, 2024',
  },
];

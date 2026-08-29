'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Banknote, ChevronDown, CircleCheckBig, CircleDollarSign, ReceiptText, RotateCcw, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';
type FeeRecord = { taxReturnId:string; clientRecord:string; name:string; clientType:'Individual'|'Business'; year:string; returnType:string; totalFee:number; amountPaid:number; invoiceStatus:'Not Sent'|'Sent'|'Overdue'|'Paid' };

// Each fee record points to its existing tax-return engagement and client/business record.
const feeRecords: FeeRecord[] = [
  {taxReturnId:'tr-minh-2025',clientRecord:'/clients/minh-nguyen',name:'Minh Nguyen',clientType:'Individual',year:'2025',returnType:'1040',totalFee:650,amountPaid:325,invoiceStatus:'Sent'},
  {taxReturnId:'tr-abc-2025',clientRecord:'/businesses/abc-logistics',name:'ABC Logistics LLC',clientType:'Business',year:'2025',returnType:'1065',totalFee:2400,amountPaid:1200,invoiceStatus:'Sent'},
  {taxReturnId:'tr-olivia-2025',clientRecord:'/clients/olivia-johnson',name:'Olivia Johnson',clientType:'Individual',year:'2025',returnType:'1040',totalFee:875,amountPaid:875,invoiceStatus:'Paid'},
  {taxReturnId:'tr-xyz-2025',clientRecord:'/businesses',name:'XYZ Technology Inc',clientType:'Business',year:'2025',returnType:'1120-S',totalFee:3100,amountPaid:1550,invoiceStatus:'Overdue'},
  {taxReturnId:'tr-nails-2025',clientRecord:'/businesses',name:'Luxury Nails Studio LLC',clientType:'Business',year:'2025',returnType:'Schedule C',totalFee:1450,amountPaid:1450,invoiceStatus:'Paid'},
  {taxReturnId:'tr-acme-2024',clientRecord:'/businesses',name:'ACME Holdings Corp',clientType:'Business',year:'2024',returnType:'1120',totalFee:4200,amountPaid:0,invoiceStatus:'Not Sent'},
];

const balanceOf=(record:FeeRecord)=>Math.max(0,record.totalFee-record.amountPaid);
const paymentStatusOf=(record:FeeRecord):PaymentStatus=>record.amountPaid<=0?'Unpaid':balanceOf(record)<=0?'Paid':'Partial';
const money=(value:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);

export function FeesPage(){
  const[year,setYear]=useState('');const[status,setStatus]=useState('');const[type,setType]=useState('');
  const filtered=useMemo(()=>feeRecords.filter(record=>(!year||record.year===year)&&(!status||paymentStatusOf(record)===status)&&(!type||record.clientType===type)),[year,status,type]);
  const totals=useMemo(()=>filtered.reduce((sum,record)=>({fees:sum.fees+record.totalFee,paid:sum.paid+record.amountPaid,balance:sum.balance+balanceOf(record),paidCount:sum.paidCount+(paymentStatusOf(record)==='Paid'?1:0)}),{fees:0,paid:0,balance:0,paidCount:0}),[filtered]);
  const reset=()=>{setYear('');setStatus('');setType('')};
  return <main className="fees-page"><header className="fees-head"><div><p>TAX CRM</p><h1>Fees & Payments</h1><span>Track preparation fees and collections by tax return engagement.</span></div><Button><ReceiptText size={14}/>Create Invoice</Button></header>
    <section className="fees-kpis"><FeeCard label="Total Fees" value={money(totals.fees)} note={`${filtered.length} engagements`} icon={<CircleDollarSign/>} tone="navy"/><FeeCard label="Amount Collected" value={money(totals.paid)} note="Recorded payments" icon={<Banknote/>} tone="green"/><FeeCard label="Outstanding Balance" value={money(totals.balance)} note="Remaining to collect" icon={<WalletCards/>} tone="amber"/><FeeCard label="Paid In Full Count" value={String(totals.paidCount)} note="Engagements fully paid" icon={<CircleCheckBig/>} tone="violet"/></section>
    <section className="fee-filters"><div><b>Filters</b><span>{filtered.length} records</span></div><Filter label="Tax Year" value={year} setValue={setYear} options={['2026','2025','2024']}/><Filter label="Payment Status" value={status} setValue={setStatus} options={['Unpaid','Partial','Paid']}/><Filter label="Client Type" value={type} setValue={setType} options={['Individual','Business']}/><Button variant="ghost" size="sm" onClick={reset}><RotateCcw size={13}/>Reset</Button></section>
    <section className="fees-table-card"><header><div><b>Fee Ledger</b><span>Fees are linked to existing tax return records</span></div><Button variant="outline" size="sm">Export</Button></header><div className="fees-table-wrap"><table className="fees-table"><thead><tr><th>CLIENT / BUSINESS</th><th>TAX YEAR</th><th>RETURN TYPE</th><th>TOTAL FEE</th><th>AMOUNT PAID</th><th>BALANCE</th><th>PAYMENT STATUS</th><th>INVOICE STATUS</th></tr></thead><tbody>{filtered.map((record,i)=>{const balance=balanceOf(record),payment=paymentStatusOf(record);return <tr key={record.taxReturnId}><td><Link href={`/tax-returns/${record.taxReturnId}`}><span className={`fee-avatar client-tone-${i%5}`}>{record.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span><div><b>{record.name}</b><small>{record.clientType} · Engagement {record.taxReturnId}</small></div></Link></td><td><b>{record.year}</b></td><td><span className="client-return">{record.returnType}</span></td><td><b>{money(record.totalFee)}</b></td><td className="fee-collected">{money(record.amountPaid)}</td><td className={balance?'fee-due':'fee-zero'}>{money(balance)}</td><td><span className={`payment-pill ${payment.toLowerCase()}`}><i/>{payment}</span></td><td><span className={`invoice-pill ${record.invoiceStatus.toLowerCase().replace(' ','-')}`}>{record.invoiceStatus}</span></td></tr>})}</tbody></table>{!filtered.length&&<div className="fees-empty"><ReceiptText size={22}/><b>No fee records found</b><p>Try changing or resetting your filters.</p></div>}</div><p className="preview-note">Preview fee values reference the same tax return engagements shown on the Tax Returns page. No duplicate customer records are created.</p></section>
  </main>;
}

function FeeCard({label,value,note,icon,tone}:{label:string;value:string;note:string;icon:React.ReactNode;tone:string}){return <article className="fee-kpi"><span className={`fee-kpi-icon ${tone}`}>{icon}</span><p>{label}</p><b>{value}</b><small>{note}</small></article>}
function Filter({label,value,setValue,options}:{label:string;value:string;setValue:(value:string)=>void;options:string[]}){return <label className="fee-filter"><span>{label}</span><select value={value} onChange={event=>setValue(event.target.value)}><option value="">All</option>{options.map(option=><option key={option}>{option}</option>)}</select><ChevronDown size={12}/></label>}

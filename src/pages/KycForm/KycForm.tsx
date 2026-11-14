import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './KycForm.css';

type KycData = {
  firstName: string; lastName: string; email: string; phone: string; dateOfBirth: string;
  address1: string; city: string; state: string; postalCode: string; country: string;
  documentType: string; documentNumber: string; declaration: boolean;
};
type Field = Exclude<keyof KycData, 'declaration'>;
const STORAGE_KEY = 'clienthub-demo-kyc-draft-v1';
const initial: KycData = { firstName:'',lastName:'',email:'',phone:'',dateOfBirth:'',address1:'',city:'',state:'',postalCode:'',country:'India',documentType:'',documentNumber:'',declaration:false };
const steps = ['Personal details','Address','Identification','Review'];
const fields: Array<Array<{key:Field;label:string;type?:string;placeholder?:string}>> = [
  [{key:'firstName',label:'First name'},{key:'lastName',label:'Last name'},{key:'email',label:'Email address',type:'email'},{key:'phone',label:'Phone number',type:'tel'},{key:'dateOfBirth',label:'Date of birth',type:'date'}],
  [{key:'address1',label:'Street address'},{key:'city',label:'City'},{key:'state',label:'State / Province'},{key:'postalCode',label:'Postal code'},{key:'country',label:'Country'}],
  [{key:'documentNumber',label:'Document reference number'}]
];
function readDraft(): KycData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const values = parsed as Record<string, unknown>;
        const result = { ...initial };
        for (const key of Object.keys(initial) as Array<keyof KycData>) {
          if (key === 'declaration') continue;
          if (typeof values[key] === 'string') result[key] = values[key] as never;
        }
        return result;
      }
    }
  } catch { /* localStorage unavailable or invalid draft */ }
  return { ...initial };
}
function validateStep(step:number, data:KycData): string {
  if (step < 3) {
    const required = fields[step].find(field => !data[field.key].trim());
    if (required) return `${required.label} is required.`;
  }
  if (step === 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Enter a valid email address.';
    if (!/^[+\d()\s-]{7,20}$/.test(data.phone)) return 'Enter a valid phone number.';
    if (data.dateOfBirth > new Date().toISOString().slice(0,10)) return 'Date of birth cannot be in the future.';
  }
  if (step === 2 && !data.documentType) return 'Select a document type.';
  if (step === 3 && !data.declaration) return 'Confirm the declaration before submitting.';
  return '';
}
export default function KycForm() {
  const navigate = useNavigate();
  const [data,setData] = useState<KycData>(readDraft);
  const [step,setStep] = useState(0);
  const [message,setMessage] = useState('');
  const [error,setError] = useState('');
  const [submitted,setSubmitted] = useState(false);
  useEffect(() => { document.title = 'New KYC application | ClientHub'; }, []);
  function update(key:keyof KycData,value:string|boolean) {
    setData(previous => ({...previous,[key]:value}));
    setError(''); setMessage('');
  }
  function saveDraft() {
    try {
      const { declaration: _declaration, ...draft } = data;
      void _declaration;
      localStorage.setItem(STORAGE_KEY,JSON.stringify(draft));
      setMessage('Draft saved in this browser. This is not saved to a server.');
      setError('');
    } catch { setError('Could not save this draft in your browser.'); }
  }
  function next() {
    const validation = validateStep(step,data);
    if (validation) {setError(validation);return;}
    setError('');setMessage('');setStep(value => Math.min(value+1,3));
  }
  function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    for (let i=0;i<4;i++) {
      const validation = validateStep(i,data);
      if (validation) {setStep(i);setError(validation);return;}
    }
    try {localStorage.removeItem(STORAGE_KEY);} catch { /* optional cleanup */ }
    setSubmitted(true);setError('');setMessage('');
  }
  if (submitted) return <main className="kyc-page"><section className="kyc-card kyc-success"><span className="kyc-check">✓</span><h1>Demo submission complete</h1><p>Your form passed client-side validation. No application was transmitted or stored on a server.</p><button onClick={() => {setData({...initial});setStep(0);setSubmitted(false);}}>Start another application</button><Link to="/dashboard-preview">Return to dashboard</Link></section></main>;
  return <main className="kyc-page">
    <header className="kyc-header"><Link to="/dashboard-preview">← Dashboard</Link><span>ClientHub / New application</span></header>
    <section className="kyc-card">
      <span className="kyc-kicker">KYC ONBOARDING · DEMO</span>
      <h1>New client application</h1><p className="kyc-description">Complete the four steps below. Drafts are stored only in your browser.</p>
      <div className="kyc-steps" aria-label="Form progress">{steps.map((label,index) => <div key={label} className={`kyc-step ${index===step?'active':''} ${index<step?'completed':''}`} aria-current={index===step?'step':undefined}><span>{index+1}</span><small>{label}</small></div>)}</div>
      <form onSubmit={submit} noValidate>
        <h2>{steps[step]}</h2>
        {step < 3 && <div className="kyc-fields">
          {fields[step].map(field => <label key={field.key}>{field.label}<input type={field.type || 'text'} value={data[field.key]} onChange={event=>update(field.key,event.target.value)} placeholder={field.placeholder || field.label} maxLength={field.key==='documentNumber'?50:150} autoComplete="off" /></label>)}
          {step===2 && <label>Document type<select value={data.documentType} onChange={event=>update('documentType',event.target.value)}><option value="">Select a document</option><option value="Passport">Passport</option><option value="Driving licence">Driving licence</option><option value="National ID">National ID</option></select></label>}
        </div>}
        {step===2 && <p className="kyc-hint">Use fictional data only. Do not enter real identity document numbers in this demo.</p>}
        {step===3 && <><dl className="kyc-review">{(Object.entries(data) as Array<[keyof KycData,string|boolean]>).filter(([key])=>key!=='declaration').map(([key,value])=><div key={key}><dt>{key.replace(/([A-Z])/g,' $1')}</dt><dd>{String(value)}</dd></div>)}</dl><label className="kyc-declaration"><input type="checkbox" checked={data.declaration} onChange={event=>update('declaration',event.target.checked)} /> I confirm that the sample information is accurate for this demonstration.</label></>}
        {error && <p className="kyc-alert" role="alert">{error}</p>}
        {message && <p className="kyc-notice" role="status">{message}</p>}
        <div className="kyc-actions"><button type="button" className="kyc-secondary" onClick={saveDraft}>Save draft</button><div className="kyc-navigation">{step>0 && <button type="button" className="kyc-secondary" onClick={()=>{setStep(value=>value-1);setError('');setMessage('');}}>Back</button>}{step<3?<button type="button" onClick={next}>Continue →</button>:<button type="submit">Submit demo application</button>}</div></div>
      </form>
    </section>
  </main>;
}

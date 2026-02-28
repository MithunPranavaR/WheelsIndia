import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Same UI design — rebuilt WITHOUT Tailwind.
// Pure CSS (embedded below) + semantic classNames.

const OPERATORS = ["Karthikeyan", "Thinakaran", "Jagan", "Sundar"];
const SOURCES = ["JSW", "TATA", "HYUN", "AMNS"];

const initialState = {
  operator_name: "",
  coil_no: "",
  source: "",
  size: "",
  ok_count: "",
  hold_count: "",
  rejection_count: "",
  diagonal_count: "",
};

export default function CoilProductionUI() {
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('coilForm');
      return saved ? JSON.parse(saved) : initialState;
    } catch {
      return initialState;
    }
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('coilForm', JSON.stringify(formData));
  }, [formData]);

  const total = [
    Number(formData.ok_count || 0),
    Number(formData.hold_count || 0),
    Number(formData.rejection_count || 0),
    Number(formData.diagonal_count || 0),
  ].reduce((a, b) => a + b, 0);

  const TARGET = 100;
  const progress = Math.min(100, Math.round((total / TARGET) * 100));

  const isValid =
    formData.operator_name &&
    formData.coil_no &&
    formData.source &&
    formData.size;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["ok_count", "hold_count", "rejection_count", "diagonal_count"].includes(name)) {
      const cleaned = value === '' ? '' : Math.max(0, Math.floor(Number(value)));
      setFormData((s) => ({ ...s, [name]: cleaned }));
    } else {
      setFormData((s) => ({ ...s, [name]: value }));
    }
  };

  const bump = (name, delta) => {
    setFormData((s) => {
      const next = Math.max(0, Number(s[name] || 0) + delta);
      return { ...s, [name]: next };
    });
  };

  const handleSubmit = async () => {
    if (!isValid) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/coil-entry/', formData);
      setToast({ type: 'success', message: 'Entry submitted successfully!' });
      setFormData(initialState);
    } catch {
      setToast({ type: 'error', message: 'Submission failed.' });
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleReport = () => {
    window.open('http://localhost:8000/daily-report/', '_blank');
  };

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>Wheels India</h1>
          <p>Coil Production Control — quick entry · low friction</p>
        </div>
        <div className="header-buttons">
          <button onClick={() => window.location.reload()}>⟳ Refresh</button>
          <button onClick={handleReport}>⬇ Daily Report</button>
        </div>
      </header>

      <div className="container">
        <div className="form-card">

          <div className="grid-2">
            <FieldSelect label="Operator" name="operator_name" value={formData.operator_name} onChange={handleChange} options={OPERATORS} />
            <FieldInput label="Coil Number" name="coil_no" value={formData.coil_no} onChange={handleChange} />
            <FieldSelect label="Source" name="source" value={formData.source} onChange={handleChange} options={SOURCES} />
            <FieldInput label="Size" name="size" value={formData.size} onChange={handleChange} />
          </div>

          <div className="metric-grid">
            <MetricCard title="OK" name="ok_count" value={formData.ok_count} onChange={handleChange} bump={bump} color="green" />
            <MetricCard title="HOLD" name="hold_count" value={formData.hold_count} onChange={handleChange} bump={bump} color="orange" />
            <MetricCard title="REJECTION" name="rejection_count" value={formData.rejection_count} onChange={handleChange} bump={bump} color="red" />
            <MetricCard title="DIAGONAL" name="diagonal_count" value={formData.diagonal_count} onChange={handleChange} bump={bump} color="blue" />
          </div>

          <div className="total-section">
            <div>
              <h3>Total Production</h3>
              <span className="total-number">{total}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="button-row">
            <button className="btn-secondary" onClick={() => setFormData(initialState)}>Cancel</button>
            <button className="btn-primary" disabled={!isValid || loading} onClick={handleSubmit}>
              {loading ? 'Submitting...' : 'Submit Entry'}
            </button>
          </div>

        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      <style>{`
        * { box-sizing: border-box; font-family: Inter, sans-serif; }
        body { margin: 0; }

        .app { background: linear-gradient(to bottom, #f8fafc, #ffffff); min-height: 100vh; }

        .header {
          background: linear-gradient(90deg, #4f46e5, #0ea5e9, #10b981);
          color: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h1 { margin: 0; font-size: 26px; }
        .header p { margin: 4px 0 0; opacity: 0.9; font-size: 14px; }

        .header-buttons button {
          margin-left: 10px;
          background: rgba(255,255,255,0.2);
          border: none;
          padding: 8px 14px;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }

        .form-card {
          background: white;
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }

        label { font-weight: 600; font-size: 14px; display: block; margin-bottom: 6px; }
        input, select {
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #d1d5db;
        }
        input:focus, select:focus { outline: none; border-color: #4f46e5; }

        .metric-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 30px;
        }

        .metric-card {
          padding: 20px;
          border-radius: 12px;
          color: white;
        }
        .metric-card.green { background: linear-gradient(135deg,#10b981,#059669); }
        .metric-card.orange { background: linear-gradient(135deg,#f59e0b,#d97706); }
        .metric-card.red { background: linear-gradient(135deg,#ef4444,#b91c1c); }
        .metric-card.blue { background: linear-gradient(135deg,#3b82f6,#1d4ed8); }

        .metric-card input { margin-top: 10px; font-size: 22px; font-weight: bold; background: rgba(255,255,255,0.2); color: white; border: none; }

        .stepper { margin-top: 8px; }
        .stepper button { margin-right: 5px; }

        .total-section { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; }
        .total-number { font-size: 32px; font-weight: bold; }

        .progress-bar { width: 60%; height: 12px; background: #e5e7eb; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg,#14b8a6,#10b981); }

        .button-row { margin-top: 30px; display: flex; gap: 15px; }
        .button-row button { flex: 1; padding: 12px; border-radius: 8px; border: none; cursor: pointer; }

        .btn-primary { background: #2563eb; color: white; }
        .btn-secondary { background: #9ca3af; color: white; }
        .btn-success { background: #059669; color: white; }

        .toast {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 14px 20px;
          border-radius: 10px;
          color: white;
        }
        .toast.success { background: #16a34a; }
        .toast.error { background: #dc2626; }
      `}</style>

    </div>
  );
}

function FieldInput({ label, name, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <input name={name} value={value} onChange={onChange} />
    </div>
  );
}

function FieldSelect({ label, name, value, onChange, options }) {
  return (
    <div>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MetricCard({ title, name, value, onChange, bump, color }) {
  return (
    <div className={`metric-card ${color}`}>
      <h4>{title}</h4>
      <input type="number" name={name} value={value} onChange={onChange} />
      <div className="stepper">
        <button onClick={() => bump(name,1)}>+</button>
        <button onClick={() => bump(name,-1)}>-</button>
      </div>
    </div>
  );
}

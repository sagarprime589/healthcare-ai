import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
];

const SPECIALTIES = [
  'All', 'General Physician', 'Cardiologist', 'Dermatologist', 'Orthopedic',
  'Gynecologist', 'Pediatrician', 'Neurologist', 'Psychiatrist', 'ENT Specialist',
  'Ophthalmologist', 'Endocrinologist',
];

function getNext7Days() {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      value: d.toISOString().split('T')[0],
    });
  }
  return days;
}

const avatarColors = ['#0f6e56', '#1d7a8a', '#7c3aed', '#db2777', '#b45309', '#047857', '#1d4ed8', '#9333ea'];

export default function Appointments() {
  const user = JSON.parse(localStorage.getItem('healthai_user') || 'null');
  const location = useLocation();
  const [tab, setTab] = useState('book');

  // Book tab state
  const [doctors, setDoctors] = useState([]);
  const [specialty, setSpecialty] = useState(location.state?.specialty || 'All');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].value);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState({ patientName: user?.name || '', patientAge: '', reason: '' });
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  // My appointments state
  const [myAppts, setMyAppts] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const days = getNext7Days();

  useEffect(() => {
    fetch(`${API}/api/doctors`)
      .then(r => r.json())
      .then(setDoctors)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedDoctor) return;
    setSlotsLoading(true);
    setSelectedSlot('');
    fetch(`${API}/api/doctors/${selectedDoctor._id}/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => { setAvailableSlots(data.available || []); setSlotsLoading(false); })
      .catch(() => setSlotsLoading(false));
  }, [selectedDoctor, selectedDate]);

  const loadMyAppts = () => {
    if (!user) return;
    setApptLoading(true);
    fetch(`${API}/api/appointments/${user.id}`)
      .then(r => r.json())
      .then(data => { setMyAppts(Array.isArray(data) ? data : []); setApptLoading(false); })
      .catch(() => setApptLoading(false));
  };

  useEffect(() => { if (tab === 'mine') loadMyAppts(); }, [tab]);

  const handleBook = async () => {
    if (!selectedSlot) { setBookingError('Please select a time slot.'); return; }
    if (!form.patientName.trim()) { setBookingError('Please enter patient name.'); return; }
    if (!form.patientAge.trim()) { setBookingError('Please enter age.'); return; }
    setBooking(true);
    setBookingError('');
    try {
      const res = await fetch(`${API}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          doctorId: selectedDoctor._id,
          date: selectedDate,
          slot: selectedSlot,
          patientName: form.patientName,
          patientAge: form.patientAge,
          reason: form.reason,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setBookingSuccess(`Appointment confirmed with ${selectedDoctor.name} on ${days.find(d => d.value === selectedDate)?.label} at ${selectedSlot}`);
      setSelectedSlot('');
      setAvailableSlots(prev => prev.filter(s => s !== selectedSlot));
    } catch (err) {
      setBookingError(err.message);
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      await fetch(`${API}/api/appointments/${id}/cancel`, { method: 'PATCH' });
      setMyAppts(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
    } catch {}
    setCancellingId(null);
  };

  const filtered = specialty === 'All' ? doctors : doctors.filter(d => d.specialty === specialty);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>
      <h2 style={{ margin: '0 0 4px' }}>Appointment Booking</h2>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
        Book a consultation with verified doctors. Get expert medical advice.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '28px', background: '#f5f7fa', borderRadius: '12px', padding: '4px', width: 'fit-content' }}>
        {['book', 'mine'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 24px', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            background: tab === t ? '#0f6e56' : 'transparent',
            color: tab === t ? '#fff' : '#666',
            transition: 'all 0.2s',
          }}>
            {t === 'book' ? '🔍 Find Doctors' : '📋 My Appointments'}
          </button>
        ))}
      </div>

      {/* ── BOOK TAB ── */}
      {tab === 'book' && (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Left: Doctor list */}
          <div style={{ flex: '1', minWidth: '280px' }}>
            {/* Specialty filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
              {SPECIALTIES.map(s => (
                <button key={s} onClick={() => { setSpecialty(s); setSelectedDoctor(null); setBookingSuccess(''); }} style={{
                  padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: '1px solid',
                  background: specialty === s ? '#0f6e56' : '#fff',
                  color: specialty === s ? '#fff' : '#555',
                  borderColor: specialty === s ? '#0f6e56' : '#d1d5db',
                }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.length === 0 && <p style={{ color: '#888', fontSize: '14px' }}>Loading doctors...</p>}
              {filtered.map((doc, i) => (
                <div key={doc._id} onClick={() => { setSelectedDoctor(doc); setBookingSuccess(''); setBookingError(''); }}
                  style={{
                    background: selectedDoctor?._id === doc._id ? '#e1f5ee' : '#fff',
                    border: `1px solid ${selectedDoctor?._id === doc._id ? '#0f6e56' : '#e5e7eb'}`,
                    borderRadius: '12px', padding: '14px 16px', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      background: avatarColors[i % avatarColors.length],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: '14px', fontWeight: '700',
                    }}>
                      {doc.avatar || doc.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#111' }}>{doc.name}</div>
                      <div style={{ fontSize: '12px', color: '#0f6e56', fontWeight: '500' }}>{doc.specialty}</div>
                      <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                        📍 {doc.location} · {doc.experience} yrs exp · ⭐ {doc.rating}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: '700', color: '#0f6e56', fontSize: '15px' }}>₹{doc.fees}</div>
                      <div style={{ fontSize: '11px', color: '#aaa' }}>per visit</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking panel */}
          {selectedDoctor && (
            <div style={{ width: '320px', flexShrink: 0 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px' }}>
                <div style={{ background: '#0f6e56', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', color: '#fff' }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{selectedDoctor.name}</div>
                  <div style={{ fontSize: '12px', opacity: 0.85 }}>{selectedDoctor.specialty} · ₹{selectedDoctor.fees}</div>
                </div>

                {bookingSuccess && (
                  <div style={{ background: '#e1f5ee', border: '1px solid #1d9e75', color: '#0f6e56', padding: '12px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px', lineHeight: '1.5' }}>
                    ✓ {bookingSuccess}
                    <br /><span style={{ fontSize: '12px', opacity: 0.8 }}>Go to "My Appointments" to view.</span>
                  </div>
                )}
                {bookingError && (
                  <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', color: '#cc0000', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
                    ⚠ {bookingError}
                  </div>
                )}

                {/* Date selection */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={label}>Select Date</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {days.map(d => (
                      <button key={d.value} onClick={() => setSelectedDate(d.value)} style={{
                        padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: '1px solid',
                        background: selectedDate === d.value ? '#0f6e56' : '#f5f7fa',
                        color: selectedDate === d.value ? '#fff' : '#555',
                        borderColor: selectedDate === d.value ? '#0f6e56' : '#e5e7eb',
                      }}>
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slots */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={label}>Available Slots {slotsLoading && <span style={{ color: '#888', fontWeight: '400' }}>(loading...)</span>}</label>
                  {!slotsLoading && availableSlots.length === 0 && (
                    <p style={{ color: '#cc0000', fontSize: '13px', margin: '4px 0' }}>No slots available for this date.</p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {availableSlots.map(s => (
                      <button key={s} onClick={() => setSelectedSlot(s)} style={{
                        padding: '7px 4px', borderRadius: '8px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', border: '1px solid',
                        background: selectedSlot === s ? '#0f6e56' : '#f5f7fa',
                        color: selectedSlot === s ? '#fff' : '#333',
                        borderColor: selectedSlot === s ? '#0f6e56' : '#e5e7eb',
                      }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Patient form */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={label}>Patient Name</label>
                  <input value={form.patientName} onChange={e => setForm(f => ({ ...f, patientName: e.target.value }))}
                    placeholder="Full name" style={input} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={label}>Age</label>
                  <input value={form.patientAge} onChange={e => setForm(f => ({ ...f, patientAge: e.target.value }))}
                    placeholder="e.g. 25" style={input} type="number" min="1" max="120" />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={label}>Reason for Visit <span style={{ color: '#aaa', fontWeight: '400' }}>(optional)</span></label>
                  <textarea value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="Brief description of symptoms..." style={{ ...input, height: '72px', resize: 'vertical' }} />
                </div>

                <button onClick={handleBook} disabled={booking || !selectedSlot} style={{
                  width: '100%', padding: '12px', background: '#0f6e56', color: '#fff', border: 'none',
                  borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: booking || !selectedSlot ? 'not-allowed' : 'pointer',
                  opacity: booking || !selectedSlot ? 0.6 : 1,
                }}>
                  {booking ? 'Booking...' : `Confirm Appointment · ₹${selectedDoctor.fees}`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── MY APPOINTMENTS TAB ── */}
      {tab === 'mine' && (
        <div>
          {apptLoading && <p style={{ color: '#888' }}>Loading appointments...</p>}
          {!apptLoading && myAppts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
              <p style={{ fontSize: '15px', marginBottom: '8px' }}>No appointments yet</p>
              <button onClick={() => setTab('book')} style={{ padding: '10px 24px', background: '#0f6e56', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>
                Book Your First Appointment
              </button>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myAppts.map(a => (
              <div key={a._id} style={{
                background: '#fff', border: `1px solid ${a.status === 'cancelled' ? '#ffcccc' : a.status === 'completed' ? '#d1fae5' : '#e5e7eb'}`,
                borderRadius: '12px', padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#111', marginBottom: '4px' }}>{a.doctorName}</div>
                    <div style={{ fontSize: '13px', color: '#0f6e56', marginBottom: '6px' }}>{a.specialty}</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>
                      📅 {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      &nbsp;&nbsp;🕐 {a.slot}
                    </div>
                    <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>
                      👤 {a.patientName}, {a.patientAge} yrs &nbsp;·&nbsp; 📍 {a.location} &nbsp;·&nbsp; ₹{a.fees}
                    </div>
                    {a.reason && <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Reason: {a.reason}</div>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                      background: a.status === 'cancelled' ? '#fff0f0' : a.status === 'completed' ? '#d1fae5' : '#e1f5ee',
                      color: a.status === 'cancelled' ? '#cc0000' : a.status === 'completed' ? '#047857' : '#0f6e56',
                    }}>
                      {a.status === 'upcoming' ? '✓ Upcoming' : a.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
                    </span>
                    {a.status === 'upcoming' && (
                      <button onClick={() => handleCancel(a._id)} disabled={cancellingId === a._id} style={{
                        padding: '5px 14px', background: '#fff', color: '#cc0000', border: '1px solid #ffcccc',
                        borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                      }}>
                        {cancellingId === a._id ? '...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const label = { display: 'block', fontSize: '12px', fontWeight: '600', color: '#555', marginBottom: '6px' };
const input = { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

import { useState } from 'react';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const TYPE_LABEL = { hospital: 'Hospital', clinic: 'Clinic', doctors: "Doctor's", pharmacy: 'Pharmacy' };
const TYPE_COLOR = { hospital: '#ef4444', clinic: '#3b82f6', doctors: '#10b981', pharmacy: '#8b5cf6' };
const TYPE_ICON  = { hospital: '🏥', clinic: '🩺', doctors: '👨‍⚕️', pharmacy: '💊' };

export default function NearbyHospitals({ urgencyLevel }) {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error | denied
  const [hospitals, setHospitals] = useState([]);
  const [coords, setCoords] = useState(null);

  const isUrgent = ['high', 'critical'].includes(urgencyLevel?.toLowerCase());

  const findHospitals = () => {
    if (!navigator.geolocation) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: pos }) => {
        const { latitude: lat, longitude: lon } = pos;
        setCoords({ lat, lon });
        try {
          const query =
            `[out:json][timeout:20];` +
            `(node["amenity"~"^(hospital|clinic|doctors|pharmacy)$"](around:5000,${lat},${lon});` +
            `way["amenity"~"^(hospital|clinic)$"](around:5000,${lat},${lon}););` +
            `out center;`;
          const res = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
          );
          const json = await res.json();
          const results = json.elements
            .map(el => ({
              id: el.id,
              name: el.tags?.name || el.tags?.['name:en'] || '',
              type: el.tags?.amenity || 'hospital',
              lat: el.lat ?? el.center?.lat,
              lon: el.lon ?? el.center?.lon,
              phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
            }))
            .filter(h => h.name && h.lat && h.lon)
            .map(h => ({ ...h, distance: haversine(lat, lon, h.lat, h.lon) }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 8);
          setHospitals(results);
          setStatus('done');
        } catch {
          setStatus('error');
        }
      },
      () => setStatus('denied'),
      { timeout: 10000 }
    );
  };

  /* ── IDLE ── */
  if (status === 'idle') {
    return (
      <div style={{
        background: isUrgent ? 'linear-gradient(135deg,#fff1f2,#ffe4e6)' : '#fff',
        border: `1.5px solid ${isUrgent ? '#fecdd3' : '#e5e7eb'}`,
        borderRadius: '16px', padding: '20px 24px', marginBottom: '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px', height: '46px', flexShrink: 0, borderRadius: '12px',
            background: isUrgent ? '#fee2e2' : '#e1f5ee',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
          }}>🏥</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '15px', color: '#111', marginBottom: '3px' }}>
              Find Nearby Hospitals &amp; Clinics
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {isUrgent
                ? 'Your urgency is high — locate the nearest medical facility immediately'
                : 'Discover hospitals and clinics near your current location'}
            </div>
          </div>
        </div>
        <button
          onClick={findHospitals}
          style={{
            padding: '11px 22px', border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
            background: isUrgent ? '#ef4444' : '#0f6e56', color: '#fff',
          }}
        >
          {isUrgent ? '🚨 Find Now' : '📍 Find Nearby'}
        </button>
      </div>
    );
  }

  /* ── LOADING ── */
  if (status === 'loading') {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
        padding: '32px', marginBottom: '16px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '36px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>📡</div>
        <div style={{ fontWeight: '600', color: '#111', fontSize: '15px' }}>Finding nearby facilities…</div>
        <div style={{ color: '#888', fontSize: '13px', marginTop: '6px' }}>
          Getting your location and searching within 5 km
        </div>
      </div>
    );
  }

  /* ── DENIED ── */
  if (status === 'denied') {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
        padding: '20px 24px', marginBottom: '16px',
        display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '28px' }}>🔒</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', color: '#111', marginBottom: '4px' }}>Location access denied</div>
          <div style={{ fontSize: '13px', color: '#666' }}>
            Allow location access in your browser settings, then try again.
          </div>
        </div>
        <button onClick={findHospitals} style={retryBtn}>Retry</button>
      </div>
    );
  }

  /* ── ERROR ── */
  if (status === 'error') {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
        padding: '20px 24px', marginBottom: '16px',
        display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <div style={{ fontSize: '28px' }}>⚠️</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '600', color: '#111', marginBottom: '4px' }}>Could not fetch nearby facilities</div>
          <div style={{ fontSize: '13px', color: '#666' }}>Check your internet connection and try again.</div>
        </div>
        <button onClick={findHospitals} style={retryBtn}>Retry</button>
      </div>
    );
  }

  /* ── DONE ── */
  const mapsSearchUrl = coords
    ? `https://www.google.com/maps/search/hospital+clinic+near+me/@${coords.lat},${coords.lon},14z`
    : '#';

  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px',
      padding: '20px', marginBottom: '16px', boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🏥</span>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Nearby Hospitals &amp; Clinics
          </h3>
          <span style={{ background: '#e1f5ee', color: '#0f6e56', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>
            {hospitals.length} found
          </span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '12px', color: '#0f6e56', fontWeight: '600', textDecoration: 'none' }}
          >
            View all on Maps →
          </a>
          <button onClick={findHospitals} style={{ ...retryBtn, padding: '6px 12px', fontSize: '12px' }}>Refresh</button>
        </div>
      </div>

      {/* Map iframe */}
      {coords && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
          <iframe
            title="Nearby Hospitals Map"
            width="100%"
            height="200"
            style={{ display: 'block', border: 'none' }}
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lon - 0.065},${coords.lat - 0.04},${coords.lon + 0.065},${coords.lat + 0.04}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
            loading="lazy"
          />
          <div style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb', padding: '6px 12px', fontSize: '11px', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>📍 Your location (map center) — hospitals listed below</span>
            <a href={mapsSearchUrl} target="_blank" rel="noreferrer" style={{ color: '#0f6e56', fontWeight: '600', textDecoration: 'none', fontSize: '11px' }}>
              Open Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Hospital list */}
      {hospitals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#888', fontSize: '14px' }}>
          No named facilities found within 5 km.<br />
          <a href={mapsSearchUrl} target="_blank" rel="noreferrer" style={{ color: '#0f6e56', fontWeight: '600', textDecoration: 'none', marginTop: '8px', display: 'inline-block' }}>
            Search on Google Maps →
          </a>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {hospitals.map((h, idx) => {
            const col = TYPE_COLOR[h.type] || '#0f6e56';
            const icon = TYPE_ICON[h.type] || '🏥';
            const label = TYPE_LABEL[h.type] || 'Facility';
            const distText = h.distance < 1
              ? `${Math.round(h.distance * 1000)} m`
              : `${h.distance.toFixed(1)} km`;
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`;
            return (
              <div key={h.id} style={{
                display: 'flex', gap: '12px', alignItems: 'center',
                padding: '12px 14px', background: idx === 0 ? '#f0fdf8' : '#f8fafc',
                borderRadius: '12px',
                border: `1px solid ${idx === 0 ? '#d1fae5' : '#e5e7eb'}`,
              }}>
                <div style={{
                  width: '38px', height: '38px', flexShrink: 0, borderRadius: '10px',
                  background: col, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '17px',
                }}>
                  {icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {h.name}
                    </span>
                    {idx === 0 && (
                      <span style={{ fontSize: '10px', background: '#0f6e56', color: '#fff', padding: '1px 6px', borderRadius: '20px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        NEAREST
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: col + '1a', color: col, padding: '2px 7px', borderRadius: '20px', fontWeight: '600' }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#666' }}>📍 {distText} away</span>
                    {h.phone && (
                      <a href={`tel:${h.phone}`} style={{ fontSize: '11px', color: '#0f6e56', textDecoration: 'none', fontWeight: '500' }}>
                        📞 {h.phone}
                      </a>
                    )}
                  </div>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 14px', background: '#0f6e56', color: '#fff',
                    borderRadius: '9px', fontSize: '12px', fontWeight: '600',
                    textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  Directions →
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Emergency call strip for high/critical */}
      {isUrgent && (
        <div style={{
          marginTop: '14px', background: 'linear-gradient(135deg,#fff1f2,#ffe4e6)',
          border: '1px solid #fecdd3', borderRadius: '12px',
          padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '10px',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#9f1239' }}>
            🚑 Life-threatening emergency? Call an ambulance immediately.
          </span>
          <a
            href="tel:108"
            style={{
              padding: '7px 16px', background: '#ef4444', color: '#fff',
              borderRadius: '8px', fontSize: '13px', fontWeight: '700',
              textDecoration: 'none', whiteSpace: 'nowrap',
            }}
          >
            Call 108 🚨
          </a>
        </div>
      )}
    </div>
  );
}

const retryBtn = {
  padding: '9px 18px', background: '#0f6e56', color: '#fff',
  border: 'none', borderRadius: '9px', fontSize: '13px',
  fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap',
};

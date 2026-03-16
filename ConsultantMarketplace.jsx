import React, { useState } from 'react';

const CONSULTANTS = [
  {
    id: 1, name: 'Pandit Ramesh Sharma', photo: '🧙', rating: 4.9, reviews: 312,
    specialty: 'Vedic Kundali & Dasha Analysis', languages: ['Hindi', 'English'],
    price: 799, duration: '45 min', badges: ['Verified', 'Top Rated'],
    experience: '28 years', location: 'Varanasi, India',
    bio: 'Master in Parashari Jyotish and Prashna Kundali. Renowned for accurate life predictions.',
  },
  {
    id: 2, name: 'Dr. Meenakshi Iyer', photo: '👩‍🔬', rating: 4.8, reviews: 187,
    specialty: 'Marriage Muhurta & Compatibility', languages: ['Tamil', 'English', 'Telugu'],
    price: 1200, duration: '60 min', badges: ['Verified', 'Marriage Expert'],
    experience: '15 years', location: 'Chennai, India',
    bio: 'PhD in Vedic Mathematics and Astrology. Specialist in Ashtakoot compatibility and timing.',
  },
  {
    id: 3, name: 'Acharya Vijay Gupta', photo: '🕉️', rating: 4.7, reviews: 429,
    specialty: 'Karma Healing & Remedies', languages: ['Hindi', 'Sanskrit'],
    price: 599, duration: '30 min', badges: ['Remedies Expert'],
    experience: '22 years', location: 'Delhi, India',
    bio: 'Specializes in identifying and resolving karmic blockages through customized pujas and mantras.',
  },
  {
    id: 4, name: 'Jyotishi Priya Nair', photo: '🌙', rating: 4.8, reviews: 156,
    specialty: 'Career & Finance Astrology', languages: ['Malayalam', 'English'],
    price: 1500, duration: '60 min', badges: ['Verified', 'Finance Expert'],
    experience: '12 years', location: 'Kochi, India',
    bio: 'Corporate astrology consultant. Advises businesses and individuals on career timing and investment periods.',
  },
  {
    id: 5, name: 'Pandit Suresh Tripathi', photo: '🌟', rating: 4.6, reviews: 98,
    specialty: 'Vastu & Feng Shui', languages: ['Hindi', 'English'],
    price: 2000, duration: '90 min', badges: ['Vastu Expert'],
    experience: '18 years', location: 'Jaipur, India',
    bio: 'Combines traditional Vastu Shastra with modern space analysis for home and business success.',
  },
  {
    id: 6, name: 'Dr. Kavitha Reddy', photo: '🔮', rating: 4.9, reviews: 264,
    specialty: 'Past Life & Spiritual Healing', languages: ['Telugu', 'English'],
    price: 1800, duration: '75 min', badges: ['Verified', 'Spiritual Healer'],
    experience: '20 years', location: 'Hyderabad, India',
    bio: 'Integrates Jyotish, Pranic healing, and past-life regression for deep spiritual transformation.',
  },
];

const SPECIALTIES = ['All', 'Kundali', 'Marriage', 'Career', 'Remedies', 'Vastu', 'Spiritual'];

export default function ConsultantMarketplace() {
  const [filter, setFilter] = useState('All');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [booked, setBooked] = useState(null);

  const filtered = filter === 'All'
    ? CONSULTANTS
    : CONSULTANTS.filter(c => c.specialty.toLowerCase().includes(filter.toLowerCase()));

  function handleBook(consultant) {
    setBooked(consultant);
    setTimeout(() => setBooked(null), 4000);
  }

  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h3 style={{
        color: '#A78BFA', fontSize: '1.1rem', marginBottom: '0.5rem',
        letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center',
      }}>
        🌟 Astrology Consultants
      </h3>
      <p style={{ color: '#6B7280', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
        Connect with verified Vedic astrology experts
      </p>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        marginBottom: '1.2rem', justifyContent: 'center',
      }}>
        {SPECIALTIES.map(spec => (
          <button
            key={spec}
            onClick={() => setFilter(spec)}
            style={{
              padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '12px', fontWeight: '600',
              background: filter === spec ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${filter === spec ? '#7C3AED' : 'rgba(255,255,255,0.1)'}`,
              color: filter === spec ? '#E2D9F3' : '#9CA3AF',
              transition: 'all 0.2s',
            }}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Booking confirmation toast */}
      {booked && (
        <div style={{
          background: 'rgba(16,185,129,0.2)', border: '1px solid #10B981',
          borderRadius: '8px', padding: '10px 14px', marginBottom: '1rem',
          color: '#6EE7B7', fontSize: '0.88rem', textAlign: 'center',
          animation: 'fadeIn 0.3s ease',
        }}>
          ✅ Booking request sent to {booked.name}! They will confirm shortly.
        </div>
      )}

      {/* Consultants grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(consultant => (
          <div
            key={consultant.id}
            style={{
              background: selectedConsultant?.id === consultant.id
                ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selectedConsultant?.id === consultant.id ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '12px', padding: '1rem',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onClick={() => setSelectedConsultant(selectedConsultant?.id === consultant.id ? null : consultant)}
          >
            {/* Header row */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px',
                border: '2px solid rgba(124,58,237,0.4)',
              }}>
                {consultant.photo}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: '#E2D9F3', margin: '0 0 2px', fontSize: '0.95rem' }}>
                      {consultant.name}
                    </h4>
                    <div style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
                      {consultant.specialty}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#FBBF24', fontSize: '0.88rem', fontWeight: 'bold' }}>
                      ★ {consultant.rating}
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '0.72rem' }}>
                      {consultant.reviews} reviews
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {consultant.badges.map(badge => (
                    <span key={badge} style={{
                      background: badge === 'Verified' ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.15)',
                      border: `1px solid ${badge === 'Verified' ? 'rgba(16,185,129,0.3)' : 'rgba(124,58,237,0.3)'}`,
                      color: badge === 'Verified' ? '#6EE7B7' : '#A78BFA',
                      fontSize: '10px', padding: '1px 8px', borderRadius: '20px',
                    }}>
                      {badge === 'Verified' ? '✓ ' : '⭐ '}{badge}
                    </span>
                  ))}
                  {consultant.languages.map(lang => (
                    <span key={lang} style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#6B7280', fontSize: '10px', padding: '1px 8px', borderRadius: '20px',
                    }}>
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {selectedConsultant?.id === consultant.id && (
              <div style={{ marginTop: '12px', animation: 'fadeIn 0.3s ease' }}>
                <p style={{ color: '#D1D5DB', fontSize: '0.85rem', lineHeight: '1.6', margin: '0 0 12px' }}>
                  {consultant.bio}
                </p>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.07)',
                }}>
                  <div>
                    <span style={{ color: '#E2D9F3', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      ₹{consultant.price}
                    </span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.82rem' }}> / {consultant.duration}</span>
                    <div style={{ color: '#6B7280', fontSize: '0.78rem' }}>
                      {consultant.experience} experience · {consultant.location}
                    </div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleBook(consultant); }}
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
                      border: 'none', color: '#fff', padding: '8px 20px',
                      borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold',
                      fontSize: '0.9rem', transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
                    }}
                  >
                    Book Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ color: '#374151', textAlign: 'center', fontSize: '0.78rem', marginTop: '1.5rem' }}>
        🔒 All consultants verified · Secure payments · 100% satisfaction guarantee
      </p>

      <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(6px); } to { opacity:1; transform: none; } }`}</style>
    </div>
  );
}

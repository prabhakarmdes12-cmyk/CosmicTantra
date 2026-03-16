import React, { useRef, useMemo, Suspense, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { callGuruAPI } from '../engines/guruAI.js';

const NAVAGRAHA = [
  { name: 'Sun',     distance: 0,   size: 0.58, color: '#FF9933', emissive: '#FF6600', speed: 0,    y: 0,    sanskrit: 'Surya',   deity: 'Surya Dev',   element: 'Fire',  day: 'Sunday'   },
  { name: 'Moon',    distance: 1.7, size: 0.24, color: '#C8D8F0', emissive: '#90B0D8', speed: 0.9,  y: 0.1,  sanskrit: 'Chandra', deity: 'Chandra Dev', element: 'Water', day: 'Monday'   },
  { name: 'Mercury', distance: 2.5, size: 0.18, color: '#C8B890', emissive: '#907850', speed: 0.7,  y: -0.2, sanskrit: 'Budha',   deity: 'Budha Dev',   element: 'Earth', day: 'Wednesday'},
  { name: 'Venus',   distance: 3.3, size: 0.27, color: '#FFE0B0', emissive: '#FF9000', speed: 0.5,  y: 0.15, sanskrit: 'Shukra',  deity: 'Shukra Dev',  element: 'Water', day: 'Friday'   },
  { name: 'Mars',    distance: 4.2, size: 0.22, color: '#FF4444', emissive: '#CC0000', speed: 0.4,  y: -0.1, sanskrit: 'Mangala', deity: 'Karttikeya',  element: 'Fire',  day: 'Tuesday'  },
  { name: 'Jupiter', distance: 5.4, size: 0.48, color: '#E8C49A', emissive: '#D2691E', speed: 0.2,  y: 0.2,  sanskrit: 'Guru',    deity: 'Brihaspati',  element: 'Ether', day: 'Thursday' },
  { name: 'Saturn',  distance: 6.6, size: 0.40, color: '#E8D9AA', emissive: '#B8A878', speed: 0.15, y: -0.1, sanskrit: 'Shani',   deity: 'Shani Dev',   element: 'Air',   day: 'Saturday' },
  { name: 'Rahu',    distance: 7.8, size: 0.20, color: '#AA44FF', emissive: '#7700CC', speed: -0.1, y: 0.3,  sanskrit: 'Rahu',    deity: 'Rahu Graha',  element: 'Air',   day: 'Saturday' },
  { name: 'Ketu',    distance: 7.8, size: 0.20, color: '#CC8844', emissive: '#994422', speed: -0.1, y: -0.3, sanskrit: 'Ketu',    deity: 'Ketu Graha',  element: 'Fire',  day: 'Tuesday'  },
];

const PLANET_WISDOM = {
  Sun: {
    mantra: 'Om Hraam Hreem Hraum Sah Suryaya Namah',
    meaning: 'The cosmic soul — representing your ego, vitality, father, authority and divine light. The Sun is the Atmakaraka, significator of the Self.',
    karmic: 'Your Sun placement reveals where your soul seeks recognition. It is the throne of your consciousness — the light you are destined to shine in this lifetime.',
    transit: 'The Sun transits each sign for ~30 days, illuminating that house with energy, clarity and leadership opportunities.',
    gemstone: 'Ruby (Manikya)',
    qualities: ['Soul', 'Vitality', 'Authority', 'Father', 'Ego', 'Dharma'],
  },
  Moon: {
    mantra: 'Om Shraam Shreem Shraum Sah Chandraya Namah',
    meaning: 'The cosmic mind — governing emotions, mother, home, intuition and the subconscious. The Moon is your inner world made visible.',
    karmic: 'Your Moon nakshatra is the fingerprint of your soul. It reveals your emotional nature, past life tendencies, and deepest needs across incarnations.',
    transit: 'The Moon transits each sign every 2.5 days, creating daily emotional tides and influencing moods, dreams and intuition.',
    gemstone: 'Pearl (Moti)',
    qualities: ['Mind', 'Emotions', 'Mother', 'Intuition', 'Memory', 'Nurturing'],
  },
  Mars: {
    mantra: 'Om Kraam Kreem Kraum Sah Bhaumaaya Namah',
    meaning: 'The cosmic warrior — governing courage, energy, siblings, property and physical strength. Mars is your will made manifest in the world.',
    karmic: 'Where Mars sits lies your battlefield. Past-life warrior energy is stored here — to be channeled with wisdom, not aggression.',
    transit: 'Mars transits each sign for ~45 days, bringing energy, drive and possible conflicts to that life area.',
    gemstone: 'Red Coral (Moonga)',
    qualities: ['Courage', 'Energy', 'Passion', 'Strength', 'Siblings', 'Property'],
  },
  Mercury: {
    mantra: 'Om Braam Breem Braum Sah Budhaya Namah',
    meaning: 'The cosmic messenger — governing intellect, communication, business, education and wit. Mercury bridges the inner and outer worlds.',
    karmic: 'Mercury reveals how your past-life intelligence manifests now. It shows the karmic gifts and debts of knowledge accumulated across lifetimes.',
    transit: 'Mercury transits each sign in 14-30 days. Retrograde periods resurface past communications for review and healing.',
    gemstone: 'Emerald (Panna)',
    qualities: ['Intellect', 'Speech', 'Trade', 'Learning', 'Logic', 'Youth'],
  },
  Jupiter: {
    mantra: 'Om Graam Greem Graum Sah Guruve Namah',
    meaning: 'The cosmic teacher — the great benefic governing wisdom, dharma, children, prosperity and spiritual growth. Jupiter is divine grace itself.',
    karmic: 'Jupiter shows where your soul has accumulated the greatest merit across lifetimes. Its blessings are earned wisdom flowing forward.',
    transit: 'Jupiter spends ~1 year in each sign (Guru Peyarchi), bringing expansion, blessings and spiritual growth to that house.',
    gemstone: 'Yellow Sapphire (Pukhraj)',
    qualities: ['Wisdom', 'Dharma', 'Prosperity', 'Children', 'Guru', 'Grace'],
  },
  Venus: {
    mantra: 'Om Draam Dreem Draum Sah Shukraya Namah',
    meaning: "The cosmic beloved — governing love, beauty, luxury, arts, marriage and material pleasures. Venus is the nectar of existence.",
    karmic: "Venus holds your soul's deepest desires and the karma of relationships. It reveals what you love, attract, and must learn through union.",
    transit: 'Venus transits each sign for ~23 days, bringing love and harmony. Retrograde revisits past relationships for healing.',
    gemstone: 'Diamond (Heera)',
    qualities: ['Love', 'Beauty', 'Luxury', 'Arts', 'Marriage', 'Pleasure'],
  },
  Saturn: {
    mantra: 'Om Praam Preem Praum Sah Shanaischaraya Namah',
    meaning: 'The cosmic judge — the great teacher governing karma, discipline, longevity, delays and spiritual liberation. Saturn is time itself.',
    karmic: "Saturn shows where your soul carries its heaviest karmic debt. Its challenges are not punishment — they are the curriculum your soul chose to master.",
    transit: 'Saturn spends 2.5 years in each sign. Sade Sati (near natal Moon) brings deep tests and ultimately profound transformation.',
    gemstone: 'Blue Sapphire (Neelam)',
    qualities: ['Karma', 'Discipline', 'Longevity', 'Service', 'Patience', 'Justice'],
  },
  Rahu: {
    mantra: 'Om Bhram Bhreem Bhraum Sah Rahave Namah',
    meaning: 'The cosmic obsession — shadow planet governing ambition, illusion, foreign lands, technology and radical transformation. Rahu breaks all boundaries.',
    karmic: 'Rahu marks where your soul is moving toward in this life. It represents unfulfilled past-life desires — the dharmic frontier your soul must explore.',
    transit: 'Rahu transits each sign for 18 months. Where it sits, intense karmic activity, sudden events and profound transformation occur.',
    gemstone: 'Hessonite (Gomed)',
    qualities: ['Obsession', 'Ambition', 'Illusion', 'Technology', 'Foreign', 'Innovation'],
  },
  Ketu: {
    mantra: 'Om Shraam Shreem Shraum Sah Ketave Namah',
    meaning: "The cosmic liberation — shadow planet governing past-life mastery, spirituality, detachment and moksha. Ketu dissolves the ego.",
    karmic: "Ketu reveals what your soul has already mastered in past lives. Its house shows where you naturally excel — and where detachment brings true freedom.",
    transit: 'Always opposite Rahu, Ketu brings spiritual insights, liberating losses and completion of karmic cycles wherever it transits.',
    gemstone: "Cat's Eye (Lehsunia)",
    qualities: ['Liberation', 'Past life', 'Spirituality', 'Detachment', 'Moksha', 'Wisdom'],
  },
};

const PLANET_ICONS = { Sun:'☀️', Moon:'🌙', Mars:'♂', Mercury:'☿', Jupiter:'♃', Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋' };

// ─── GLOW SPHERE ──────────────────────────────────────────────────────────────
function GlowSphere({ size, color, isSelected, isHovered }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pulse = Math.sin(t * 1.8) * 0.12 + 0.88;
    ref.current.material.opacity = (isSelected ? 0.38 : isHovered ? 0.22 : 0.09) * pulse;
    ref.current.scale.setScalar((isSelected ? 1.9 : isHovered ? 1.55 : 1.32) * (pulse * 0.06 + 0.94));
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size * 1.45, 14, 14]} />
      <meshBasicMaterial color={color} transparent opacity={0.09} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// ─── SELECTION RING ───────────────────────────────────────────────────────────
function SelectionRing({ size, color }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.8;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[size * 2.4, 0.025, 6, 48]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

// ─── PLANET ───────────────────────────────────────────────────────────────────
function Planet({ planet, onSelect, isSelected }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const offset = useMemo(() => Math.random() * Math.PI * 2, [planet.name]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current && planet.distance > 0) {
      const a = t * planet.speed * 0.3 + offset;
      groupRef.current.position.x = Math.cos(a) * planet.distance;
      groupRef.current.position.z = Math.sin(a) * planet.distance;
      groupRef.current.position.y = planet.y + Math.sin(t * 0.18 + offset) * 0.06;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.004 * (Math.abs(planet.speed) + 0.3);
      if (isSelected) {
        const s = 1 + Math.sin(t * 3.5) * 0.07;
        meshRef.current.scale.setScalar(s);
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.12 : 1);
      }
      meshRef.current.material.emissiveIntensity = isSelected ? 2.0 : hovered ? 1.1 : planet.name === 'Sun' ? 1.3 : 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[planet.distance, planet.y, 0]}>
      <mesh
        ref={meshRef}
        onClick={e => { e.stopPropagation(); onSelect(planet); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[planet.size, 22, 22]} />
        <meshStandardMaterial
          color={planet.color} emissive={planet.emissive}
          emissiveIntensity={planet.name === 'Sun' ? 1.3 : 0.35}
          roughness={0.5} metalness={0.15}
        />
      </mesh>

      <GlowSphere size={planet.size} color={planet.color} isSelected={isSelected} isHovered={hovered} />
      {isSelected && <SelectionRing size={planet.size} color={planet.color} />}

      {planet.name === 'Saturn' && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[planet.size * 1.7, planet.size * 0.15, 6, 48]} />
          <meshStandardMaterial color="#D4C090" transparent opacity={0.65}
            emissive="#D4C090" emissiveIntensity={isSelected ? 0.5 : 0.12} />
        </mesh>
      )}
      {planet.name === 'Sun' && (
        <>
          <mesh><sphereGeometry args={[planet.size * 1.55, 14, 14]} /><meshStandardMaterial color="#FF9933" transparent opacity={0.12} side={THREE.BackSide} /></mesh>
          <mesh><sphereGeometry args={[planet.size * 2.1, 10, 10]} /><meshStandardMaterial color="#FF6600" transparent opacity={0.05} side={THREE.BackSide} /></mesh>
        </>
      )}

      <Billboard position={[0, planet.size + 0.48, 0]}>
        <Text fontSize={0.16} color={isSelected ? '#fff' : (hovered ? '#fff' : planet.color)}
          anchorX="center" anchorY="bottom" outlineWidth={0.025} outlineColor="#000010">
          {hovered || isSelected ? planet.sanskrit : planet.name}
        </Text>
      </Billboard>
    </group>
  );
}

// ─── LIGHTS ───────────────────────────────────────────────────────────────────
function Lights() {
  return (
    <>
      <pointLight position={[0,0,0]} intensity={4.5} color="#FF9933" distance={24} decay={2} />
      <pointLight position={[0,10,0]} intensity={0.6} color="#7C3AED" distance={35} decay={2} />
      <ambientLight intensity={0.18} color="#0D0A2E" />
      <hemisphereLight args={['#0D0A2E','#000000',0.3]} />
    </>
  );
}

// ─── ORBIT RINGS ─────────────────────────────────────────────────────────────
function OrbitRings({ selected }) {
  return NAVAGRAHA.filter(p => p.distance > 0).map(p => (
    <mesh key={p.name} rotation={[Math.PI/2,0,0]}>
      <torusGeometry args={[p.distance, 0.012, 4, 80]} />
      <meshBasicMaterial color={selected?.name === p.name ? p.color : '#ffffff'}
        transparent opacity={selected?.name === p.name ? 0.28 : 0.05} />
    </mesh>
  ));
}

// ─── COSMIC DUST ─────────────────────────────────────────────────────────────
function CosmicDust() {
  const { positions, colors } = useMemo(() => {
    const n = 2000;
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    const palette = [[0.49,0.23,0.93],[0.96,0.62,0.04],[0.8,0.85,1.0]];
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 22;
      positions[i*3] = Math.cos(theta)*r;
      positions[i*3+1] = (Math.random()-0.5)*5;
      positions[i*3+2] = Math.sin(theta)*r;
      const c = palette[i % 3];
      colors[i*3]=c[0]; colors[i*3+1]=c[1]; colors[i*3+2]=c[2];
    }
    return { positions, colors };
  }, []);
  const ref = useRef();
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.007; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.065} vertexColors transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

// ─── SAGE ─────────────────────────────────────────────────────────────────────
function Sage() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = 3.9 + Math.sin(clock.getElapsedTime() * 0.55) * 0.2;
    }
  });
  return (
    <group ref={ref}>
      <mesh position={[0,-0.32,0]}>
        <cylinderGeometry args={[0.22,0.32,0.72,8]} />
        <meshStandardMaterial color="#FF9933" emissive="#FF6600" emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0,0.28,0]}>
        <sphereGeometry args={[0.21,14,14]} />
        <meshStandardMaterial color="#F4C2A1" />
      </mesh>
      <mesh position={[0,0.44,0]} rotation={[Math.PI/2,0,0]}>
        <torusGeometry args={[0.38,0.032,8,32]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={1.4} />
      </mesh>
      <Billboard position={[0,-1.0,0]}>
        <Text fontSize={0.18} color="#FFD700" anchorX="center" outlineWidth={0.02} outlineColor="#000">
          🙏 Guru Jyotishdev
        </Text>
      </Billboard>
    </group>
  );
}

// ─── PLANET INFO PANEL ────────────────────────────────────────────────────────
function PlanetPanel({ planet, kundali, onClose }) {
  const [guruMsg, setGuruMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const wisdom = PLANET_WISDOM[planet.name];
  const kInfo = kundali?.planets?.[planet.name];

  async function askGuru() {
    setLoading(true);
    const res = await callGuruAPI([{
      role: 'user',
      content: `In my Kundali, ${planet.name} is in ${kInfo?.rasiName || 'unknown'}, House ${kInfo?.house || '?'}, status: ${kInfo?.status || 'Neutral'}. Give me a 3-sentence mystical and empowering insight about its karmic role in my chart.`
    }], 'en', kundali);
    setGuruMsg(res.message);
    setLoading(false);
  }

  return (
    <div style={{
      position:'absolute', top:0, right:0, bottom:0, width:'300px',
      background:'linear-gradient(180deg,rgba(3,1,8,0.97),rgba(13,10,30,0.97))',
      borderLeft:`1px solid ${planet.color}45`,
      overflowY:'auto', zIndex:20,
      animation:'slideInRight 0.38s cubic-bezier(0.16,1,0.3,1)',
      scrollbarWidth:'thin', scrollbarColor:`${planet.color}30 transparent`,
    }}>
      {/* Header */}
      <div style={{ background:`${planet.color}20`, borderBottom:`1px solid ${planet.color}30`, padding:'1rem', position:'sticky', top:0, backdropFilter:'blur(20px)', zIndex:5 }}>
        <button onClick={onClose} style={{ position:'absolute', top:'10px', right:'10px', background:'rgba(255,255,255,0.08)', border:'none', color:'#9CA3AF', width:'26px', height:'26px', borderRadius:'50%', cursor:'pointer', fontSize:'13px' }}>✕</button>
        <div style={{ fontSize:'2rem', marginBottom:'2px' }}>{PLANET_ICONS[planet.name]}</div>
        <div style={{ fontFamily:'Cinzel,serif', color:planet.color, fontSize:'1.15rem', fontWeight:'700' }}>{planet.name}</div>
        <div style={{ color:'#9CA3AF', fontSize:'0.75rem', letterSpacing:'0.12em' }}>{planet.sanskrit} · {planet.deity}</div>
      </div>

      <div style={{ padding:'0.9rem' }}>
        {/* Kundali box */}
        {kInfo && (
          <div style={{ background:`${planet.color}12`, border:`1px solid ${planet.color}28`, borderRadius:'10px', padding:'0.75rem', marginBottom:'0.9rem' }}>
            <div style={{ color:'#9CA3AF', fontSize:'10px', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'5px' }}>Your Chart</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px' }}>
              {[['Sign',kInfo.rasiName],['House',`H${kInfo.house}`],['Nakshatra',kInfo.nakshatra?.name],['Status',kInfo.status]].map(([l,v])=>(
                <div key={l}><div style={{ color:'#6B7280', fontSize:'9px' }}>{l}</div><div style={{ color:v==='Exalted'?'#10B981':v==='Debilitated'?'#EF4444':planet.color, fontWeight:'600', fontSize:'0.82rem' }}>{v||'—'}</div></div>
              ))}
            </div>
          </div>
        )}

        {/* Qualities */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'0.9rem' }}>
          {wisdom.qualities.map(q=>(
            <span key={q} style={{ background:`${planet.color}18`, border:`1px solid ${planet.color}28`, color:planet.color, fontSize:'10px', padding:'2px 8px', borderRadius:'20px' }}>{q}</span>
          ))}
        </div>

        {[
          { icon:'🔮', label:'Spiritual Meaning', text:wisdom.meaning, color:'#A78BFA' },
          { icon:'⚖️', label:'Karmic Role', text:wisdom.karmic, color:'#F59E0B' },
          { icon:'🌀', label:'Transit Influence', text:wisdom.transit, color:'#22D3EE' },
        ].map(s=>(
          <div key={s.label} style={{ marginBottom:'0.85rem' }}>
            <div style={{ color:s.color, fontSize:'10px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'5px' }}>{s.icon} {s.label}</div>
            <p style={{ color:'#D1D5DB', fontSize:'0.81rem', lineHeight:'1.7', margin:0 }}>{s.text}</p>
          </div>
        ))}

        {/* Mantra */}
        <div style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.22)', borderRadius:'10px', padding:'0.75rem', marginBottom:'0.85rem', textAlign:'center' }}>
          <div style={{ color:'#9CA3AF', fontSize:'9px', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'3px' }}>Sacred Mantra</div>
          <div style={{ color:'#A78BFA', fontSize:'0.78rem', fontStyle:'italic', lineHeight:'1.6' }}>{wisdom.mantra}</div>
          <div style={{ color:'#6B7280', fontSize:'9px', marginTop:'3px' }}>💎 {wisdom.gemstone}</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'0.85rem' }}>
          {[['Sacred Day',planet.day],['Element',planet.element]].map(([l,v])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'7px', textAlign:'center' }}>
              <div style={{ color:'#6B7280', fontSize:'9px' }}>{l}</div>
              <div style={{ color:planet.color, fontWeight:'600', fontSize:'0.82rem' }}>{v}</div>
            </div>
          ))}
        </div>

        <button onClick={askGuru} disabled={loading} style={{
          width:'100%', padding:'9px',
          background:loading?'rgba(124,58,237,0.2)':`linear-gradient(135deg,${planet.color}30,rgba(124,58,237,0.4))`,
          border:`1px solid ${planet.color}45`, borderRadius:'10px',
          cursor:loading?'wait':'pointer', color:'#E2D9F3', fontSize:'0.85rem', fontWeight:'600', marginBottom:'0.8rem',
        }}>
          {loading ? '🧘 Channeling...' : `🧘 Ask Guru about ${planet.name}`}
        </button>

        {guruMsg && (
          <div style={{ background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.22)', borderRadius:'10px', padding:'0.85rem', animation:'fadeIn 0.4s ease' }}>
            <div style={{ color:'#A78BFA', fontSize:'9px', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:'5px' }}>🧘 Guru Speaks</div>
            <p style={{ color:'#E2D9F3', fontSize:'0.81rem', lineHeight:'1.7', margin:0, whiteSpace:'pre-wrap' }}>{guruMsg}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight { from { transform:translateX(100%); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
      `}</style>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function SwargaLok({ kundali }) {
  const [selected, setSelected] = useState(null);
  const handleSelect = useCallback(p => setSelected(prev => prev?.name === p.name ? null : p), []);

  return (
    <div style={{
      width:'100%', height:'500px', borderRadius:'16px', overflow:'hidden',
      background:'radial-gradient(ellipse at center,#0D0A2E 0%,#030108 100%)',
      border:'1px solid rgba(124,58,237,0.35)',
      boxShadow:'0 8px 40px rgba(124,58,237,0.25),inset 0 1px 0 rgba(255,255,255,0.05)',
      position:'relative',
    }}>
      <Canvas camera={{ position:[0,4,14], fov:55 }} style={{ background:'transparent' }}>
        <Suspense fallback={null}>
          <Lights />
          <Stars radius={90} depth={60} count={4000} factor={4} fade speed={0.4} />
          <CosmicDust />
          <OrbitRings selected={selected} />
          {NAVAGRAHA.map(p => (
            <Planet key={p.name} planet={p} onSelect={handleSelect} isSelected={selected?.name===p.name} />
          ))}
          <Sage />
          <OrbitControls enableZoom enablePan={false} autoRotate autoRotateSpeed={0.35} maxDistance={24} minDistance={4} />
        </Suspense>
      </Canvas>

      {!selected && (
        <div style={{
          position:'absolute', bottom:'12px', left:'50%', transform:'translateX(-50%)',
          background:'rgba(0,0,0,0.65)', backdropFilter:'blur(10px)',
          border:'1px solid rgba(124,58,237,0.3)', color:'#A78BFA',
          fontSize:'11px', padding:'5px 18px', borderRadius:'20px',
          letterSpacing:'0.12em', pointerEvents:'none', whiteSpace:'nowrap',
        }}>
          ✨ Click any planet to reveal its cosmic wisdom
        </div>
      )}

      {selected && <PlanetPanel planet={selected} kundali={kundali} onClose={() => setSelected(null)} />}
    </div>
  );
}

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Planet data with visual properties
const NAVAGRAHA = [
  { name: 'Sun',     distance: 0,   size: 0.55, color: '#FF9933', emissive: '#FF6600', speed: 0,    y: 0    },
  { name: 'Moon',    distance: 1.6, size: 0.22, color: '#E8E8FF', emissive: '#B0C4DE', speed: 0.9,  y: 0.1  },
  { name: 'Mercury', distance: 2.4, size: 0.16, color: '#C0A882', emissive: '#8B7355', speed: 0.7,  y: -0.2 },
  { name: 'Venus',   distance: 3.2, size: 0.25, color: '#FFD9AA', emissive: '#FF8C00', speed: 0.5,  y: 0.15 },
  { name: 'Mars',    distance: 4.0, size: 0.20, color: '#FF4444', emissive: '#CC0000', speed: 0.4,  y: -0.1 },
  { name: 'Jupiter', distance: 5.1, size: 0.45, color: '#E8C49A', emissive: '#D2691E', speed: 0.2,  y: 0.2  },
  { name: 'Saturn',  distance: 6.3, size: 0.38, color: '#E8D9AA', emissive: '#B8A878', speed: 0.15, y: -0.1 },
  { name: 'Rahu',    distance: 7.2, size: 0.18, color: '#AA44FF', emissive: '#6600CC', speed: -0.1, y: 0.3  },
  { name: 'Ketu',    distance: 7.2, size: 0.18, color: '#CC8844', emissive: '#884422', speed: -0.1, y: -0.3 },
];

function Planet({ planet, kundaliRasi }) {
  const meshRef = useRef();
  const orbitRef = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (orbitRef.current && planet.distance > 0) {
      const angle = t * planet.speed * 0.3 + offset;
      orbitRef.current.position.x = Math.cos(angle) * planet.distance;
      orbitRef.current.position.z = Math.sin(angle) * planet.distance;
      orbitRef.current.position.y = planet.y;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005 * (planet.speed + 0.3);
    }
  });

  const material = useMemo(() => (
    new THREE.MeshStandardMaterial({
      color: planet.color,
      emissive: planet.emissive,
      emissiveIntensity: planet.name === 'Sun' ? 1.2 : 0.3,
      roughness: 0.6,
      metalness: 0.1,
    })
  ), [planet]);

  return (
    <group ref={orbitRef} position={[planet.distance, planet.y, 0]}>
      {/* Planet mesh */}
      <mesh ref={meshRef} material={material}>
        <sphereGeometry args={[planet.size, 20, 20]} />
      </mesh>

      {/* Saturn rings */}
      {planet.name === 'Saturn' && (
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[planet.size * 1.6, planet.size * 0.18, 6, 40]} />
          <meshStandardMaterial color="#D4C090" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Glow for Sun */}
      {planet.name === 'Sun' && (
        <mesh>
          <sphereGeometry args={[planet.size * 1.35, 16, 16]} />
          <meshStandardMaterial color="#FF9933" transparent opacity={0.15} side={THREE.BackSide} />
        </mesh>
      )}

      {/* Planet label */}
      <Text
        position={[0, planet.size + 0.35, 0]}
        fontSize={0.18}
        color={planet.color}
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {planet.name}
      </Text>
    </group>
  );
}

function SunLight() {
  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={3} color="#FF9933" distance={20} decay={2} />
      <ambientLight intensity={0.2} color="#1a0a3c" />
    </>
  );
}

function OrbitRings() {
  return (
    <>
      {NAVAGRAHA.filter(p => p.distance > 0).map(planet => (
        <mesh key={planet.name} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[planet.distance, 0.01, 4, 80]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} />
        </mesh>
      ))}
    </>
  );
}

function CosmicSageAvatar() {
  const groupRef = useRef();
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 3.5, 0]}>
        {/* Body */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.25, 0.35, 0.7, 8]} />
          <meshStandardMaterial color="#FF9933" emissive="#FF6600" emissiveIntensity={0.3} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#F4C2A1" />
        </mesh>
        {/* Halo */}
        <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.03, 8, 32]} />
          <meshStandardMaterial color="#FFD700" emissive="#FFAA00" emissiveIntensity={0.8} />
        </mesh>
        <Text position={[0, -0.9, 0]} fontSize={0.2} color="#FFD700" anchorX="center">
          Guru 🙏
        </Text>
      </group>
    </Float>
  );
}

function MilkyWayParticles() {
  const points = useMemo(() => {
    const n = 1200;
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * 18;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 2] = Math.sin(theta) * r;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#ffffff" transparent opacity={0.5} />
    </points>
  );
}

export default function SwargaLok({ kundali }) {
  return (
    <div style={{
      width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden',
      background: 'radial-gradient(ellipse at center, #0D0A2E 0%, #030108 100%)',
      border: '1px solid rgba(124,58,237,0.3)',
      boxShadow: '0 8px 32px rgba(124,58,237,0.2)',
      position: 'relative',
    }}>
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SunLight />
          <Stars radius={80} depth={50} count={3000} factor={4} fade speed={0.5} />
          <MilkyWayParticles />
          <OrbitRings />

          {NAVAGRAHA.map(planet => (
            <Planet
              key={planet.name}
              planet={planet}
              kundaliRasi={kundali?.planets?.[planet.name]?.rasi}
            />
          ))}

          <CosmicSageAvatar />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.4}
            maxDistance={22}
            minDistance={5}
          />
        </Suspense>
      </Canvas>

      {/* Overlay label */}
      <div style={{
        position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        border: '1px solid rgba(124,58,237,0.3)',
        color: '#A78BFA', fontSize: '12px', padding: '4px 16px', borderRadius: '20px',
        letterSpacing: '0.15em', pointerEvents: 'none',
      }}>
        ✨ SWARGA LOK — The Cosmic Realm of Navagraha
      </div>
    </div>
  );
}

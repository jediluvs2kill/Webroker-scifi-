import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Html, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  Stars, 
  Sparkles,
  MeshReflectorMaterial,
  RoundedBox,
  Torus
} from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

// --- 3D Components ---

function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  useFrame(() => {
    // Smooth camera movement based on mouse position
    camera.position.lerp(vec.set(mouse.x * 0.5, mouse.y * 0.5, camera.position.z), 0.05);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const Portal = ({ position, role, label, onClick }: { position: [number, number, number], role: UserRole, label: string, onClick: (role: UserRole) => void }) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Monochromatic Cyber Colors
  const activeColor = "#00f0ff";
  const dimColor = "#004455";

  useFrame((state, delta) => {
    if (groupRef.current) {
      const targetScale = hovered ? 1.1 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (ringRef.current) {
        ringRef.current.rotation.z -= delta * 0.5; 
        ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.15; 
        ringRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.5) * 0.15; 
    }
  });

  const handlePointerOver = (e: any) => {
      e.stopPropagation();
      document.body.style.cursor = 'pointer';
      setHovered(true);
  };

  const handlePointerOut = (e: any) => {
      e.stopPropagation();
      document.body.style.cursor = 'auto';
      setHovered(false);
  };

  const handleClick = (e: any) => {
      e.stopPropagation();
      onClick(role);
  };

  return (
    <group position={position} ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
          
          {/* Spinning Energy Ring */}
            <group position={[0, 0, -0.6]}>
                <Torus ref={ringRef} args={[1.9, 0.04, 16, 64]}>
                    <meshBasicMaterial color={hovered ? activeColor : dimColor} toneMapped={false} />
                </Torus>
            </group>

          {/* Border Frame (Raycast Target) */}
          <group position={[0, 0, 0]}>
             <RoundedBox 
                args={[2.55, 3.55, 0.1]} 
                radius={0.1} 
                smoothness={4} 
             >
                <meshBasicMaterial 
                    color={activeColor} 
                    wireframe 
                    toneMapped={false}
                    transparent
                    opacity={hovered ? 0.8 : 0.3}
                />
            </RoundedBox>
          </group>

          {/* Glass Card Body (Primary Click Target) */}
          <group position={[0, 0, 0.1]}>
              <RoundedBox 
                  args={[2.5, 3.5, 0.05]} 
                  radius={0.1} 
                  smoothness={4}
                  onClick={handleClick}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
              >
                <meshPhysicalMaterial 
                  color={"#000000"} 
                  transparent 
                  opacity={0.8} 
                  roughness={0} 
                  metalness={0.9} 
                  transmission={0.5}
                  thickness={0.5}
                />
              </RoundedBox>
          </group>

          {/* Text Content */}
          <group position={[0, 0, 0.3]} pointerEvents="none">
              <Text
                position={[0, 0.2, 0]}
                fontSize={0.35}
                color={activeColor}
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/sharetechmono/v15/J7aHnp1uDWRRFmbUR02k9yq7f_g.woff" 
                letterSpacing={0.1}
              >
                {label}
                <meshBasicMaterial color={activeColor} toneMapped={false} depthTest={false} />
              </Text>
              
              <Text
                 position={[0, -0.3, 0]}
                 fontSize={0.1}
                 color={activeColor}
                 anchorX="center"
              >
                ACCESS_TERMINAL
                <meshBasicMaterial color={activeColor} toneMapped={false} depthTest={false} />
              </Text>
          </group>

          {/* Interactive Tooltip */}
          <Html transform position={[0, -1.8, 0]} center pointerEvents="none" style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s' }}>
             <div className="px-3 py-1 bg-black border border-[#00f0ff] text-[#00f0ff] text-[10px] font-mono tracking-widest whitespace-nowrap">
                [ CLICK TO CONNECT ]
             </div>
          </Html>
      </Float>
      
      <pointLight position={[0, 0, 1]} distance={4} intensity={hovered ? 2 : 0.5} color={activeColor} decay={2} />
    </group>
  );
};

interface Scene3DProps {
  onSelectRole: (role: UserRole) => void;
}

const Scene3D: React.FC<Scene3DProps> = ({ onSelectRole }) => {
  return (
    <div className="w-full h-full relative bg-[#020408]">
      <div className="absolute top-24 left-0 right-0 z-10 text-center pointer-events-none">
         <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
         >
             <h1 className="text-6xl font-bold text-[#00f0ff] tracking-[0.2em] font-mono-cyber" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.8)' }}>
                WEBROKER
             </h1>
             <p className="text-[#00f0ff] mt-2 text-xs font-mono tracking-[1em] uppercase opacity-70">
                DECENTRALIZED ESTATE PROTOCOL
             </p>
         </motion.div>
      </div>

      <Canvas dpr={[1, 1.5]} gl={{ antialias: false, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}>
        <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[0, 1, 6]} fov={45} />
            
            <color attach="background" args={['#020408']} />
            <fog attach="fog" args={['#020408', 8, 25]} />
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            
            <group position={[0, 0, -1]}>
                <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
                <Sparkles count={50} scale={10} size={2} speed={0.2} opacity={0.2} color="#00f0ff" />
            </group>

            <group position={[0, -0.2, 0]}>
            <Portal 
                position={[-3.2, 0, 0]} 
                role={UserRole.BUYER} 
                label="BUYER" 
                onClick={onSelectRole} 
            />

            <Portal 
                position={[0, 0, 0.5]} 
                role={UserRole.BROKER} 
                label="BROKER" 
                onClick={onSelectRole} 
            />

            <Portal 
                position={[3.2, 0, 0]} 
                role={UserRole.BUILDER} 
                label="BUILDER" 
                onClick={onSelectRole} 
            />
            </group>
            
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={20}
                roughness={1}
                depthScale={0.2} 
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#020408"
                metalness={0.8}
                mirror={0.5}
            />
            </mesh>

            <EffectComposer disableNormalPass multisampling={0}>
                <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                <Noise opacity={0.05} />
            </EffectComposer>

            <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;
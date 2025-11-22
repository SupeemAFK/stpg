import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

interface MonsterMini3DProps {
    color: string;
    type: string;
    scale?: number;
}

export default function MonsterMini3D({ color, type, scale = 0.8 }: MonsterMini3DProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.015;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    // Different geometries based on monster type
    const getGeometry = () => {
        switch (type) {
            case 'bass':
                return <icosahedronGeometry args={[scale, 1]} />;
            case 'rhythm':
                return <octahedronGeometry args={[scale]} />;
            case 'melody':
                return <torusKnotGeometry args={[scale * 0.6, 0.2, 100, 16]} />;
            case 'vocals':
                return <dodecahedronGeometry args={[scale]} />;
            case 'fx':
                return <tetrahedronGeometry args={[scale * 1.2]} />;
            default:
                return <boxGeometry args={[scale, scale, scale]} />;
        }
    };

    return (
        <mesh ref={meshRef} castShadow>
            {getGeometry()}
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.2}
                speed={1.5}
                roughness={0.3}
                metalness={0.7}
            />
        </mesh>
    );
}

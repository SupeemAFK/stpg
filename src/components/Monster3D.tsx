import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Mesh } from 'three';

interface Monster3DProps {
    color: string;
    type: string;
}

export default function Monster3D({ color, type }: Monster3DProps) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.01;
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
        }
    });

    // Different geometries based on monster type
    const getGeometry = () => {
        switch (type) {
            case 'bass':
                return <icosahedronGeometry args={[1.5, 1]} />;
            case 'rhythm':
                return <octahedronGeometry args={[1.5]} />;
            case 'melody':
                return <torusKnotGeometry args={[1, 0.3, 100, 16]} />;
            case 'vocals':
                return <dodecahedronGeometry args={[1.5]} />;
            case 'fx':
                return <tetrahedronGeometry args={[1.8]} />;
            default:
                return <boxGeometry args={[2, 2, 2]} />;
        }
    };

    return (
        <mesh ref={meshRef} castShadow>
            {getGeometry()}
            <MeshDistortMaterial
                color={color}
                attach="material"
                distort={0.3}
                speed={2}
                roughness={0.2}
                metalness={0.8}
            />
        </mesh>
    );
}

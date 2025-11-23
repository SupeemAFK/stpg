import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Box, Cylinder, Capsule } from '@react-three/drei';
import type { Group } from 'three';

interface MonsterMini3DProps {
    color: string;
    type: string;
    scale?: number;
}

export default function MonsterMini3D({ color, type, scale = 0.8 }: MonsterMini3DProps) {
    const groupRef = useRef<Group>(null);
    const leftArmRef = useRef<Group>(null);
    const rightArmRef = useRef<Group>(null);
    const headRef = useRef<Group>(null);

    useFrame((state) => {
        if (groupRef.current) {
            // General floating
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
            groupRef.current.rotation.y += 0.01;
        }

        // Jamming animation
        const t = state.clock.elapsedTime;
        if (leftArmRef.current && rightArmRef.current) {
            leftArmRef.current.rotation.x = Math.sin(t * 4) * 0.5;
            rightArmRef.current.rotation.x = Math.cos(t * 4) * 0.5;
        }

        if (headRef.current) {
            headRef.current.rotation.z = Math.sin(t * 2) * 0.1;
            headRef.current.rotation.x = Math.sin(t * 1.5) * 0.1;
        }
    });

    // Material shared across parts
    const material = (
        <MeshDistortMaterial
            color={color}
            distort={0.15}
            speed={2}
            roughness={0.2}
            metalness={0.8}
        />
    );

    const getHeadShape = () => {
        switch (type) {
            case 'bass': return <Box args={[0.5, 0.5, 0.5]}>{material}</Box>;
            case 'rhythm': return <Sphere args={[0.35, 32, 32]}>{material}</Sphere>;
            case 'melody': return <Cylinder args={[0.2, 0.3, 0.5]}>{material}</Cylinder>;
            case 'vocals': return <Sphere args={[0.3, 16, 16]} scale={[1, 1.2, 1]}>{material}</Sphere>;
            default: return <Box args={[0.4, 0.4, 0.4]}>{material}</Box>;
        }
    };

    return (
        <group ref={groupRef} scale={scale}>
            {/* Head */}
            <group ref={headRef} position={[0, 0.6, 0]}>
                {getHeadShape()}
                {/* Eyes */}
                <mesh position={[-0.1, 0.05, 0.2]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
                </mesh>
                <mesh position={[0.1, 0.05, 0.2]}>
                    <sphereGeometry args={[0.05]} />
                    <meshStandardMaterial color="white" emissive="white" emissiveIntensity={2} />
                </mesh>
            </group>

            {/* Body */}
            <group position={[0, 0, 0]}>
                <Cylinder args={[0.25, 0.2, 0.6]}>
                    {material}
                </Cylinder>
            </group>

            {/* Arms */}
            <group ref={leftArmRef} position={[-0.35, 0.2, 0]}>
                <Capsule args={[0.08, 0.4]} rotation={[0, 0, 0.5]}>
                    {material}
                </Capsule>
            </group>
            <group ref={rightArmRef} position={[0.35, 0.2, 0]}>
                <Capsule args={[0.08, 0.4]} rotation={[0, 0, -0.5]}>
                    {material}
                </Capsule>
            </group>

            {/* Legs */}
            <group position={[-0.15, -0.5, 0]}>
                <Capsule args={[0.09, 0.5]}>
                    {material}
                </Capsule>
            </group>
            <group position={[0.15, -0.5, 0]}>
                <Capsule args={[0.09, 0.5]}>
                    {material}
                </Capsule>
            </group>
        </group>
    );
}

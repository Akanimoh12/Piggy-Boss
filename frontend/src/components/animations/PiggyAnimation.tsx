/**
 * PiggyAnimation Component - 3D Piggy Bank Animation
 * 
 * This component creates an animated 3D piggy bank using Three.js
 * with rotation, floating coins, and interactive hover effects.
 */

import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, Box, Text } from '@react-three/drei'
import * as THREE from 'three'

// 3D Piggy Bank Model Component
const PiggyBank: React.FC<{ hovered: boolean }> = ({ hovered }) => {
  const meshRef = useRef<THREE.Group>(null!)
  const [rotation, setRotation] = useState(0)

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Auto-rotation
      setRotation(prev => prev + delta * 0.3)
      meshRef.current.rotation.y = rotation
      
      // Hover effect
      const scale = hovered ? 1.1 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
      
      // Floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main Body */}
      <Sphere args={[1.2, 32, 32]} position={[0, 0, 0]}>
        <meshPhongMaterial 
          color="#f472b6" 
          shininess={100}
          specular="#ffffff"
        />
      </Sphere>
      
      {/* Snout */}
      <Sphere args={[0.4, 16, 16]} position={[0, -0.3, 1.1]}>
        <meshPhongMaterial color="#ec4899" />
      </Sphere>
      
      {/* Nostrils */}
      <Sphere args={[0.05, 8, 8]} position={[-0.1, -0.25, 1.45]}>
        <meshPhongMaterial color="#be185d" />
      </Sphere>
      <Sphere args={[0.05, 8, 8]} position={[0.1, -0.25, 1.45]}>
        <meshPhongMaterial color="#be185d" />
      </Sphere>
      
      {/* Eyes */}
      <Sphere args={[0.15, 16, 16]} position={[-0.4, 0.3, 0.9]}>
        <meshPhongMaterial color="#ffffff" />
      </Sphere>
      <Sphere args={[0.15, 16, 16]} position={[0.4, 0.3, 0.9]}>
        <meshPhongMaterial color="#ffffff" />
      </Sphere>
      
      {/* Eye pupils */}
      <Sphere args={[0.08, 8, 8]} position={[-0.4, 0.3, 1.05]}>
        <meshPhongMaterial color="#000000" />
      </Sphere>
      <Sphere args={[0.08, 8, 8]} position={[0.4, 0.3, 1.05]}>
        <meshPhongMaterial color="#000000" />
      </Sphere>
      
      {/* Ears */}
      <Sphere args={[0.2, 16, 16]} position={[-0.8, 0.8, 0.2]} rotation={[0, 0, -0.3]}>
        <meshPhongMaterial color="#ec4899" />
      </Sphere>
      <Sphere args={[0.2, 16, 16]} position={[0.8, 0.8, 0.2]} rotation={[0, 0, 0.3]}>
        <meshPhongMaterial color="#ec4899" />
      </Sphere>
      
      {/* Legs */}
      <Box args={[0.2, 0.6, 0.2]} position={[-0.6, -1.1, 0.4]}>
        <meshPhongMaterial color="#ec4899" />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.6, -1.1, 0.4]}>
        <meshPhongMaterial color="#ec4899" />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[-0.6, -1.1, -0.4]}>
        <meshPhongMaterial color="#ec4899" />
      </Box>
      <Box args={[0.2, 0.6, 0.2]} position={[0.6, -1.1, -0.4]}>
        <meshPhongMaterial color="#ec4899" />
      </Box>
      
      {/* Coin Slot */}
      <Box args={[0.6, 0.05, 0.1]} position={[0, 0.8, 0.8]}>
        <meshPhongMaterial color="#be185d" />
      </Box>
      
      {/* Tail */}
      <Box args={[0.1, 0.4, 0.1]} position={[0, 0.2, -1.3]} rotation={[0.5, 0, 0]}>
        <meshPhongMaterial color="#ec4899" />
      </Box>
    </group>
  )
}

// Floating Coin Component
const FloatingCoin: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
      <meshPhongMaterial color="#fbbf24" />
      <Text
        position={[0, 0, 0.03]}
        fontSize={0.1}
        color="#92400e"
        anchorX="center"
        anchorY="middle"
      >
        $
      </Text>
    </mesh>
  )
}

// Particle Component
const Particles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = new THREE.Object3D()

  useFrame((state) => {
    if (meshRef.current) {
      for (let i = 0; i < 50; i++) {
        const time = state.clock.elapsedTime
        dummy.position.set(
          Math.sin((i + time) * 0.1) * 8,
          Math.cos((i + time) * 0.15) * 8,
          Math.sin((i + time) * 0.05) * 8
        )
        dummy.rotation.set(
          time * 0.1 + i,
          time * 0.2 + i,
          time * 0.3 + i
        )
        dummy.updateMatrix()
        meshRef.current.setMatrixAt(i, dummy.matrix)
      }
      meshRef.current.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, 50]}>
      <sphereGeometry args={[0.02]} />
      <meshPhongMaterial color="#8b5cf6" opacity={0.6} transparent />
    </instancedMesh>
  )
}

const PiggyAnimation: React.FC = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <div 
      className="relative w-96 h-96 mx-auto cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        {/* 3D Piggy Bank */}
        <PiggyBank hovered={hovered} />
        
        {/* Floating Coins */}
        <FloatingCoin position={[-2, 1, -1]} />
        <FloatingCoin position={[2.5, -0.5, -0.5]} />
        <FloatingCoin position={[-1.5, -1, 1]} />
        <FloatingCoin position={[1, 2, 0.5]} />
        
        {/* Particles */}
        <Particles />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!hovered}
          autoRotateSpeed={0.5}
        />
      </Canvas>
      
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-300/20 via-transparent to-transparent rounded-full pointer-events-none" />
    </div>
  )
}

export default PiggyAnimation;

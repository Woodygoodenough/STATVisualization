"use client";

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Scene3DProps {
  muX: number;
  muY: number;
  sigmaX: number;
  sigmaY: number;
  rho: number;
  showConditional: boolean;
  xHat: number;
  showMarginal: boolean;
}

// Bivariate Normal PDF
const bivariateNormalPDF = (x: number, y: number, muX: number, muY: number, sigmaX: number, sigmaY: number, rho: number) => {
  const z = Math.pow((x - muX) / sigmaX, 2) -
            2 * rho * ((x - muX) / sigmaX) * ((y - muY) / sigmaY) +
            Math.pow((y - muY) / sigmaY, 2);
  const coefficient = 1 / (2 * Math.PI * sigmaX * sigmaY * Math.sqrt(1 - rho * rho));
  return coefficient * Math.exp(-z / (2 * (1 - rho * rho)));
};

// Marginal Normal PDF (X)
const marginalNormalPDF = (x: number, muX: number, sigmaX: number) => {
  const coefficient = 1 / (sigmaX * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - muX, 2) / (2 * sigmaX * sigmaX);
  return coefficient * Math.exp(exponent);
};

export default function Scene3D({ muX, muY, sigmaX, sigmaY, rho, showConditional, xHat, showMarginal }: Scene3DProps) {

  // 1. Generate Joint PDF Surface
  const geometry = useMemo(() => {
    const segments = 60;
    const size = 8;
    const halfSize = size / 2;
    const step = size / segments;

    const positions = [];
    const indices = [];
    const colors = [];

    // Scale Z for better visualization
    const zScale = 5;

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -halfSize + i * step;
        const y = -halfSize + j * step;
        const z = bivariateNormalPDF(x, y, muX, muY, sigmaX, sigmaY, rho);

        positions.push(x, z * zScale, y);

        // Color based on Z height (density)
        const color = new THREE.Color();
        color.setHSL(0.6 - (z * zScale * 0.1), 1.0, 0.5); // Blue to Red heatmap-ish
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = a + 1;
        const c = a + (segments + 1);
        const d = c + 1;

        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [muX, muY, sigmaX, sigmaY, rho]);

  // 2. Generate Conditional PDF Curve (Y | X = xHat)
  const conditionalLine = useMemo(() => {
    if (!showConditional) return null;
    const points = [];
    const segments = 100;
    const size = 8;
    const halfSize = size / 2;
    const step = size / segments;
    const zScale = 5;

    for (let i = 0; i <= segments; i++) {
      const y = -halfSize + i * step;
      const z = bivariateNormalPDF(xHat, y, muX, muY, sigmaX, sigmaY, rho);
      points.push(new THREE.Vector3(xHat, z * zScale, y));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [muX, muY, sigmaX, sigmaY, rho, showConditional, xHat]);

  // 3. Generate Marginal PDF Projection (X)
  const marginalLine = useMemo(() => {
    if (!showMarginal) return null;
    const points = [];
    const segments = 100;
    const size = 8;
    const halfSize = size / 2;
    const step = size / segments;
    const zScale = 5;

    // Project onto XZ wall (y = -4)
    const wallY = -4;

    for (let i = 0; i <= segments; i++) {
      const x = -halfSize + i * step;
      const z = marginalNormalPDF(x, muX, sigmaX);
      points.push(new THREE.Vector3(x, z * zScale, wallY));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [muX, sigmaX, showMarginal]);

  // Rotate bounding box plane to face XZ
  const planeRotation = useMemo(() => new THREE.Euler(0, -Math.PI / 2, 0), []);

  return (
    <Canvas camera={{ position: [6, 6, 6], fov: 45 }}>
      <color attach="background" args={['#f8fafc']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} />

      <OrbitControls makeDefault />

      {/* Ground Grid */}
      <Grid
        args={[10, 10]}
        cellSize={1}
        cellThickness={1}
        cellColor="#e2e8f0"
        sectionSize={5}
        sectionThickness={1.5}
        sectionColor="#cbd5e1"
        fadeDistance={30}
        infiniteGrid
      />

      {/* Axes */}
      <axesHelper args={[5]} />
      <Text position={[5.2, 0, 0]} color="black" fontSize={0.3}>X</Text>
      <Text position={[0, 0, 5.2]} color="black" fontSize={0.3}>Y</Text>
      <Text position={[0, 5.2, 0]} color="black" fontSize={0.3}>Density</Text>

      {/* Joint Surface */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
          wireframe={false}
        />
      </mesh>

      {/* Conditional Distribution Line and Plane */}
      {showConditional && conditionalLine && (
        <group>
          {/* Slicing Plane parallel to YZ */}
          <mesh position={[xHat, 2.5, 0]} rotation={planeRotation}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
          {/* Density Curve at xHat */}
          <primitive object={new THREE.Line(conditionalLine, new THREE.LineBasicMaterial({ color: "#b91c1c", linewidth: 3 }))} />
        </group>
      )}

      {/* Marginal Distribution Line */}
      {showMarginal && marginalLine && (
        <group>
          <primitive object={new THREE.Line(marginalLine, new THREE.LineBasicMaterial({ color: "#1d4ed8", linewidth: 3 }))} />
          {/* Plane parallel to XZ */}
          <mesh position={[0, 2.5, -4]}>
            <planeGeometry args={[8, 5]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

    </Canvas>
  );
}

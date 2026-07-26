import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js";
import { NodeMaterial } from "three/webgpu";
import { wgslFn, time, uv, vec4 } from "three/tsl";

function ShaderMesh({ code, modelType }) {
    const material = useMemo(() => {
    const mat = new NodeMaterial();
    mat.side = THREE.DoubleSide;

    try {
      const userShader = wgslFn(code);
      
      // Injetamos o output diretamente, ignorando cálculos paralelos do Three.js
      mat.fragmentNode = userShader({ 
        u_time: time, 
        vUv: uv() 
      });
      
    } catch (error) {
      // Se o usuário estiver no meio da digitação e o WGSL quebrar, 
      // renderizamos preto sem travar a aplicação React
      console.warn("Aguardando sintaxe WGSL válida...", error.message);
      mat.fragmentNode = vec4(0.0, 0.0, 0.0, 1.0);
    }

    return mat;
    }, [code]);

  return (
    <mesh material={material}>
      {modelType === "plane" && <planeGeometry args={[4, 4]} />}
      {modelType === "cube" && <boxGeometry args={[2, 2, 2]} />}
      {modelType === "sphere" && <sphereGeometry args={[1.5, 64, 64]} />}
      {modelType === "icosahedron" && <icosahedronGeometry args={[1.67, 0]} />}
      {modelType === "torus" && <torusGeometry args={[1.2, 0.4, 32, 100]} />}
    </mesh>
  );
}

export default function ShaderCanvas({ code, modelType }) {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "#0a0a0a" }}>
      <Canvas
        gl={async (props) => {
          const renderer = new WebGPURenderer({ ...props, antialias: true });
          await renderer.init();
          return renderer;
        }}
        camera={{ position: [0, 0, 4.5], fov: 60 }}
      >
        <ShaderMesh code={code} modelType={modelType} />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}

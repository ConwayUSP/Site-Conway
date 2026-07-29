import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useEffect, Suspense } from "react";
import * as THREE from "three";
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js";
import { NodeMaterial } from "three/webgpu";
import { wgslFn, time, uv, vec4, uniform } from "three/tsl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function CustomModelMesh({ url, material }) {
  const gltf = useLoader(GLTFLoader, url);

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
    return clone;
  }, [gltf, material]);

  return <primitive object={clonedScene} scale={1.2} />;
}

function ShaderMesh({ code, modelType, customModelUrl, mouseVec }) {
    const material = useMemo(() => {
    const mat = new NodeMaterial();
    mat.side = THREE.DoubleSide;

    try {
      const userShader = wgslFn(code);
      
      mat.fragmentNode = userShader({ 
        time: time, 
        uv: uv(),
        mouse_pos: uniform(mouseVec)
      });
      
    } catch (error) {
      // Se o usuário estiver no meio da digitação e o WGSL quebrar, 
      // renderizamos preto sem travar a aplicação React
      console.warn("Aguardando sintaxe WGSL válida...", error.message);
      mat.fragmentNode = vec4(0.0, 0.0, 0.0, 1.0);
    }

    return mat;
    }, [code, mouseVec]);

  if (modelType === "custom" && customModelUrl) {
    return (
      <Suspense fallback={null}>
        <CustomModelMesh url={customModelUrl} material={material} />
      </Suspense>
    );
  }

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

export default function ShaderCanvas({ code, modelType, customModelUrl, bgColor }) {
  const mouseVec = useRef(new THREE.Vector2(0.5, 0.5)).current;

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height; // Inverte o eixo Y para bater com UV
    mouseVec.set(x, y);
  };

  return (
    <div 
      onPointerMove={handlePointerMove}
      style={{ width: "100%", height: "100%", position: "relative", background: bgColor || "#0a0a0a" }}
    >
      <Canvas
        gl={async (props) => {
          const renderer = new WebGPURenderer({ ...props, antialias: true });
          await renderer.init();
          return renderer;
        }}
        camera={{ position: [0, 0, 3.5], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <ShaderMesh code={code} modelType={modelType} customModelUrl={customModelUrl} mouseVec={mouseVec} />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}

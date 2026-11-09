import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useEffect, useRef, useCallback, useState, Suspense } from "react";
import * as THREE from "three";
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js";
import { NodeMaterial } from "three/webgpu";
import { wgslFn, time, uv, vec4, uniform, texture, positionLocal, Fn, normalLocal, positionWorld, cameraPosition, sub, normalize } from "three/tsl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import ShaderErrorPanel from "./ShaderErrorPanel";
import { getErrorMessage, isShaderRendererError } from "@utils/shaderErrors";

function CustomModelMesh({ customModel, material, onTextureExtracted }) {
  const { url, fileMap } = customModel || {};

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    if (fileMap) {
      const manager = new THREE.LoadingManager();
      manager.setURLModifier((path) => {
        const filename = decodeURIComponent(path.split('/').pop().split('?')[0]);
        if (fileMap[filename]) return fileMap[filename];
        return path;
      });
      loader.manager = manager;
    }
  });

  useEffect(() => {
    if (gltf && gltf.scene) {
      let foundTex = null;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.material && child.material.map) {
            foundTex = child.material.map;
          }

          const geom = child.geometry;
          if (geom && !geom.attributes.uv) {
            const posAttr = geom.attributes.position;
            const count = posAttr.count;
            const uvs = new Float32Array(count * 2);
            for (let i = 0; i < count; i++) {
              const x = posAttr.getX(i);
              const y = posAttr.getY(i);
              uvs[i * 2] = x * 0.5 + 0.5;
              uvs[i * 2 + 1] = y * 0.5 + 0.5;
            }
            geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
          }
        }
      });
      if (foundTex && onTextureExtracted) {
        onTextureExtracted(foundTex);
      }
    }
  }, [gltf, onTextureExtracted]);

  const clonedScene = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.traverse((child) => {
      if (child.isMesh) child.material = material;
    });
    return clone;
  }, [gltf, material]);

  return <primitive object={clonedScene} scale={1.2} />;
}

function MultiPassShaderMesh({ shaders, modelType, customModel, mouseVec, textures = [], onShaderError }) {
  const { gl } = useThree();
  const [nativeModelTexture, setNativeModelTexture] = useState(null);

  const bufferShaders = useMemo(() => shaders.filter(s => s.id !== "main"), [shaders]);
  const mainShaderObj = useMemo(() => shaders.find(s => s.id === "main") || shaders[shaders.length - 1], [shaders]);

  const renderTargets = useMemo(() => {
    return bufferShaders.map(() => new THREE.RenderTarget(window.innerWidth, window.innerHeight, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    }));
  }, [bufferShaders.length]);

  useEffect(() => {
    const handleResize = () => {
      renderTargets.forEach(rt => rt.setSize(window.innerWidth, window.innerHeight));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderTargets]);

  // Compilação dos Buffers com captura robusta
  const { bufferMaterials, bufferError } = useMemo(() => {
    let err = null;
    const mats = bufferShaders.map((shader) => {
      const mat = new NodeMaterial();
      mat.side = THREE.DoubleSide;
      try {
        const parsedFn = wgslFn(shader.code);
        mat.fragmentNode = parsedFn({ time: time, uv: uv(), mouse_pos: uniform(mouseVec) });
      } catch (error) {
        err = `[${shader.name}] ${getErrorMessage(error)}`;
        mat.fragmentNode = vec4(0.0, 0.0, 0.0, 1.0);
      }
      return mat;
    });
    return { bufferMaterials: mats, bufferError: err };
  }, [bufferShaders, mouseVec]);

  // Carrega texturas dos slots manuais
  const loadedTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return textures.map(url => {
      if (!url) return null;
      const tex = loader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    });
  }, [textures]);

  // Compilação do Material Principal (Image)
  const { material, parseError } = useMemo(() => {
    const mat = new NodeMaterial();
    let nextParseError = null;
    mat.side = THREE.DoubleSide;

    try {
      const userShader = wgslFn(mainShaderObj.code);
      const viewDir = normalize(sub(cameraPosition, positionWorld));
      const shaderArgs = { 
        time: time, 
        uv: uv(),
        mouse_pos: uniform(mouseVec),
        normal: normalLocal,
        pos: positionWorld,
        cam_pos: cameraPosition,
        cam_dir: viewDir,
      };

      renderTargets.forEach((rt, idx) => {
        shaderArgs[`pass${idx}`] = texture(rt.texture, uv());
      });

      const slot0Texture = loadedTextures[0] || nativeModelTexture;
      if (slot0Texture) {
        shaderArgs.tex0 = texture(slot0Texture, uv());
      }

      loadedTextures.slice(1).forEach((tex, i) => {
        if (tex) {
          shaderArgs[`tex${i + 1}`] = texture(tex, uv()); 
        }
      });

      mat.fragmentNode = userShader(shaderArgs);
    } catch (error) {
      nextParseError = `[${mainShaderObj.name}] ${getErrorMessage(error)}`;
      mat.fragmentNode = vec4(0.0, 0.0, 0.0, 1.0);
    }

    return { material: mat, parseError: nextParseError };
  }, [mainShaderObj, mouseVec, renderTargets, nativeModelTexture, loadedTextures]);

  const quadScene = useMemo(() => new THREE.Scene(), []);
  const quadCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);
  const quadMesh = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), []);
  
  useEffect(() => {
    quadScene.add(quadMesh);
    return () => quadScene.remove(quadMesh);
  }, [quadScene, quadMesh]);

  useFrame(() => {
    if (bufferMaterials.length === 0) return;
    const currentRenderTarget = gl.getRenderTarget();
    
    bufferMaterials.forEach((bufMat, idx) => {
      quadMesh.material = bufMat;
      gl.setRenderTarget(renderTargets[idx]);
      gl.render(quadScene, quadCamera);
    });

    gl.setRenderTarget(currentRenderTarget);
  });

  // Notifica o componente pai sobre erros estáticos detectados no useMemo (sem limpar agressivamente)
  useEffect(() => {
    const activeError = parseError || bufferError;
    if (activeError) {
      onShaderError(activeError);
    }
  }, [parseError, bufferError, onShaderError]);

  useEffect(() => {
    return () => {
      if (material) material.dispose();
      bufferMaterials.forEach(m => m.dispose());
      renderTargets.forEach(rt => rt.dispose());
    };
  }, [material, bufferMaterials, renderTargets]);

  if (modelType === "custom" && customModel) {
    return (
      <Suspense fallback={null}>
        <CustomModelMesh 
          customModel={customModel} 
          material={material} 
          onTextureExtracted={setNativeModelTexture} 
        />
      </Suspense>
    );
  }

  return (
    <mesh material={material}>
      {modelType === "plane" && <planeGeometry args={[4, 4, 64, 64]} />}
      {modelType === "cube" && <boxGeometry args={[2, 2, 2, 32, 32, 32]} />}
      {modelType === "sphere" && <sphereGeometry args={[1.5, 64, 64]} />}
      {modelType === "torus" && <torusGeometry args={[1.2, 0.4, 32, 64]} />}
    </mesh>
  );
}

export default function ShaderCanvas({ shaders, modelType, customModel, bgColor, textures, shaderError, onShaderError }) {
  const mouseVec = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  const consoleCleanupRef = useRef(null);

  const installErrorCapture = useCallback(() => {
    if (consoleCleanupRef.current) return;
    const originalConsoleError = console.error;
    
    const captureConsoleError = (...args) => {
      originalConsoleError(...args);
      
      // Conversão robusta de qualquer argumento para string
      const message = args.map(arg => {
        if (!arg) return "";
        if (typeof arg === "string") return arg;
        if (arg instanceof Error) return arg.message || String(arg);
        if (typeof arg === "object") {
          return arg.message || arg.toString?.() || JSON.stringify(arg);
        }
        return String(arg);
      }).join(" ");

      const lower = message.toLowerCase();
      
      // Captura ampla para qualquer erro gerado pelo WebGPU / WebGL / Shaders / TSL
      if (
        lower.includes("wgsl") || 
        lower.includes("shader") || 
        lower.includes("webgpu") || 
        lower.includes("failed") || 
        lower.includes("error") || 
        lower.includes("unresolved") ||
        lower.includes("not defined") ||
        lower.includes("pipeline") ||
        lower.includes("compil")
      ) {
        onShaderError(message);
      }
    };

    console.error = captureConsoleError;
    consoleCleanupRef.current = () => {
      if (console.error === captureConsoleError) {
        console.error = originalConsoleError;
      }
      consoleCleanupRef.current = null;
    };
  }, [onShaderError]);

  // Instancia a captura imediatamente na montagem do canvas
  useEffect(() => {
    installErrorCapture();
    return () => {
      consoleCleanupRef.current?.();
    };
  }, [installErrorCapture]);

  // Limpa o erro da tela apenas quando o usuário alterar/escrever código nas abas
  useEffect(() => {
    onShaderError(null);
  }, [shaders, onShaderError]);

  const createRenderer = useCallback(async (props) => {
    const renderer = new WebGPURenderer({ ...props, antialias: true });
    await renderer.init();
    installErrorCapture();
    return renderer;
  }, [installErrorCapture]);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseVec.set(x, y);
  };

  return (
    <div onPointerMove={handlePointerMove} style={{ width: "100%", height: "100%", position: "relative", background: bgColor }}>
      <Canvas gl={createRenderer} camera={{ position: [0, 0, 3.5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <MultiPassShaderMesh
          shaders={shaders}
          modelType={modelType}
          customModel={customModel}
          mouseVec={mouseVec}
          textures={textures}
          onShaderError={onShaderError}
        />
        <OrbitControls enableDamping />
      </Canvas>
      <ShaderErrorPanel key={shaderError} error={shaderError} />
    </div>
  );
}

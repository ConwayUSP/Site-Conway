import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useEffect, useRef, useCallback, useState, Suspense } from "react";
import * as THREE from "three";
import WebGPURenderer from "three/src/renderers/webgpu/WebGPURenderer.js";
import { NodeMaterial } from "three/webgpu";
import { wgslFn, time, uv, vec4, uniform, texture, normalLocal, positionWorld, cameraPosition, sub, normalize } from "three/tsl";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import ShaderErrorPanel from "./ShaderErrorPanel";
import { getErrorMessage } from "@utils/shaderErrors";

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

function MultiPassShaderMesh({ shaders, modelType, customModel, mouseVec, textures = [], lightPosition, onShaderError }) {
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

  const lightPosUniform = useMemo(() => uniform(new THREE.Vector3(5, -5, 2.5)), []);

  useEffect(() => {
    if (lightPosition) {
      lightPosUniform.value.set(lightPosition.x, lightPosition.y, lightPosition.z);
    }
  }, [lightPosition, lightPosUniform]);

  const sharedShaderArgs = useMemo(() => {
    const viewDir = normalize(sub(cameraPosition, positionWorld));
    return {
      time: time,
      uv: uv(),
      mouse_pos: uniform(mouseVec),
      light_pos: lightPosUniform,
      normal: normalLocal,
      pos: positionWorld,
      cam_pos: cameraPosition,
      cam_dir: viewDir,
    };
  }, [mouseVec, lightPosUniform]);

  // Compilação dos Buffers em cadeia (Buffer A, Buffer B...) com injeção de passes anteriores
  const { bufferMaterials, bufferError } = useMemo(() => {
    let err = null;
    const mats = bufferShaders.map((shader, idx) => {
      const mat = new NodeMaterial();
      mat.side = THREE.DoubleSide;
      try {
        const parsedFn = wgslFn(shader.code);
        const args = { ...sharedShaderArgs };
        
        // Injeção sequencial: Buffer B pode ler pass0 gerado pelo Buffer A
        for (let i = 0; i < idx; i++) {
          args[`pass${i}`] = texture(renderTargets[i].texture, uv());
        }

        mat.fragmentNode = parsedFn(args);
      } catch (error) {
        err = `[${shader.name}] ${getErrorMessage(error)}`;
        mat.fragmentNode = vec4(0.0, 0.0, 0.0, 1.0);
      }
      return mat;
    });
    return { bufferMaterials: mats, bufferError: err };
  }, [bufferShaders, sharedShaderArgs, renderTargets]);

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

  // Compilação do Material Principal (Image) recebendo todos os buffers e texturas
  const { material, parseError } = useMemo(() => {
    const mat = new NodeMaterial();
    let nextParseError = null;
    mat.side = THREE.DoubleSide;

    try {
      const userShader = wgslFn(mainShaderObj.code);
      const shaderArgs = { ...sharedShaderArgs };

      // Injeta todos os passes disponíveis (pass0, pass1...)
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
  }, [mainShaderObj, sharedShaderArgs, renderTargets, nativeModelTexture, loadedTextures]);

  const lightCamera = useMemo(() => new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50), []);
  const bufferScene = useMemo(() => new THREE.Scene(), []);
  const bufferMeshRef = useRef(null);

  useEffect(() => {
    const geom = modelType === "cube" ? new THREE.BoxGeometry(2, 2, 2, 32, 32, 32) :
                 modelType === "sphere" ? new THREE.SphereGeometry(1.5, 64, 64) :
                 modelType === "torus" ? new THREE.TorusGeometry(1.2, 0.4, 32, 64) :
                 new THREE.PlaneGeometry(4, 4, 64, 64);

    const mesh = new THREE.Mesh(geom);
    bufferScene.add(mesh);
    bufferMeshRef.current = mesh;

    return () => {
      bufferScene.remove(mesh);
      geom.dispose();
    };
  }, [modelType, bufferScene]);

  // Executa o loop de renderização offscreen de cada buffer sequencialmente
  useFrame(() => {
    if (bufferMaterials.length === 0) return;
    const currentRenderTarget = gl.getRenderTarget();

    if (lightPosition) {
      lightCamera.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
    }
    lightCamera.lookAt(0, 0, 0);
    lightCamera.updateMatrixWorld();
    
    bufferMaterials.forEach((bufMat, idx) => {
      if (bufferMeshRef.current) {
        bufferMeshRef.current.material = bufMat;
      }
      gl.setRenderTarget(renderTargets[idx]);
      gl.clear();
      gl.render(bufferScene, lightCamera);
    });

    gl.setRenderTarget(currentRenderTarget);
  });

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

export default function ShaderCanvas({ shaders, modelType, customModel, bgColor, textures, shaderError, lightPosition, onShaderError }) {
  const mouseVec = useMemo(() => new THREE.Vector2(0.5, 0.5), []);
  const consoleCleanupRef = useRef(null);

  const installErrorCapture = useCallback(() => {
    if (consoleCleanupRef.current) return;
    const originalConsoleError = console.error;
    
    const captureConsoleError = (...args) => {
      originalConsoleError(...args);
      const message = args.map(arg => {
        if (!arg) return "";
        if (typeof arg === "string") return arg;
        if (arg instanceof Error) return arg.message || String(arg);
        return String(arg);
      }).join(" ");

      const lower = message.toLowerCase();
      if (
        lower.includes("wgsl") || lower.includes("shader") || 
        lower.includes("webgpu") || lower.includes("failed") || 
        lower.includes("error") || lower.includes("unresolved") ||
        lower.includes("not defined") || lower.includes("pipeline")
      ) {
        onShaderError(message);
      }
    };

    console.error = captureConsoleError;
    consoleCleanupRef.current = () => {
      if (console.error === captureConsoleError) console.error = originalConsoleError;
      consoleCleanupRef.current = null;
    };
  }, [onShaderError]);

  useEffect(() => () => { consoleCleanupRef.current?.(); }, []);

  useEffect(() => {
    installErrorCapture();
    return () => consoleCleanupRef.current?.();
  }, [installErrorCapture]);

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
          lightPosition={lightPosition}
          onShaderError={onShaderError}
        />
        <OrbitControls enableDamping />
      </Canvas>
      <ShaderErrorPanel key={shaderError} error={shaderError} />
    </div>
  );
}

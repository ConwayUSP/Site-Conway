import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

import { formatCompilationErrors, getErrorMessage } from "@utils/shaderErrors";

export default function ShaderValidator({ code, onShaderError }) {
  const renderer = useThree((state) => state.gl);

  useEffect(() => {
    let cancelled = false;

    const validate = async () => {
      if (!renderer.initialized) await renderer.init();

      const device = renderer.backend?.device;
      if (!device?.createShaderModule) return;

      const module = device.createShaderModule({
        label: "Conway Lab shader validation",
        code,
      });
      const compilationInfo = await module.getCompilationInfo();
      if (cancelled) return;

      const errors = compilationInfo.messages.filter((message) => message.type === "error");
      onShaderError(errors.length > 0 ? formatCompilationErrors(errors, code) : null, code);
    };

    validate().catch((error) => {
      if (!cancelled) onShaderError(getErrorMessage(error), code);
    });

    return () => {
      cancelled = true;
    };
  }, [code, onShaderError, renderer]);

  return null;
}

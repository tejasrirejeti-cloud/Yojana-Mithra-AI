import React, { useEffect, useRef } from 'react';

export const BackgroundAnimationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const syncSize = () => {
      const w = window.innerWidth || 1280;
      const h = window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    syncSize();
    window.addEventListener('resize', syncSize);

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;

varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

// Helper to draw a circle
float circle(vec2 uv, vec2 pos, float radius, float blur) {
    float d = length(uv - pos);
    return smoothstep(radius, radius - blur, d);
}

// Helper for the Ashok Chakra spokes
float spokes(vec2 uv, vec2 pos, float radius, float spokeCount) {
    vec2 rel = uv - pos;
    float angle = atan(rel.y, rel.x) + u_time * 0.5;
    float d = length(rel);
    if (d > radius) return 0.0;
    
    float sector = 6.28318 / spokeCount;
    float modAngle = mod(angle, sector);
    float spokeWidth = 0.01;
    return smoothstep(spokeWidth, 0.0, abs(modAngle - sector * 0.5)) * smoothstep(radius, radius * 0.9, d);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 centeredUv = (uv - 0.5) * aspect;

    // Indian Tricolor Palette
    vec3 saffron = vec3(1.0, 0.6, 0.2);   // #FF9933
    vec3 white   = vec3(1.0, 1.0, 1.0);   // #FFFFFF
    vec3 green   = vec3(0.07, 0.53, 0.03); // #138808

    // Correct vertical tricolor sequence (Saffron Top, White Mid, Green Bottom)
    float t = u_time * 0.3;
    float wave = 0.05 * sin(uv.x * 4.0 + t);
    
    // Smooth transitions between bands
    float mix1 = smoothstep(0.3, 0.4, uv.y + wave);
    float mix2 = smoothstep(0.6, 0.7, uv.y + wave);
    
    // Reverse mix logic because 0,0 is bottom-left
    // Saffron (Top), White (Middle), Green (Bottom)
    vec3 bg = mix(green, white, mix1);
    bg = mix(bg, saffron, mix2);
    
    bg *= 0.35; // Subtle for background use

    // The Ashok Chakra (Centered)
    vec2 chakraPos = vec2(0.0, 0.0);
    float chakraOuter = circle(centeredUv, chakraPos, 0.2, 0.005) - circle(centeredUv, chakraPos, 0.19, 0.005);
    float chakraInner = circle(centeredUv, chakraPos, 0.04, 0.005);
    float chakraSpokes = spokes(centeredUv, chakraPos, 0.19, 24.0);
    
    vec3 chakraColor = vec3(0.0, 0.0, 0.5); // Navy Blue
    float chakraMask = clamp(chakraOuter + chakraInner + chakraSpokes, 0.0, 1.0);
    
    // Ambient floating particles
    float elements = 0.0;
    for(float i = 0.0; i < 6.0; i++) {
        float et = u_time * 0.2 + i * 1.5;
        vec2 p = vec2(sin(et), cos(et * 0.7)) * 0.6 * aspect;
        elements += circle(centeredUv, p, 0.01, 0.08) * (0.3 + 0.7 * sin(et));
    }

    vec3 finalColor = mix(bg, chakraColor, chakraMask * 0.3);
    finalColor += vec3(1.0, 1.0, 0.9) * elements * 0.2;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

    function createShader(type: number, src: string) {
      const s = gl!.createShader(type);
      if (!s) return null;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const vertShader = createShader(gl.VERTEX_SHADER, vs);
    const fragShader = createShader(gl.FRAGMENT_SHADER, fs);

    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;

    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    const render = (t: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', syncSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-75 dark:opacity-90">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
};

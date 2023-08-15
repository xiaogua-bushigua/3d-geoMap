import * as THREE from 'three';
import { extend } from '@react-three/fiber';

class LightSweepMaterial extends THREE.ShaderMaterial {
	constructor() {
		super({
			transparent: true,
			uniforms: {
				ringWidth: { value: 0.0 },
				innerRadius: { value: 0.0 },
			},
			vertexShader: /* glsl */ `
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
			fragmentShader: /* glsl */ `
        varying vec2 vUv;  
        uniform float ringWidth;
        uniform float innerRadius;
    
        void main() {
          float dist = distance(vUv - 0.5, vec2(0.0));
          float patternInner = step(innerRadius, dist*2.0);
          float patternOuter = step(1.0 - (innerRadius + ringWidth), 1.0 - dist*2.0);
          float pattern = patternInner * patternOuter;
          gl_FragColor.rgba = vec4(vec4(pattern));
        }
      `,
		});
	}
}

extend({ LightSweepMaterial });

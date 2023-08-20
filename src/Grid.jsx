import { Instances, Instance, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import './lightSweep.js';
import { useEffect, useRef } from 'react';

const Grid = ({ number = 23, lineWidth = 0.026, baseHeight, values }) => {
	const light = useRef();
	const ringWidth = 0.075;
	const T = Math.PI / 2;

	useFrame((state) => {
		const elapsedTime = state.clock.getElapsedTime() / 3;
		const stage = (elapsedTime / T) % 2;

		if (stage < 1) light.current.material.uniforms.innerRadius.value = 1.5 * Math.abs(Math.sin(elapsedTime));
		else light.current.material.uniforms.innerRadius.value = 0;
		light.current.material.uniforms.ringWidth.value = ringWidth;
	});

	const textConfig = {
		curveSegments: 32,
		bevelEnabled: true,
		bevelSize: 0,
		bevelThickness: 0,
		height: 0.02,
		letterSpacing: 0,
		size: 0.6,
	};
	return (
		<>
			<mesh ref={light} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
				<planeGeometry args={[80, 80]} />
				<lightSweepMaterial />
			</mesh>
			<Text3D
				font={'./MFTianLiNoncommercial_Regular.json'}
				position={[-6, 2, -15]}
				rotation={[-Math.PI * 0.2, 0, 0]}
				{...textConfig}
			>
				{values.title}
				<meshBasicMaterial color={'#3d3d3d'} />
			</Text3D>
			<Instances position={[0, -0.01, 0]} scale={2}>
				<planeGeometry args={[lineWidth, baseHeight]} />
				<meshBasicMaterial color="#999" />
				{Array.from({ length: number }, (_, y) =>
					Array.from({ length: number }, (_, x) => (
						<group
							key={x + ':' + y}
							position={[x * 2 - Math.floor(number / 2) * 2, -0.01, y * 2 - Math.floor(number / 2) * 2]}
						>
							<Instance rotation={[-Math.PI / 2, 0, 0]} />
							<Instance rotation={[-Math.PI / 2, 0, Math.PI / 2]} />
						</group>
					))
				)}
				<gridHelper args={[100, 100, '#bbb', '#bbb']} position={[0, -0.01, 0]} />
			</Instances>
		</>
	);
};

export default Grid;

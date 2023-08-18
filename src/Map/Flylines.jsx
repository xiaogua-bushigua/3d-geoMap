import { useRef } from 'react';
import { QuadraticBezierLine } from '@react-three/drei';
import '../lightSweep.js';
import { useFrame } from '@react-three/fiber';

const Flylines = ({ lines }) => {
	const moveLinesRef = useRef([]);

	useFrame((_, delta) => {
		if (moveLinesRef.current.length != 0 && moveLinesRef.current[0]) {
			moveLinesRef.current.forEach((line) => {
				line.material.uniforms.dashOffset.value -= delta * 2;
			});
		}
	});
	return (
		<group>
			{lines.children.map((line, index) => (
				<group key={'fly_line_' + index}>
					<QuadraticBezierLine
						start={line.start}
						end={line.end}
						mid={line.mid}
						color="#ffffff"
						dashed
						dashScale={2}
						gapSize={0}
						lineWidth={2}
					/>
					<QuadraticBezierLine
						ref={(el) => (moveLinesRef.current[index] = el)}
						start={line.start}
						end={line.end}
						mid={line.mid}
						color="#ff7411"
						dashed
						dashScale={2}
						gapSize={2}
						lineWidth={2}
					/>
					<mesh position={line.end}>
						<sphereGeometry args={[0.06]} />
						<meshBasicMaterial color={'#ff7411'} />
					</mesh>
				</group>
			))}
			{lines.children[0] && (
				<mesh position={lines.children[0].start}>
					<sphereGeometry args={[0.1]} />
					<meshBasicMaterial color={'#ffffff'} />
				</mesh>
			)}
		</group>
	);
};

export default Flylines;

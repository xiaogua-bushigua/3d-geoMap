import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Text3D, Html, Edges, QuadraticBezierLine } from '@react-three/drei';
import '../lightSweep.js';
import { gsap } from 'gsap';
import { useFrame } from '@react-three/fiber';

const Top = ({ baseHeight, midHeightScale, topHeightScale, blocks, values, mapCenter }) => {
	const scale = 3.15;

	let rankInfo = Object.keys(values.features).map((key) => `${key} ${values.features[key]}`);
	rankInfo.sort((a, b) => b.split(' ')[1] - a.split(' ')[1]);
	rankInfo = rankInfo.map((item, index) => index + 1 + '.' + item);
	let rank = {};
	rankInfo.forEach((item) => {
		rank[item.split('.')[1].split(' ')[0]] = item;
	});

	const config = {
		color: '#9cb8e4',
		clearcoat: 0.5,
		reflectivity: 0.35,
		ior: 1.3,
	};

	const blocksRef = useRef([]);
	const namesRef = useRef([]);
	const moveLinesRef = useRef([]);

	const textConfig = {
		curveSegments: 32,
		bevelEnabled: true,
		bevelSize: 0,
		bevelThickness: 0,
		height: 0.02,
		letterSpacing: 0,
		size: 0.25,
	};

	const [makerVisible, setMakerVisible] = useState(false);
	const [makerPosition, setMakerPosition] = useState([0, 2, 0]);
	const [makerValue, setMakerValue] = useState('');
	const handleEnter = (e, index) => {
		e.stopPropagation();
		const province = blocks[index].properties.name;
		setMakerVisible(true);
		setMakerValue(rank[province]);
		setMakerPosition([
			(blocks[index].properties.center[0] - mapCenter[0]) * scale,
			2,
			-(blocks[index].properties.center[1] - mapCenter[1]) * scale,
		]);

		gsap.to(blocksRef.current[index].scale, { duration: 0.3, z: 0.8 });
		blocksRef.current[index].material.color = new THREE.Color('#ffb47e');
	};
	const handleLeave = (e, index) => {
		e.stopPropagation();
		setMakerVisible(false);
		setMakerValue('');
		setMakerPosition([0, 2, 0]);

		setLines({ children: [] });

		gsap.to(blocksRef.current[index].scale, {
			duration: 0.3,
			z: topHeightScale,
		});
		blocksRef.current[index].material.color = new THREE.Color('#9cb8e4');
	};

	const [lines, setLines] = useState({ children: [] });
	const handleClick = (e, index) => {
		e.stopPropagation();
		setLines({ children: [] });
		let temp = [];
		blocks.forEach((block, i) => {
			if (i !== index) {
				const startX = (blocks[index].properties.center[0] - mapCenter[0]) * scale;
				const startZ = -(blocks[index].properties.center[1] - mapCenter[1]) * scale;
				const endX = (block.properties.center[0] - mapCenter[0]) * scale;
				const endZ = -(block.properties.center[1] - mapCenter[1]) * scale;
				temp.push({
					start: [startX, 1.2, startZ],
					end: [endX, 1.2, endZ],
					mid: [(startX + endX) / 2, 3, (startZ + endZ) / 2],
				});
			}
		});
		setLines({ children: [...temp] });
	};

	useFrame((_, delta) => {
		if (moveLinesRef.current.length != 0 && moveLinesRef.current[0]) {
			moveLinesRef.current.forEach((line) => {
				line.material.uniforms.dashOffset.value -= delta * 2;
			});
		}
	});
	return (
		<>
			{lines.children.map((line, index) => (
				<group key={'fly_line_' + index}>
					<QuadraticBezierLine
						start={line.start}
						end={line.end}
						mid={line.mid}
						color="#ffffff"
						lineWidth={2}
						dashed={false}
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
				</group>
			))}

			<Html
				style={{
					transition: 'all 0.2s',
					opacity: makerVisible ? 1 : 0,
					transform: `scale(${makerVisible ? 1 : 0.25})`,
					userSelect: 'none',
					width: '200px',
					fontFamily: 'zaozigongfangtianliti',
					color: '#242424',
				}}
				position={makerPosition}
			>
				<h3>{makerValue}</h3>
			</Html>

			<group rotation={[0, Math.PI * 1.1, Math.PI]} position-y={baseHeight + midHeightScale * baseHeight + 0.01}>
				{blocks.map((item, index) => (
					<group key={'city_' + index}>
						<Text3D
							ref={(el) => {
								namesRef.current[index] = el;
							}}
							font={'./MFTianLiNoncommercial_Regular.json'}
							position={[
								(item.properties.centroid[0] - mapCenter[0]) * scale,
								0.01,
								(item.properties.centroid[1] - mapCenter[1]) * scale,
							]}
							rotation={[-Math.PI * 0.5, Math.PI, Math.PI]}
							{...textConfig}
						>
							{item.properties.name}
							<meshBasicMaterial color={'#ffffff'} />
						</Text3D>
					</group>
				))}
			</group>

			<group
				rotation={[-Math.PI * 0.5, 0, Math.PI * 0.09]}
				position-y={baseHeight + midHeightScale * baseHeight + 0.01}
			>
				{blocks.map((item, index) => (
					<group key={'top_' + index}>
						<mesh
							scale={[1, 1, topHeightScale]}
							geometry={blocks[index].children[0].geometry}
							ref={(el) => {
								blocksRef.current[index] = el;
							}}
							onPointerEnter={(e) => handleEnter(e, index)}
							onPointerLeave={(e) => handleLeave(e, index)}
							onClick={(e) => handleClick(e, index)}
						>
							<meshPhysicalMaterial
								{...config}
								transmission={Math.sqrt(
									item.properties.value / Math.max(...Object.values(values.features))
								)}
								roughness={Math.sqrt(
									item.properties.value / Math.max(...Object.values(values.features))
								)}
							/>
							<Edges color={'#ffffff'} />
						</mesh>
					</group>
				))}
			</group>
		</>
	);
};

export default Top;

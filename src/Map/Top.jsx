import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Text3D, Html, Edges } from '@react-three/drei';
import '../lightSweep.js';
import { gsap } from 'gsap';
import { useControls } from 'leva';

const Top = ({
	baseHeight,
	midHeightScale,
	topHeightScale,
	blocks,
	values,
	mapCenter,
}) => {
	let rankInfo = Object.keys(values.features).map(
		(key) => `${key} ${values.features[key]}`
	);
	rankInfo.sort((a, b) => b.split(' ')[1] - a.split(' ')[1]);
	rankInfo = rankInfo.map((item, index) => index + 1 + '.' + item);
	let rank = {};
	rankInfo.forEach((item) => {
		rank[item.split('.')[1].split(' ')[0]] = item;
	});

	const { offsetX, offsetY, scaleX, scaleY } = useControls('地图文字', {
		offsetX: { value: -0.2, min: -3, max: 3, step: 0.01 },
		offsetY: { value: -0.1, min: -3, max: 3, step: 0.01 },
		scaleX: { value: 2.77, min: 1, max: 5, step: 0.01 },
		scaleY: { value: 3.2, min: 1, max: 5, step: 0.01 },
	});

	const config = {
		color: '#9cb8e4',
		clearcoat: 0.5,
		reflectivity: 0.35,
		ior: 1.3,
	};

	const blocksRef = useRef([]);
	const namesRef = useRef([]);

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
			(blocks[index].properties.center[0] - mapCenter[0] + offsetX) *
				scaleX,
			2,
			-(blocks[index].properties.center[1] - mapCenter[1] + offsetY) *
				scaleY,
		]);

		gsap.to(blocksRef.current[index].scale, { duration: 0.3, z: 0.8 });
		blocksRef.current[index].material.color = new THREE.Color('#ffb47e');
		namesRef.current[index].position.z = 0.01 + 0.8 * baseHeight;
	};
	const handleLeave = (e, index) => {
		e.stopPropagation();
		setMakerVisible(false);
		setMakerValue('');
		setMakerPosition([0, 2, 0]);

		gsap.to(blocksRef.current[index].scale, {
			duration: 0.3,
			z: topHeightScale,
		});
		blocksRef.current[index].material.color = new THREE.Color('#9cb8e4');
		namesRef.current[index].position.z = 0.01;
	};
	return (
		<>
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
						>
							<meshPhysicalMaterial
								{...config}
								transmission={Math.sqrt(
									item.properties.value /
										Math.max(
											...Object.values(values.features)
										)
								)}
								roughness={Math.sqrt(
									item.properties.value /
										Math.max(
											...Object.values(values.features)
										)
								)}
							/>
							<Edges color={'#ffffff'} />
						</mesh>

						<Text3D
							ref={(el) => {
								namesRef.current[index] = el;
							}}
							font={'./MFTianLiNoncommercial_Regular.json'}
							position={[
								(item.properties.centroid[0] -
									mapCenter[0] +
									offsetX) *
									scaleX,
								(item.properties.centroid[1] -
									mapCenter[1] +
									+offsetY) *
									scaleY,
								0.01,
							]}
							{...textConfig}
						>
							{item.properties.name}
							<meshBasicMaterial color={'#ffffff'} />
						</Text3D>
					</group>
				))}
			</group>
		</>
	);
};

export default Top;

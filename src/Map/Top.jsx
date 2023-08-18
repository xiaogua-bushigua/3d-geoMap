import * as THREE from 'three';
import { useRef, useState } from 'react';
import { Text3D, Html, Edges } from '@react-three/drei';
import '../lightSweep.js';
import { gsap } from 'gsap';
import Flylines from './Flylines.jsx';
import Bird from './Bird.jsx';

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
	const [lines, setLines] = useState({ children: [] });
	const [targetPosition, setTargetPosition] = useState({ x: 0, z: 0 });

	const handleClick = (e, index) => {
		e.stopPropagation();
		setLines({ children: [] });
		// 第二次点击选中的地图，让其恢复默认状态
		if (blocksRef.current[index].scale.z == 0.8) handleSecondClick(index);
		else {
			handleFristClick(index);
		}
	};
	const handleFristClick = (index) => {
		let tempArr = [];
		blocks.forEach((block, i) => {
			if (i !== index) {
				const startX = (blocks[index].properties.center[0] - mapCenter[0]) * scale;
				const startZ = -(blocks[index].properties.center[1] - mapCenter[1]) * scale;
				const endX = (block.properties.center[0] - mapCenter[0]) * scale;
				const endZ = -(block.properties.center[1] - mapCenter[1]) * scale;
				tempArr.push({
					start: [startX, baseHeight * (1 + midHeightScale + topHeightScale) + 0.3, startZ],
					end: [endX, baseHeight * (1 + midHeightScale + topHeightScale) + 0.3, endZ],
					mid: [
						startX + (endX - startX) / 5,
						baseHeight * (1 + midHeightScale + topHeightScale) + 2,
						startZ + (endZ - startZ) / 5,
					],
				});
			}
		});
		setLines({ children: [...tempArr] });
		// maker
		const province = blocks[index].properties.name;
		setMakerVisible(true);
		setMakerValue(rank[province]);
		setMakerPosition([
			(blocks[index].properties.center[0] - mapCenter[0]) * scale,
			2,
			-(blocks[index].properties.center[1] - mapCenter[1]) * scale,
		]);
		// block
		blocksRef.current.forEach((block, lastIndex) => {
			if (block.scale.z === 0.8) {
				gsap.to(blocksRef.current[lastIndex].scale, {
					duration: 0.3,
					z: topHeightScale,
				});
				blocksRef.current[lastIndex].material.color = new THREE.Color('#9cb8e4');
				namesRef.current[lastIndex].material.opacity = 1;
			}
		});
		gsap.to(blocksRef.current[index].scale, { duration: 0.3, z: 0.8 });
		blocksRef.current[index].material.color = new THREE.Color('#ffb47e');
		namesRef.current[index].material.opacity = 0;
		// bird
		setTargetPosition({ ...targetPosition, x: tempArr[0].start[0], z: tempArr[0].start[2] });
	};
	const handleSecondClick = (index) => {
		setMakerVisible(false);
		setMakerValue('');
		setMakerPosition([0, 2, 0]);
		gsap.to(blocksRef.current[index].scale, {
			duration: 0.3,
			z: topHeightScale,
		});
		blocksRef.current[index].material.color = new THREE.Color('#9cb8e4');
		namesRef.current[index].material.opacity = 1;
	};
	return (
		<>
			{/* 飞鸟 */}
			<Bird targetPosition={targetPosition} />
			{/* 飞线 */}
			<Flylines lines={lines} />
			{/* 点击后的城市maker */}
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
			{/* 城市名称 */}
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
							<meshBasicMaterial color={'#ffffff'} transparent />
						</Text3D>
					</group>
				))}
			</group>
			{/* 城市block */}
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

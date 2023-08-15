import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

const Base = ({ blocks }) => {
	const [matcap] = useLoader(THREE.TextureLoader, [
		'C7C7D7_4C4E5A_818393_6C6C74-512px.png',
	]);

	const geometries = blocks.map((item) => item.children[0].geometry);
	const merged = useMemo(
		() => BufferGeometryUtils.mergeBufferGeometries(geometries),
		[geometries]
	);

	return (
		<group rotation={[-Math.PI * 0.5, 0, Math.PI * 0.09]}>
			<mesh geometry={merged}>
				<meshMatcapMaterial matcap={matcap} />
			</mesh>
		</group>
	);
};

export default Base;

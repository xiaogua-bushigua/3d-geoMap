import { MeshTransmissionMaterial } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { RGBELoader } from 'three-stdlib';

const config = {
	samples: 16,
	resolution: 1024,
	transmission: 1,
	thickness: 0.3,
	chromaticAberration: 0.3,
	anisotropy: 0.3,
	roughness: 0.6,
	ior: 1,
	color: '#d2ebff',
};

const Mid = ({ baseHeight, midHeightScale, blocks }) => {
	const background = useLoader(RGBELoader, './model_assets/umhlanga_sunrise_1k.hdr');

	const geometries = blocks.map((item) => item.children[0].geometry);
	const merged = useMemo(() => BufferGeometryUtils.mergeGeometries(geometries), [geometries]);

	return (
		<group
			rotation={[-Math.PI * 0.5, 0, Math.PI * 0.09]}
			position-y={baseHeight + 0.01}
			scale={[1, 1, midHeightScale]}
		>
			<mesh geometry={merged}>
				<MeshTransmissionMaterial {...config} background={background} />
			</mesh>
		</group>
	);
};

export default Mid;

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Lightformer } from '@react-three/drei';
import Grid from './Grid';
import Map from './Map/Map';
import countValues_anhui from './assets/values_anhui.json';
import geoJson_anhui from './assets/安徽省.json';
import { Suspense, memo } from 'react';
import Loading from './Loading';

function App() {
	const baseHeight = 0.2;
	const midHeightScale = 4;
	const topHeightScale = 0.01;
	const center = [117.39, 32.06];
	const geoJson = geoJson_anhui;
	const countValues = countValues_anhui;

	const MemoGrid = memo(Grid);

	return (
		<Suspense fallback={<Loading />}>
			<Canvas camera={{ position: [0, 12, 16], fov: 50 }}>
				<ambientLight intensity={2} />
				<directionalLight intensity={20} position={[0, 0, 1]} />
				<Environment resolution={32}>
					<group rotation={[-Math.PI / 4, -0.3, 0]}>
						<Lightformer
							intensity={20}
							rotation-x={Math.PI / 2}
							position={[0, 5, -9]}
							scale={[10, 10, 1]}
						/>
						<Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
						<Lightformer
							intensity={2}
							rotation-y={Math.PI / 2}
							position={[-5, -1, -1]}
							scale={[10, 2, 1]}
						/>
						<Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
						<Lightformer
							type="ring"
							intensity={2}
							rotation-y={Math.PI / 2}
							position={[-0.1, -1, -5]}
							scale={10}
						/>
					</group>
				</Environment>
				<OrbitControls
					enableZoom={false}
					enablePan={false}
					maxPolarAngle={Math.PI * 0.48}
					minPolarAngle={Math.PI * 0.2}
					maxAzimuthAngle={Math.PI * 0.3}
					minAzimuthAngle={-Math.PI * 0.1}
				/>
				<ContactShadows
					opacity={0.8}
					scale={30}
					blur={1}
					far={10}
					resolution={256}
					position={[0, -0.0001, 0]}
					color="#006afe"
				/>
				<MemoGrid baseHeight={baseHeight} values={countValues} />
				<Map
					baseHeight={baseHeight}
					midHeightScale={midHeightScale}
					topHeightScale={topHeightScale}
					values={countValues}
					geoJson={geoJson}
					mapCenter={center}
				/>
			</Canvas>
		</Suspense>
	);
}

export default App;

import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useProgress } from '@react-three/drei';
import Grid from './Decoration/Grid';
import Map from './Map/Map';
import countValues_anhui from './assets/values_anhui.json';
import geoJson_anhui from './assets/安徽省.json';
import { Suspense, memo, useEffect, useState } from 'react';
import Loading from './Loading';

const baseHeight = 0.2;
const midHeightScale = 4;
const topHeightScale = 0.01;
const center = [117.39, 32.06];
const geoJson = geoJson_anhui;
const countValues = countValues_anhui;

function App() {
	const [loaded, setLoaded] = useState(false);
	const MemoGrid = memo(Grid);

	const { progress } = useProgress();

	useEffect(() => {
		if (progress === 100) setLoaded(true);
	}, [progress]);

	return (
		<Suspense fallback={<Loading />}>
			{loaded && (
				<div
					style={{
						position: 'absolute',
						top: '10px',
						zIndex: 1,
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						padding: '0 20px',
						boxSizing: 'border-box',
					}}
				>
					<h1 style={{ fontSize: '28px', color: 'black', fontFamily: 'zaozigongfangtianliti' }}>
						Click the region on the map!
					</h1>
					<a href="https://github.com/xiaogua-bushigua/3d-geoMap" target="_blank">
						<img src="./github.png" style={{ width: '48px', height: '48px' }} />
					</a>
				</div>
			)}
			<Canvas camera={{ position: [0, 12, 16], fov: 50 }}>
				<ambientLight intensity={2} />
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

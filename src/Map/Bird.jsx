import { useRef, useEffect } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import '../lightSweep.js';
import { gsap } from 'gsap';

const Bird = ({ targetPosition }) => {
	const birdRef = useRef();
	const model = useGLTF('./flying_synthwave_bird.glb');
	const animations = useAnimations(model.animations, model.scene);

	useEffect(() => {
		const action = animations.actions['Armature.001|Scene|Scene'];
		action.reset().fadeIn(0.5).play();
	}, [animations]);

	useEffect(() => {
		doRotate();
	}, [targetPosition]);

	const doRotate = () => {
		let { rotateAngle } = autoRotate([targetPosition.x, targetPosition.z], [0, -1]);

		gsap.to(birdRef.current.rotation, {
			duration: 0.6,
			y: rotateAngle,
		});
	};

	const autoRotate = (targetPosi, objectPosi) => {
		let A = Math.atan((targetPosi[0] - objectPosi[0]) / (targetPosi[1] - objectPosi[1]));
		if (targetPosition.z >= -1) A += Math.PI;
		return { rotateAngle: A };
	};

	return <primitive ref={birdRef} object={model.scene} scale={1} position={[0, 1.5, -1]} />;
};

export default Bird;

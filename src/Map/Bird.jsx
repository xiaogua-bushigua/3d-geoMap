import * as THREE from 'three';
import { useRef, useState, useEffect } from 'react';
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
		const { rotateAngle } = autoRotate([targetPosition.x, targetPosition.z], [0, 5]);
		if (targetPosition.x > 0)
			gsap.to(birdRef.current.rotation, {
				duration: 0.6,
				y: -Math.PI * 0.5 - rotateAngle,
			});
		else
			gsap.to(birdRef.current.rotation, {
				duration: 0.6,
				y: Math.PI * 0.5 - rotateAngle,
			});
		gsap.to(birdRef.current.position, {
			duration: 2,
			x: targetPosition.x,
			z: targetPosition.z,
		});
	};

	// initAngle：初始时物体相对于y轴的弧度
	// targetPosi：目标位置
	// objectPosi：物体位置
	const autoRotate = (targetPosi, objectPosi) => {
		const A = Math.atan((targetPosi[1] - objectPosi[1]) / (targetPosi[0] - objectPosi[0]));
		return { rotateAngle: A };
	};

	return <primitive ref={birdRef} object={model.scene} scale={1} position={[0, 1.6, 5]} />;
};

export default Bird;

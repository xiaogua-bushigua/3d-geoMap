import * as THREE from 'three';
import * as d3 from 'd3-geo';
import Base from './Base';
import Mid from './Mid';
import Top from './Top';

// 将不规范的数据规范化（json中的coordinates有时少了一层嵌套）
const processing = (oriData, values) => {
	oriData.features.forEach((region) => {
		region.properties.value = values.features[region.properties.name];
		if (typeof region.geometry.coordinates[0][0][0] === 'number') {
			const temp = region.geometry.coordinates[0];
			region.geometry.coordinates[0] = [temp];
		}
	});
	return oriData;
};

const Map = ({ baseHeight, midHeightScale, topHeightScale, values, geoJson, mapCenter }) => {
	const map = new THREE.Object3D();
	const projection = d3.geoMercator().center(mapCenter).translate([0, 0]);

	processing(geoJson, values).features.forEach(element => {
		const region = new THREE.Object3D();
		const coordinates = element.geometry.coordinates;

		coordinates.forEach(multiPolygon => {
			multiPolygon.forEach((polygon) => {
				const shape = new THREE.Shape();
				const lineMaterial = new THREE.LineBasicMaterial({
					color: '#ffffff',
				});
				const lineGeometry = new THREE.BufferGeometry();

				const vertices = [];
				for (let i = 0; i < polygon.length; i++) {
					let x = null;
					let y = null;
					if (polygon[i] instanceof Array) {
						[x, y] = projection(polygon[i]);
						if (i === 0) {
							shape.moveTo(x, -y);
						}
						shape.lineTo(x, -y);
						vertices.push(x, -y, baseHeight * topHeightScale + 0.001);
					}
				}
				lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

				const extrudeSettings = {
					depth: baseHeight,
					bevelEnabled: false,
				};

				const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
				const material = new THREE.MeshBasicMaterial();
				const mesh = new THREE.Mesh(geometry, material);
				const line = new THREE.Line(lineGeometry, lineMaterial);
				region.add(mesh);
				region.add(line);
			});
		});

		region.properties = element.properties;
		if (element.properties.centroid) {
			const [x, y] = projection(element.properties.centroid);
			region.properties._centroid = [x, y];
		}

		map.add(region);
	});

	return (
		<group>
			<Base blocks={map.children} baseHeight={baseHeight} />
			<Mid blocks={map.children} baseHeight={baseHeight} midHeightScale={midHeightScale} />
			<Top
				blocks={map.children}
				baseHeight={baseHeight}
				midHeightScale={midHeightScale}
				topHeightScale={topHeightScale}
				values={values}
				mapCenter={mapCenter}
			/>
		</group>
	);
};

export default Map;

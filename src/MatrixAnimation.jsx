// import React, { useEffect, useRef, lazy } from 'react';
// const three = lazy(() => import('three'));
// import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
//
// const MatrixAnimation = ({ svgUrls }) => {
//     const mountRef = useRef(null);
//
//     useEffect(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//         const renderer = new THREE.WebGLRenderer({ alpha: true });
//         renderer.setSize(window.innerWidth, window.innerHeight);
//         mountRef.current.appendChild(renderer.domElement);
//
//         const svgMeshes = [];
//
//         const svgLoader = new SVGLoader();
//         svgUrls.forEach((url, index) => {
//             svgLoader.load(url, (data) => {
//                 const paths = data.paths;
//                 paths.forEach((path) => {
//                     const material = new THREE.MeshBasicMaterial({
//                         color: new THREE.Color(Math.random(), Math.random(), Math.random()),
//                         side: THREE.DoubleSide,
//                         depthWrite: false,
//                         transparent: true,
//                         opacity: 1.0
//                     });
//
//                     const shapes = path.toShapes(true);
//                     shapes.forEach((shape) => {
//                         const geometry = new THREE.ShapeGeometry(shape);
//                         const mesh = new THREE.Mesh(geometry, material);
//
//                         // Random initial position
//                         mesh.position.x = Math.random() * 20 - 10;
//                         mesh.position.y = Math.random() * 20 - 10;
//                         mesh.position.z = Math.random() * -30;
//
//                         scene.add(mesh);
//                         svgMeshes.push(mesh);
//                     });
//                 });
//             });
//         });
//
//         camera.position.z = 5;
//
//         const animate = () => {
//             requestAnimationFrame(animate);
//
//             svgMeshes.forEach(mesh => {
//                 mesh.position.y -= 0.05; // Adjust speed as needed
//                 if (mesh.position.y < -10) {
//                     mesh.position.y = 10; // Reset position to top
//                 }
//             });
//
//             renderer.render(scene, camera);
//         };
//
//         animate();
//
//         const handleResize = () => {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();
//             renderer.setSize(window.innerWidth, window.innerHeight);
//         };
//
//         window.addEventListener('resize', handleResize);
//
//         return () => {
//             window.removeEventListener('resize', handleResize);
//             mountRef.current.removeChild(renderer.domElement);
//         };
//     }, [svgUrls]);
//
//     return <div ref={mountRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} />;
// };
//
// export default MatrixAnimation;

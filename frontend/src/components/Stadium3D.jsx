import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Stadium3D({ currentMode }) {
  const mountRef = useRef(null);

  const stadiumNames = {
    nocturna: 'Santiago Bernabéu — Real Madrid',
    entrenamiento: 'Anfield — Liverpool FC',
    torneo: 'Etihad Stadium — Manchester City'
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // 1. Escena, Cámara y Renderizador
    const scene = new THREE.Scene();
    
    let bgColor, seatColor, roofColor, ambientLightColor;

    if (currentMode === 'nocturna') {
      bgColor = 0x080c14;
      seatColor = 0xf8fafc; 
      roofColor = 0xcbd5e1;
      ambientLightColor = 0x93c5fd;
    } else if (currentMode === 'entrenamiento') {
      bgColor = 0x140305;
      seatColor = 0xdc2626; 
      roofColor = 0xf87171;
      ambientLightColor = 0xfca5a5;
    } else {
      bgColor = 0x060f1e;
      seatColor = 0x38bdf8; 
      roofColor = 0x7dd3fc;
      ambientLightColor = 0xbae6fd;
    }

    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(45, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    camera.position.set(0, 9, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // 2. Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 25;

    // 3. Iluminación temática
    const ambientLight = new THREE.AmbientLight(ambientLightColor, 1.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
    mainLight.position.set(10, 20, 10);
    scene.add(mainLight);

    // 4. Terreno de juego (Cancha de fútbol)
    const fieldLength = 10; 
    const fieldWidth = 6;   
    
    const pitchGeo = new THREE.PlaneGeometry(fieldLength, fieldWidth);
    const pitchMat = new THREE.MeshStandardMaterial({ 
      color: 0x16a34a, 
      roughness: 0.8 
    });
    const pitch = new THREE.Mesh(pitchGeo, pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    scene.add(pitch);

    // --- LÍNEAS REGLAMENTARIAS ---
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const lw = 0.05; 

    const createLine = (w, h, x, z) => {
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), lineMat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(x, 0.01, z);
      scene.add(mesh);
    };

    createLine(fieldLength, lw, 0, -fieldWidth / 2); 
    createLine(fieldLength, lw, 0, fieldWidth / 2);  
    createLine(lw, fieldWidth, -fieldLength / 2, 0); 
    createLine(lw, fieldWidth, fieldLength / 2, 0);  
    createLine(lw, fieldWidth, 0, 0);

    const circleGeo = new THREE.RingGeometry(1.1, 1.15, 32);
    const centerCircle = new THREE.Mesh(circleGeo, lineMat);
    centerCircle.rotation.x = -Math.PI / 2;
    centerCircle.position.set(0, 0.012, 0);
    scene.add(centerCircle);

    const spotGeo = new THREE.CircleGeometry(0.07, 16);
    const centerSpot = new THREE.Mesh(spotGeo, lineMat);
    centerSpot.rotation.x = -Math.PI / 2;
    centerSpot.position.set(0, 0.013, 0);
    scene.add(centerSpot);

    const boxLength = 1.8;
    const boxWidth = 3.6;
    createLine(boxLength, lw, -fieldLength / 2 + boxLength / 2, -boxWidth / 2);
    createLine(boxLength, lw, -fieldLength / 2 + boxLength / 2, boxWidth / 2);
    createLine(lw, boxWidth, -fieldLength / 2 + boxLength, 0);

    createLine(boxLength, lw, fieldLength / 2 - boxLength / 2, -boxWidth / 2);
    createLine(boxLength, lw, fieldLength / 2 - boxLength / 2, boxWidth / 2);
    createLine(lw, boxWidth, fieldLength / 2 - boxLength, 0);

    // 5. ARCOS DE FÚTBOL PERFECTAMENTE ORIENTADOS
    const postMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const netMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true, transparent: true, opacity: 0.35 });

    const createGoal = (xPos, isLeft) => {
      const goalGroup = new THREE.Group();
      const gWidth = 2.2;
      const gHeight = 1.1;
      const gDepth = 0.7;

      const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, gHeight, 0.05), postMat);
      p1.position.set(0, gHeight / 2, -gWidth / 2);
      
      const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.05, gHeight, 0.05), postMat);
      p2.position.set(0, gHeight / 2, gWidth / 2);

      const crossbar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, gWidth), postMat);
      crossbar.position.set(0, gHeight, 0);

      // La red se extiende hacia el exterior de la cancha de manera simétrica
      const netBox = new THREE.Mesh(new THREE.BoxGeometry(gDepth, gHeight, gWidth), netMat);
      netBox.position.set(isLeft ? -gDepth / 2 : gDepth / 2, gHeight / 2, 0);

      goalGroup.add(p1, p2, crossbar, netBox);
      goalGroup.position.set(xPos, 0, 0);
      return goalGroup;
    };

    scene.add(createGoal(-fieldLength / 2, true));
    scene.add(createGoal(fieldLength / 2, false));

    // 6. GRADAS CON LOS COLORES OFICIALES DE CADA EQUIPO
    const standMat = new THREE.MeshStandardMaterial({ color: seatColor, roughness: 0.5 });
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.4, side: THREE.DoubleSide });

    const createStand = (width, depth, height, x, z, rotX, rotY) => {
      const group = new THREE.Group();
      
      const stand = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), standMat);
      stand.position.set(0, height / 2, 0);
      group.add(stand);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 1.02, 0.08, depth * 1.2), roofMat);
      roof.position.set(0, height * 1.3, depth * 0.1);
      roof.rotation.x = 0.25;
      group.add(roof);

      group.position.set(x, 0, z);
      if (rotX) group.rotation.x = rotX;
      if (rotY) group.rotation.y = rotY;
      scene.add(group);
    };

    createStand(11.2, 2.2, 0.8, 0, -4.8, 0.35, 0);
    createStand(11.2, 2.2, 0.8, 0, 4.8, -0.35, 0);
    createStand(7.0, 2.2, 0.8, -7.2, 0, 0, -Math.PI / 2);
    createStand(7.0, 2.2, 0.8, 7.2, 0, 0, Math.PI / 2);

    // 7. Torres de Iluminación
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
    const lightBoxMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

    const createFloodlightTower = (x, z) => {
      const towerGroup = new THREE.Group();
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 5.5, 16), poleMat);
      pole.position.set(0, 2.75, 0);
      towerGroup.add(pole);

      const lightsBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.3), lightBoxMat);
      lightsBox.position.set(0, 5.5, 0);
      towerGroup.add(lightsBox);

      towerGroup.position.set(x, 0, z);
      scene.add(towerGroup);
    };

    createFloodlightTower(-7.6, -5.6);
    createFloodlightTower(7.6, -5.6);
    createFloodlightTower(-7.6, 5.6);
    createFloodlightTower(7.6, 5.6);

    // 8. Balón de fútbol flotante
    const ballGeo = new THREE.SphereGeometry(0.28, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 0.28, 0);
    scene.add(ball);

    // 9. Animación y controles
    let animationFrameId;
    let angle = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      angle += 0.03;
      ball.position.y = 0.28 + Math.sin(angle) * 0.07;
      ball.rotation.y += 0.02;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentMode]);

  return (
    <div id="estadio" className="w-full h-[520px] relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700 my-6 bg-slate-950">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md text-white px-3.5 py-2 rounded-lg text-xs font-semibold border border-slate-700 shadow-lg flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>{stadiumNames[currentMode]}</span>
      </div>
      <div className="absolute bottom-4 right-4 bg-slate-900/80 text-slate-300 text-[11px] px-3 py-1.5 rounded-md border border-slate-700 pointer-events-none">
        💡 Arrastra con el clic para girar • Rueda para hacer zoom
      </div>
    </div>
  );
}
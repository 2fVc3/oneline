import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface PencilDrawingProps {
  colors: string[];
  currentColorIndex: number;
}

export const PencilDrawing = forwardRef<any, PencilDrawingProps>(
  ({ colors, currentColorIndex }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene>();
    const rendererRef = useRef<THREE.WebGLRenderer>();
    const cameraRef = useRef<THREE.PerspectiveCamera>();
    const pencilRef = useRef<THREE.Group>();
    const drawingCanvasRef = useRef<HTMLCanvasElement>();
    const drawingCtxRef = useRef<CanvasRenderingContext2D>();
    const animationRef = useRef<number>();
    
    // Drawing state
    const isDrawingRef = useRef(false);
    const newlyUpRef = useRef(false);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);
    
    // Mouse state
    const mouseRef = useRef({ x: 0, y: 0 });
    const mousePosRef = useRef(new THREE.Vector3(0, 0, 0));
    const mouseDirectionRef = useRef({ x: 1, y: 1 });
    
    // Pencil state
    const pencilDefaultPosRef = useRef({
      height: 0.08,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0
    });
    
    const pencilPosRef = useRef({
      height: 0.08,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0
    });
    
    const pencilTargetPosRef = useRef({
      height: 0.08,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0,
      heightRotate: 0
    });
    
    // Path state
    const pencilPathDefaultsRef = useRef({
      minThickness: 0.2,
      maxThickness: 2
    });
    
    const pencilPathCurrentRef = useRef({
      thickness: 0.2
    });
    
    const pencilPathTargetRef = useRef({
      thickness: 0.2
    });

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        if (drawingCtxRef.current) {
          drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current!.width, drawingCanvasRef.current!.height);
        }
      },
      savePNG: () => {
        if (drawingCanvasRef.current) {
          const freshCanvas = document.createElement('canvas');
          freshCanvas.width = drawingCanvasRef.current.width;
          freshCanvas.height = drawingCanvasRef.current.height;
          
          const freshCtx = freshCanvas.getContext('2d')!;
          freshCtx.fillStyle = "#f7f4f0";
          freshCtx.fillRect(0, 0, freshCanvas.width, freshCanvas.height);
          freshCtx.drawImage(drawingCanvasRef.current, 0, 0);
          
          const imageDataURL = freshCanvas.toDataURL();
          const image = new Image();
          image.src = imageDataURL;
          
          const w = window.open("");
          w?.document.write(image.outerHTML);
        }
      }
    }));

    // Utility functions
    const rotateAroundWorldAxis = (obj: THREE.Object3D, axis: THREE.Vector3, radians: number) => {
      const rotWorldMatrix = new THREE.Matrix4();
      rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
      rotWorldMatrix.multiply(obj.matrix);
      obj.matrix = rotWorldMatrix;
      obj.setRotationFromMatrix(obj.matrix);
    };

    const isNotClose = (current: number, target: number) => {
      return current < target - 0.004 || current > target + 0.004;
    };

    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const distanceBetween = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    const angleBetween = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    };

    useEffect(() => {
      if (!containerRef.current) return;

      // Initialize Three.js scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Initialize renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        autoClear: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.zIndex = '5';
      renderer.domElement.style.position = 'relative';
      renderer.domElement.style.pointerEvents = 'none';
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Initialize camera
      const camera = new THREE.PerspectiveCamera(8, window.innerWidth / window.innerHeight, 1, 10000);
      camera.position.set(0, 0, 12);
      cameraRef.current = camera;

      // Add lighting
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      hemiLight.color.setHSL(0.6, 1, 0.2);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);
      hemiLight.position.set(0, 0, 50);
      scene.add(hemiLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.color.setHSL(1, 1, 1);
      directionalLight.position.set(-0.5, 1, 10);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      scene.add(directionalLight);

      const spotLight = new THREE.SpotLight(0xffffff, 0.4);
      spotLight.color.setHSL(1, 1, 1);
      spotLight.position.set(-7, 1, 2);
      scene.add(spotLight);

      const topLight = new THREE.SpotLight(0xffffff, 0.1);
      topLight.color.setHSL(1, 1, 1);
      topLight.position.set(1, -7, 2);
      scene.add(topLight);

      // Add ground
      const groundGeo = new THREE.PlaneGeometry(10000, 10000);
      const groundMat = new THREE.ShadowMaterial();
      groundMat.opacity = 0.1;
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.position.set(0, 0, 0);
      ground.receiveShadow = true;
      scene.add(ground);

      // Load pencil model
      const loader = new GLTFLoader();
      loader.load('/src/model/pencil.glb', (gltf) => {
        const pencilGroup = gltf.scene;
        
        // Scale down the pencil to realistic handheld size
        pencilGroup.scale.set(0.15, 0.15, 0.15);
        
        // Enable shadows for all meshes in the model
        pencilGroup.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
          }
        });

        // Set initial rotation - pencil tip pointing down, eraser pointing up
        // First rotate to point downward
        rotateAroundWorldAxis(pencilGroup, new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90));
        // Then tilt slightly for natural writing angle
        rotateAroundWorldAxis(pencilGroup, new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(-15));
        rotateAroundWorldAxis(pencilGroup, new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-10));

        pencilDefaultPosRef.current = {
          height: 0.08,
          xRotate: pencilGroup.rotation.x,
          yRotate: pencilGroup.rotation.y,
          zRotate: pencilGroup.rotation.z
        };

        pencilRef.current = pencilGroup;
        scene.add(pencilGroup);

        // Start animation after model is loaded
        animate();
      }, undefined, (error) => {
        console.error('Error loading pencil model:', error);
        // Fallback to basic pencil if model fails to load
        createFallbackPencil();
      });

      // Fallback pencil creation function
      const createFallbackPencil = () => {
        const pencilGroup = new THREE.Group();
        
        // Pencil body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff4500 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        
        // Pencil tip (cone)
        const tipGeometry = new THREE.ConeGeometry(0.03, 0.2, 8);
        const tipMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.set(0, 0.85, 0);
        tip.castShadow = true;
        
        // Pencil eraser (cylinder)
        const eraserGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.1, 8);
        const eraserMaterial = new THREE.MeshPhongMaterial({ color: 0xffc0cb });
        const eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);
        eraser.position.set(0, -0.8, 0);
        eraser.castShadow = true;
        
        // Metal band
        const bandGeometry = new THREE.CylinderGeometry(0.035, 0.035, 0.05, 8);
        const bandMaterial = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.position.set(0, -0.725, 0);
        band.castShadow = true;
        
        pencilGroup.add(body);
        pencilGroup.add(tip);
        pencilGroup.add(eraser);
        pencilGroup.add(band);
        
        // Scale down the fallback pencil too
        pencilGroup.scale.set(0.15, 0.15, 0.15);
        
        // Initial pencil rotation - tip pointing down, eraser pointing up
        
        pencilDefaultPosRef.current = {
          height: 0.08,
          xRotate: pencilGroup.rotation.x,
          yRotate: pencilGroup.rotation.y,
          zRotate: pencilGroup.rotation.z
        };
        
        pencilRef.current = pencilGroup;
        scene.add(pencilGroup);
        animate();
      };

      // Create drawing canvas
      const drawingCanvas = document.createElement('canvas');
      drawingCanvas.width = window.innerWidth;
      drawingCanvas.height = window.innerHeight;
      drawingCanvas.style.position = 'fixed';
      drawingCanvas.style.left = '0';
      drawingCanvas.style.top = '0';
      drawingCanvas.style.zIndex = '1';
      drawingCanvas.style.cursor = 'none';
      
      const drawingCtx = drawingCanvas.getContext('2d')!;
      drawingCanvasRef.current = drawingCanvas;
      drawingCtxRef.current = drawingCtx;

      containerRef.current.appendChild(renderer.domElement);
      containerRef.current.appendChild(drawingCanvas);

      // Event handlers
      const handleMouseDown = (e: MouseEvent | TouchEvent) => {
        if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
        
        isDrawingRef.current = true;
        pencilTargetPosRef.current.height = 0.02;
        pencilTargetPosRef.current.heightRotate = 0.2;
        pencilPathTargetRef.current.thickness = pencilPathDefaultsRef.current.maxThickness;
        
        const xPos = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const yPos = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        // Calculate pencil tip offset to align drawing with pencil tip exactly
        const pencilTipOffset = { x: 45, y: -25 }; // Adjusted to match exact tip position
        const currentPoint = { x: xPos + pencilTipOffset.x, y: yPos + pencilTipOffset.y };
        
        drawingCtx.beginPath();
        drawingCtx.fillStyle = colors[currentColorIndex];
        drawingCtx.globalAlpha = 0.9;
        drawingCtx.arc(
          currentPoint.x, currentPoint.y, pencilPathDefaultsRef.current.thickness,
          0, Math.PI * 2, false
        );
        drawingCtx.fill();
        
        lastPointRef.current = currentPoint;
      };

      const handleMouseUp = () => {
        newlyUpRef.current = true;
        isDrawingRef.current = false;
        pencilTargetPosRef.current.height = 0.08;
        pencilTargetPosRef.current.heightRotate = 0;
        pencilPathTargetRef.current.thickness = pencilPathDefaultsRef.current.minThickness;
        
        setTimeout(() => {
          newlyUpRef.current = false;
        }, 50);
      };

      const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        
        const xPos = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const yPos = 'touches' in e ? e.touches[0].clientY : e.clientY;
        
        mouseRef.current.x = (xPos / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(yPos / window.innerHeight) * 2 + 1;
        
        // Consistent offset to match pencil tip position exactly
        const pencilTipOffset = { x: 45, y: -25 }; // Matches exact tip position
        
        if (!lastPointRef.current) {
          lastPointRef.current = { x: xPos + pencilTipOffset.x, y: yPos + pencilTipOffset.y };
        }
        
        // 3D position follows mouse directly for precise alignment
        const positionOffset = { x: 0, y: 0 }; // No offset for perfect alignment
          
        const vector = new THREE.Vector3(
          mouseRef.current.x + positionOffset.x, 
          mouseRef.current.y + positionOffset.y, 
          0.5
        );
        vector.unproject(camera);
        
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        mousePosRef.current = camera.position.clone().add(dir.multiplyScalar(distance));
        
        const currentPoint = { x: xPos + pencilTipOffset.x, y: yPos + pencilTipOffset.y };
        const lastPoint = lastPointRef.current;
        
        const xDist = Math.abs(lastPoint.x - currentPoint.x);
        const yDist = Math.abs(lastPoint.y - currentPoint.y);
        
        mouseDirectionRef.current.x = currentPoint.x > lastPoint.x ? 1 : -1;
        mouseDirectionRef.current.y = currentPoint.y > lastPoint.y ? -1 : 1;
        
        const newXAngle = yDist / 100;
        const newZAngle = (xDist / 100) * -1;
        const maxAngle = 0.25;
        
        pencilTargetPosRef.current.xRotate = Math.max(-maxAngle, Math.min(maxAngle, newXAngle));
        pencilTargetPosRef.current.zRotate = Math.max(-maxAngle, Math.min(maxAngle, newZAngle));
        
        if (isDrawingRef.current || newlyUpRef.current) {
          const dist = distanceBetween(currentPoint, lastPoint);
          const angle = angleBetween(lastPoint, currentPoint);
          
          for (let i = 0; i < dist; i += 0.3) {
            const x = lastPoint.x + Math.sin(angle) * i;
            const y = lastPoint.y + Math.cos(angle) * i;
            
            drawingCtx.beginPath();
            drawingCtx.fillStyle = colors[currentColorIndex];
            drawingCtx.globalAlpha = 0.15 + Math.random() * 0.1;
            drawingCtx.arc(
              x, y, pencilPathCurrentRef.current.thickness,
              0, Math.PI * 2, false
            );
            drawingCtx.fill();
          }
        }
        
        lastPointRef.current = currentPoint;
      };

      const handleResize = () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          
          if (drawingCanvas) {
            drawingCanvas.width = window.innerWidth;
            drawingCanvas.height = window.innerHeight;
          }
        }
      };

      // Animation loop
      const animate = () => {
        if (!pencilRef.current) return;
        
        // Update pencil position
        pencilPosRef.current.height += (pencilTargetPosRef.current.height - pencilPosRef.current.height) * 0.2;
        
        pencilRef.current.position.copy(mousePosRef.current);
        // Fine-tune pencil position to align tip with drawing point
        pencilRef.current.position.x -= 0.1; // Adjust X to align tip
        pencilRef.current.position.y += 0.1; // Adjust Y to align tip
        pencilRef.current.position.z += pencilPosRef.current.height;
        
        // Update pencil thickness
        pencilPathCurrentRef.current.thickness += (pencilPathTargetRef.current.thickness - pencilPathCurrentRef.current.thickness) * 0.2;
        
        // Update pencil rotation
        if (isNotClose(pencilPosRef.current.xRotate, pencilTargetPosRef.current.xRotate)) {
          const newRotate = (pencilTargetPosRef.current.xRotate - pencilPosRef.current.xRotate) * 0.2;
          pencilPosRef.current.xRotate += Math.round(newRotate * 1000) / 1000;
          pencilRef.current.rotation.x = pencilPosRef.current.xRotate + pencilDefaultPosRef.current.xRotate;
        }
        
        if (isNotClose(pencilPosRef.current.yRotate, pencilTargetPosRef.current.yRotate)) {
          const newRotate = (pencilTargetPosRef.current.yRotate - pencilPosRef.current.yRotate) * 0.2;
          pencilPosRef.current.yRotate += Math.round(newRotate * 1000) / 1000;
          pencilRef.current.rotation.y = pencilPosRef.current.yRotate + pencilDefaultPosRef.current.yRotate;
        }
        
        const targetZAngle = pencilTargetPosRef.current.zRotate + pencilTargetPosRef.current.heightRotate;
        if (isNotClose(pencilPosRef.current.zRotate, targetZAngle)) {
          const newRotate = (targetZAngle - pencilPosRef.current.zRotate) * 0.2;
          pencilPosRef.current.zRotate += Math.round(newRotate * 1000) / 1000;
          pencilRef.current.rotation.z = pencilPosRef.current.zRotate + pencilDefaultPosRef.current.zRotate;
        }
        
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      // Add event listeners
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchstart', handleMouseDown);
      document.addEventListener('touchend', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('resize', handleResize);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('touchstart', handleMouseDown);
        document.removeEventListener('touchend', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        renderer.dispose();
      };
    }, [colors, currentColorIndex]);

    return <div ref={containerRef} className="pencil-drawing-container" />;
  }
);
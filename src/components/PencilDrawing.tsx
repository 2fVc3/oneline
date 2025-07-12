import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

interface PencilDrawingProps {
  onDrawingStart?: () => void;
  onDrawingEnd?: () => void;
  gameActive?: boolean;
}

export const PencilDrawing = forwardRef<any, PencilDrawingProps>(
  ({ onDrawingStart, onDrawingEnd, gameActive = true }, ref) => {
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
    const lastPointRef = useRef<{x: number, y: number} | null>(null);
    
    // Mouse state
    const mouseRef = useRef({ x: 0, y: 0 });
    const mousePosRef = useRef(new THREE.Vector3(0, 0, 0));
    
    // Pencil state
    const pencilDefaultPosRef = useRef({
      height: 0.15,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0
    });
    
    const pencilPosRef = useRef({
      height: 0.15,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0
    });
    
    const pencilTargetPosRef = useRef({
      height: 0.15,
      xRotate: 0,
      yRotate: 0,
      zRotate: 0
    });

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        if (drawingCtxRef.current && drawingCanvasRef.current) {
          drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
        }
      }
    }));

    // Utility functions
    const isNotClose = (current: number, target: number) => {
      return current < target - 0.004 || current > target + 0.004;
    };

    const distanceBetween = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
      return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    const angleBetween = (point1: {x: number, y: number}, point2: {x: number, y: number}) => {
      return Math.atan2(point2.x - point1.x, point2.y - point1.y);
    };

    const getCanvasSize = () => {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };

    useEffect(() => {
      if (!containerRef.current) return;

      const { width, height } = getCanvasSize();

      // Initialize Three.js scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Initialize renderer
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
      });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.domElement.style.position = 'absolute';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '5';
      renderer.domElement.style.pointerEvents = 'none';
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;

      // Initialize camera with responsive aspect ratio
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 0, 5);
      cameraRef.current = camera;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      directionalLight.castShadow = true;
      scene.add(directionalLight);

      // Create simple pencil geometry
      const createPencil = () => {
        const pencilGroup = new THREE.Group();
        
        // Pencil body
        const bodyGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b35 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        
        // Pencil tip
        const tipGeometry = new THREE.ConeGeometry(0.02, 0.15, 8);
        const tipMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.set(0, 0.575, 0);
        tip.castShadow = true;
        
        // Eraser
        const eraserGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.08, 8);
        const eraserMaterial = new THREE.MeshPhongMaterial({ color: 0xffc0cb });
        const eraser = new THREE.Mesh(eraserGeometry, eraserMaterial);
        eraser.position.set(0, -0.54, 0);
        eraser.castShadow = true;
        
        // Metal band
        const bandGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.03, 8);
        const bandMaterial = new THREE.MeshPhongMaterial({ color: 0xc0c0c0 });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.position.set(0, -0.485, 0);
        band.castShadow = true;
        
        pencilGroup.add(body);
        pencilGroup.add(tip);
        pencilGroup.add(eraser);
        pencilGroup.add(band);
        
        // Scale and rotate pencil
        pencilGroup.scale.set(0.3, 0.3, 0.3);
        pencilGroup.rotation.x = THREE.MathUtils.degToRad(-20);
        pencilGroup.rotation.y = THREE.MathUtils.degToRad(10);
        pencilGroup.rotation.z = THREE.MathUtils.degToRad(-5);
        
        pencilDefaultPosRef.current = {
          height: 0.15,
          xRotate: pencilGroup.rotation.x,
          yRotate: pencilGroup.rotation.y,
          zRotate: pencilGroup.rotation.z
        };
        
        return pencilGroup;
      };

      const pencilGroup = createPencil();
      pencilRef.current = pencilGroup;
      scene.add(pencilGroup);

      // Create drawing canvas
      const drawingCanvas = document.createElement('canvas');
      drawingCanvas.width = width;
      drawingCanvas.height = height;
      drawingCanvas.style.position = 'absolute';
      drawingCanvas.style.top = '0';
      drawingCanvas.style.left = '0';
      drawingCanvas.style.zIndex = '1';
      drawingCanvas.style.cursor = 'none';
      drawingCanvas.style.touchAction = 'none';
      
      const drawingCtx = drawingCanvas.getContext('2d')!;
      drawingCanvasRef.current = drawingCanvas;
      drawingCtxRef.current = drawingCtx;

      containerRef.current.appendChild(renderer.domElement);
      containerRef.current.appendChild(drawingCanvas);

      // Event handlers
      const getEventPosition = (e: MouseEvent | TouchEvent) => {
        if ('touches' in e && e.touches.length > 0) {
          return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
      };

      const handleStart = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        isDrawingRef.current = true;
        onDrawingStart?.();
        
        pencilTargetPosRef.current.height = 0.05;
        
        const pos = getEventPosition(e);
        const currentPoint = { x: pos.x, y: pos.y };
        
        drawingCtx.beginPath();
        drawingCtx.fillStyle = '#2d2d2d';
        drawingCtx.globalAlpha = 0.8;
        drawingCtx.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2, false);
        drawingCtx.fill();
        
        lastPointRef.current = currentPoint;
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        isDrawingRef.current = false;
        onDrawingEnd?.();
        
        pencilTargetPosRef.current.height = 0.15;
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        const pos = getEventPosition(e);
        
        // Update mouse position for 3D
        mouseRef.current.x = (pos.x / width) * 2 - 1;
        mouseRef.current.y = -(pos.y / height) * 2 + 1;
        
        // Update 3D mouse position
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        mousePosRef.current = camera.position.clone().add(dir.multiplyScalar(distance));
        
        // Drawing logic
        if (isDrawingRef.current && lastPointRef.current) {
          const currentPoint = { x: pos.x, y: pos.y };
          const lastPoint = lastPointRef.current;
          
          const dist = distanceBetween(currentPoint, lastPoint);
          const angle = angleBetween(lastPoint, currentPoint);
          
          for (let i = 0; i < dist; i += 1) {
            const x = lastPoint.x + Math.sin(angle) * i;
            const y = lastPoint.y + Math.cos(angle) * i;
            
            drawingCtx.beginPath();
            drawingCtx.fillStyle = '#2d2d2d';
            drawingCtx.globalAlpha = 0.3 + Math.random() * 0.2;
            drawingCtx.arc(x, y, 2 + Math.random(), 0, Math.PI * 2, false);
            drawingCtx.fill();
          }
          
          lastPointRef.current = currentPoint;
        }
      };

      const handleResize = () => {
        const { width: newWidth, height: newHeight } = getCanvasSize();
        
        if (camera && renderer) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
        
        if (drawingCanvas) {
          // Save current drawing
          const imageData = drawingCtx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height);
          
          // Resize canvas
          drawingCanvas.width = newWidth;
          drawingCanvas.height = newHeight;
          
          // Restore drawing (scaled)
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCanvas.width = imageData.width;
          tempCanvas.height = imageData.height;
          tempCtx.putImageData(imageData, 0, 0);
          
          drawingCtx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        }
      };

      // Animation loop
      const animate = () => {
        if (!pencilRef.current) return;
        
        // Smooth height transition
        pencilPosRef.current.height += (pencilTargetPosRef.current.height - pencilPosRef.current.height) * 0.1;
        
        // Update pencil position
        pencilRef.current.position.copy(mousePosRef.current);
        pencilRef.current.position.z += pencilPosRef.current.height;
        
        // Smooth rotation updates
        if (isNotClose(pencilPosRef.current.xRotate, pencilTargetPosRef.current.xRotate)) {
          pencilPosRef.current.xRotate += (pencilTargetPosRef.current.xRotate - pencilPosRef.current.xRotate) * 0.1;
          pencilRef.current.rotation.x = pencilPosRef.current.xRotate + pencilDefaultPosRef.current.xRotate;
        }
        
        if (isNotClose(pencilPosRef.current.yRotate, pencilTargetPosRef.current.yRotate)) {
          pencilPosRef.current.yRotate += (pencilTargetPosRef.current.yRotate - pencilPosRef.current.yRotate) * 0.1;
          pencilRef.current.rotation.y = pencilPosRef.current.yRotate + pencilDefaultPosRef.current.yRotate;
        }
        
        if (isNotClose(pencilPosRef.current.zRotate, pencilTargetPosRef.current.zRotate)) {
          pencilPosRef.current.zRotate += (pencilTargetPosRef.current.zRotate - pencilPosRef.current.zRotate) * 0.1;
          pencilRef.current.rotation.z = pencilPosRef.current.zRotate + pencilDefaultPosRef.current.zRotate;
        }
        
        renderer.render(scene, camera);
        animationRef.current = requestAnimationFrame(animate);
      };

      // Add event listeners for both mouse and touch
      drawingCanvas.addEventListener('mousedown', handleStart);
      drawingCanvas.addEventListener('mouseup', handleEnd);
      drawingCanvas.addEventListener('mousemove', handleMove);
      drawingCanvas.addEventListener('touchstart', handleStart, { passive: false });
      drawingCanvas.addEventListener('touchend', handleEnd, { passive: false });
      drawingCanvas.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('resize', handleResize);

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        
        drawingCanvas.removeEventListener('mousedown', handleStart);
        drawingCanvas.removeEventListener('mouseup', handleEnd);
        drawingCanvas.removeEventListener('mousemove', handleMove);
        drawingCanvas.removeEventListener('touchstart', handleStart);
        drawingCanvas.removeEventListener('touchend', handleEnd);
        drawingCanvas.removeEventListener('touchmove', handleMove);
        window.removeEventListener('resize', handleResize);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        renderer.dispose();
      };
    }, [gameActive, onDrawingStart, onDrawingEnd]);

    return <div ref={containerRef} className="pencil-drawing-container" />;
  }
);
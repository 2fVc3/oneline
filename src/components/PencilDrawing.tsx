import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface PencilDrawingProps {
  onDrawingStart?: () => void;
  onDrawingEnd?: () => void;
  gameActive?: boolean;
}

export const PencilDrawing = forwardRef<any, PencilDrawingProps>(
  ({ onDrawingStart, onDrawingEnd, gameActive = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>();
    const drawingCtxRef = useRef<CanvasRenderingContext2D>();
    const initializedRef = useRef(false);
    
    // Drawing state
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        if (drawingCtxRef.current && drawingCanvasRef.current) {
          drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
        }
      }
    }));

    // Utility functions
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

    // Initialize once and never recreate
    useEffect(() => {
      if (!containerRef.current || initializedRef.current) return;
      
      initializedRef.current = true;
      const { width, height } = getCanvasSize();

      // Create drawing canvas - ONLY ONCE
      const drawingCanvas = document.createElement('canvas');
      drawingCanvas.width = width;
      drawingCanvas.height = height;
      drawingCanvas.style.position = 'absolute';
      drawingCanvas.style.top = '0';
      drawingCanvas.style.left = '0';
      drawingCanvas.style.zIndex = '1';
      drawingCanvas.style.cursor = 'crosshair';
      drawingCanvas.style.touchAction = 'none';
      drawingCanvas.style.background = 'transparent';
      
      const drawingCtx = drawingCanvas.getContext('2d')!;
      drawingCanvasRef.current = drawingCanvas;
      drawingCtxRef.current = drawingCtx;

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
        
        // Only handle left mouse button (button 0) or touch
        if ('button' in e && e.button !== 0) return;
        
        isDrawingRef.current = true;
        onDrawingStart?.();
        
        const pos = getEventPosition(e);
        const currentPoint = { x: pos.x, y: pos.y };
        
        if (drawingCtxRef.current) {
          drawingCtxRef.current.beginPath();
          drawingCtxRef.current.fillStyle = '#2d2d2d';
          drawingCtxRef.current.globalAlpha = 0.8;
          drawingCtxRef.current.arc(currentPoint.x, currentPoint.y, 3, 0, Math.PI * 2, false);
          drawingCtxRef.current.fill();
        }
        
        lastPointRef.current = currentPoint;
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        // Only handle left mouse button release or touch end
        if ('button' in e && e.button !== 0) return;
        
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          
          // Auto-submit drawing when left mouse button is released
          setTimeout(() => {
            onDrawingEnd?.();
          }, 100); // Small delay to ensure drawing is complete
        }
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        const pos = getEventPosition(e);
        
        // Drawing logic - only when left mouse button is pressed
        if (isDrawingRef.current && lastPointRef.current && drawingCtxRef.current) {
          const currentPoint = { x: pos.x, y: pos.y };
          const lastPoint = lastPointRef.current;
          
          const dist = distanceBetween(currentPoint, lastPoint);
          const angle = angleBetween(lastPoint, currentPoint);
          
          // Draw smooth line between points
          for (let i = 0; i < dist; i += 1) {
            const x = lastPoint.x + Math.sin(angle) * i;
            const y = lastPoint.y + Math.cos(angle) * i;
            
            drawingCtxRef.current.beginPath();
            drawingCtxRef.current.fillStyle = '#2d2d2d';
            drawingCtxRef.current.globalAlpha = 0.4 + Math.random() * 0.3;
            drawingCtxRef.current.arc(x, y, 2 + Math.random(), 0, Math.PI * 2, false);
            drawingCtxRef.current.fill();
          }
          
          lastPointRef.current = currentPoint;
        }
      };

      const handleResize = () => {
        const { width: newWidth, height: newHeight } = getCanvasSize();
        
        if (drawingCanvasRef.current && drawingCtxRef.current) {
          // Save current drawing
          const imageData = drawingCtxRef.current.getImageData(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
          
          // Resize canvas
          drawingCanvasRef.current.width = newWidth;
          drawingCanvasRef.current.height = newHeight;
          
          // Restore drawing (scaled)
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCanvas.width = imageData.width;
          tempCanvas.height = imageData.height;
          tempCtx.putImageData(imageData, 0, 0);
          
          drawingCtxRef.current.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        }
      };

      // Add event listeners
      drawingCanvas.addEventListener('mousedown', handleStart);
      drawingCanvas.addEventListener('mouseup', handleEnd);
      drawingCanvas.addEventListener('mousemove', handleMove);
      drawingCanvas.addEventListener('touchstart', handleStart, { passive: false });
      drawingCanvas.addEventListener('touchend', handleEnd, { passive: false });
      drawingCanvas.addEventListener('touchmove', handleMove, { passive: false });
      
      // Prevent context menu on right click
      drawingCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
      
      window.addEventListener('resize', handleResize);

      return () => {
        // Clean up event listeners
        if (drawingCanvasRef.current) {
          drawingCanvasRef.current.removeEventListener('mousedown', handleStart);
          drawingCanvasRef.current.removeEventListener('mouseup', handleEnd);
          drawingCanvasRef.current.removeEventListener('mousemove', handleMove);
          drawingCanvasRef.current.removeEventListener('touchstart', handleStart);
          drawingCanvasRef.current.removeEventListener('touchend', handleEnd);
          drawingCanvasRef.current.removeEventListener('touchmove', handleMove);
          drawingCanvasRef.current.removeEventListener('contextmenu', (e) => e.preventDefault());
        }
        window.removeEventListener('resize', handleResize);
        
        // Only clear container on unmount
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        initializedRef.current = false;
      };
    }, []); // Empty dependency array - only run once!

    return <div ref={containerRef} className="pencil-drawing-container" />;
  }
);
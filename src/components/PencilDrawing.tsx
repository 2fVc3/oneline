import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface PencilDrawingProps {
  onDrawingStart?: () => void;
  onDrawingEnd?: (imageData: string) => void;
  gameActive?: boolean;
}

export const PencilDrawing = forwardRef<any, PencilDrawingProps>(
  ({ onDrawingStart, onDrawingEnd, gameActive = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>();
    const ctxRef = useRef<CanvasRenderingContext2D>();
    const initializedRef = useRef(false);
    
    // Drawing state
    const isDrawingRef = useRef(false);
    const lastPointRef = useRef<{x: number, y: number} | null>(null);

    useImperativeHandle(ref, () => ({
      clearCanvas: () => {
        if (ctxRef.current && canvasRef.current) {
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      },
      captureDrawing: () => {
        if (canvasRef.current) {
          return canvasRef.current.toDataURL('image/png');
        }
        return '';
      }
    }));

    // Initialize canvas once
    useEffect(() => {
      if (!containerRef.current || initializedRef.current) return;
      
      initializedRef.current = true;
      const { width, height } = {
        width: window.innerWidth,
        height: window.innerHeight
      };

      // Create drawing canvas
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '1';
      canvas.style.cursor = 'crosshair';
      canvas.style.touchAction = 'none';
      canvas.style.background = 'transparent';
      
      const ctx = canvas.getContext('2d')!;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#2d2d2d';
      ctx.lineWidth = 3;
      
      canvasRef.current = canvas;
      ctxRef.current = ctx;
      containerRef.current.appendChild(canvas);

      // Event handlers
      const getEventPosition = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        if ('touches' in e && e.touches.length > 0) {
          return { 
            x: e.touches[0].clientX - rect.left, 
            y: e.touches[0].clientY - rect.top 
          };
        }
        return { 
          x: (e as MouseEvent).clientX - rect.left, 
          y: (e as MouseEvent).clientY - rect.top 
        };
      };

      const handleStart = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        // Only handle left mouse button (button 0) or touch
        if ('button' in e && e.button !== 0) return;
        
        isDrawingRef.current = true;
        onDrawingStart?.();
        
        const pos = getEventPosition(e);
        lastPointRef.current = pos;
        
        if (ctxRef.current) {
          ctxRef.current.beginPath();
          ctxRef.current.moveTo(pos.x, pos.y);
        }
      };

      const handleEnd = (e: MouseEvent | TouchEvent) => {
        if (!gameActive) return;
        e.preventDefault();
        
        // Only handle left mouse button release or touch end
        if ('button' in e && e.button !== 0) return;
        
        if (isDrawingRef.current) {
          isDrawingRef.current = false;
          
          // Capture the drawing as polaroid
          const imageData = canvas.toDataURL('image/png');
          
          // Call onDrawingEnd with the captured image
          setTimeout(() => {
            onDrawingEnd?.(imageData);
          }, 100);
        }
      };

      const handleMove = (e: MouseEvent | TouchEvent) => {
        if (!gameActive || !isDrawingRef.current) return;
        e.preventDefault();
        
        const pos = getEventPosition(e);
        
        if (lastPointRef.current && ctxRef.current) {
          ctxRef.current.lineTo(pos.x, pos.y);
          ctxRef.current.stroke();
          lastPointRef.current = pos;
        }
      };

      const handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        
        if (canvasRef.current && ctxRef.current) {
          // Save current drawing
          const imageData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Resize canvas
          canvasRef.current.width = newWidth;
          canvasRef.current.height = newHeight;
          
          // Restore drawing context settings
          ctxRef.current.lineCap = 'round';
          ctxRef.current.lineJoin = 'round';
          ctxRef.current.strokeStyle = '#2d2d2d';
          ctxRef.current.lineWidth = 3;
          
          // Restore drawing (scaled)
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d')!;
          tempCanvas.width = imageData.width;
          tempCanvas.height = imageData.height;
          tempCtx.putImageData(imageData, 0, 0);
          
          ctxRef.current.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
        }
      };

      // Add event listeners
      canvas.addEventListener('mousedown', handleStart);
      canvas.addEventListener('mouseup', handleEnd);
      canvas.addEventListener('mousemove', handleMove);
      canvas.addEventListener('touchstart', handleStart, { passive: false });
      canvas.addEventListener('touchend', handleEnd, { passive: false });
      canvas.addEventListener('touchmove', handleMove, { passive: false });
      
      // Prevent context menu on right click
      canvas.addEventListener('contextmenu', (e) => e.preventDefault());
      
      window.addEventListener('resize', handleResize);

      return () => {
        // Clean up event listeners
        if (canvasRef.current) {
          canvasRef.current.removeEventListener('mousedown', handleStart);
          canvasRef.current.removeEventListener('mouseup', handleEnd);
          canvasRef.current.removeEventListener('mousemove', handleMove);
          canvasRef.current.removeEventListener('touchstart', handleStart);
          canvasRef.current.removeEventListener('touchend', handleEnd);
          canvasRef.current.removeEventListener('touchmove', handleMove);
          canvasRef.current.removeEventListener('contextmenu', (e) => e.preventDefault());
        }
        window.removeEventListener('resize', handleResize);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        
        initializedRef.current = false;
      };
    }, []);

    return <div ref={containerRef} className="pencil-drawing-container" />;
  }
);
import React, { useEffect, useRef, useState } from 'react';
import { PencilDrawing } from './components/PencilDrawing';
import { ColorPicker } from './components/ColorPicker';
import { Controls } from './components/Controls';

const colors = [
  "#100c08",
  "#759BA9", 
  "#77dd77",
  "#ff6961",
  "#ffd1dc"
];

function App() {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const drawingRef = useRef<any>(null);

  const handleClear = () => {
    drawingRef.current?.clearCanvas();
  };

  const handleSave = () => {
    drawingRef.current?.savePNG();
  };

  return (
    <div className="app">
      <PencilDrawing 
        ref={drawingRef}
        colors={colors}
        currentColorIndex={currentColorIndex}
      />
      <ColorPicker 
        colors={colors}
        currentColorIndex={currentColorIndex}
        onColorChange={setCurrentColorIndex}
      />
      <Controls 
        onClear={handleClear}
        onSave={handleSave}
      />
    </div>
  );
}

export default App;
import React, { useState } from "react";

interface GraphSettingsProps {
  setGraphSize: React.Dispatch<React.SetStateAction<number>>;
  setGraphColors: React.Dispatch<React.SetStateAction<string[]>>;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const GraphSettings: React.FC<GraphSettingsProps> = ({ setGraphSize, setGraphColors, setDarkMode }) => {
  const [graphSizeInput, setGraphSizeInput] = useState<number>(300); // default size for the graph
  const [color1, setColor1] = useState<string>("#4CAF50"); // Default color 1
  const [color2, setColor2] = useState<string>("#FFC107"); // Default color 2
  const [color3, setColor3] = useState<string>("#F44336"); // Default color 3

  // Handle Graph Size Change
  const handleGraphSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGraphSizeInput(Number(e.target.value));
    setGraphSize(Number(e.target.value));
  };

  // Handle Color Change
  const handleColorChange = (index: number, color: string) => {
    if (index === 0) setColor1(color);
    else if (index === 1) setColor2(color);
    else if (index === 2) setColor3(color);

    setGraphColors([color1, color2, color3]);
  };

  // Handle Dark Mode Toggle
  const handleDarkModeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Graph Settings</h3>

      {/* Graph Size */}
      <div>
        <label className="block">Graph Size</label>
        <input
          type="number"
          value={graphSizeInput}
          onChange={handleGraphSizeChange}
          min="100"
          max="600"
          className="border p-2 w-full"
        />
      </div>

      {/* Graph Colors */}
      <div>
        <label className="block">Graph Colors</label>
        <input
          type="color"
          value={color1}
          onChange={(e) => handleColorChange(0, e.target.value)}
          className="mr-2"
        />
        <input
          type="color"
          value={color2}
          onChange={(e) => handleColorChange(1, e.target.value)}
          className="mr-2"
        />
        <input
          type="color"
          value={color3}
          onChange={(e) => handleColorChange(2, e.target.value)}
          className="mr-2"
        />
      </div>

      {/* Dark Mode Toggle */}
      <div>
        <label className="block">Dark Mode</label>
        <input
          type="checkbox"
          checked={false}
          onChange={handleDarkModeToggle}
          className="mr-2"
        />
        <span>Enable Dark Mode</span>
      </div>
    </div>
  );
};

export default GraphSettings;

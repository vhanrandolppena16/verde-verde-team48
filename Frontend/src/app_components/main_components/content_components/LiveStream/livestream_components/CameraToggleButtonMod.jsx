import React from 'react';
import { Camera, CameraOff } from 'lucide-react';

const CameraToggleButton = ({ isCameraOn, toggleCamera }) => {
  return (
    <button
      onClick={toggleCamera}
      className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2"
    >
      {isCameraOn ? (
        <span>⏹️ Stop & Save</span>
      ) : (
        <span>🎬 Start Recording</span>
      )}
    </button>
  );
};

export default CameraToggleButton;

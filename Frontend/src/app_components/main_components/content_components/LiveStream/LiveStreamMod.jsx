import React, { useRef, useEffect, useState, useContext } from 'react';
import useCameraManager from './livestream_components/useCameraManagerMod';
import CameraToggleButton from './livestream_components/CameraToggleButtonMod';
import CameraSelector from './livestream_components/CameraSelector';
import { VideoContext } from './livestream_components/VideoContext';

const LiveStreamPage = () => {
  const videoRef = useContext(VideoContext);
  const canvasRef = useRef(null);
  const [customLabel, setCustomLabel] = useState('My Session');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { isCameraOn, devices, selectedDeviceId, setSelectedDeviceId, startCamera, stopCamera } = useCameraManager(videoRef, canvasRef, customLabel);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto mt-6 p-6 max-w-5xl bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-green-900 mb-4">📹 Live Stream</h2>

      <div className="mb-6 p-4 bg-green-100 rounded">
        <div className="text-green-800 font-bold">📅 {currentTime.toLocaleString()}</div>
        <input
          type="text"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
          placeholder="Session Label"
          className="mt-2 p-2 border rounded w-full"
        />
      </div>

      <div className="relative w-full aspect-video bg-black rounded overflow-hidden shadow">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute top-3 right-3 flex gap-2">
          <CameraSelector
            devices={devices}
            selectedDeviceId={selectedDeviceId}
            onChange={(id) => {
              setSelectedDeviceId(id);
              if (isCameraOn) {
                stopCamera();
                startCamera(id);
              }
            }}
          />
          <CameraToggleButton isCameraOn={isCameraOn} toggleCamera={() => isCameraOn ? stopCamera() : startCamera(selectedDeviceId)} />
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPage;

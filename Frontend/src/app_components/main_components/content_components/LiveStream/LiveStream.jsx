// LiveStreamPage.jsx

import React, { useRef, useEffect, useContext } from 'react';
import useCameraManager from './livestream_components/useCameraManager';
import CameraToggleButton from './livestream_components/CameraToggleButton';
import CameraSelector from './livestream_components/CameraSelector';
import RecordButton from './livestream_components/RecordButton';
import { VideoContext } from './livestream_components/VideoContext';

const LiveStreamPage = ({ showControls = true }) => {
  const videoRef = useContext(VideoContext);

  const {
    isCameraOn,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    toggleCamera,
    stopCamera,
    startCamera,
    startRecording, 
    stopRecording, 
    isRecording
  } = useCameraManager(videoRef);

  useEffect(() => {
    document.title = "Livestream | Verde";
  
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        stream.getTracks().forEach(track => track.stop());
      })
      .catch((err) => {
        console.warn("Camera permission not granted:", err);
      });
  }, []);

  return (
    <div className="mx-auto mt-6 px-6 py-4 max-w-4xl bg-white bg-opacity-90 rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-green-900 mb-4">📹 Live Stream</h2>

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover rounded-xl"
        />

        {/* 🎛 Floating Controls (optional) */}
        {showControls && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
            {isRecording && (
            <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-100 text-red-700 text-sm animate-pulse">
                <div className="w-3 h-3 bg-red-600 rounded-full" />
                <span>Recording...</span>
              </div>
            )}
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
            <CameraToggleButton isCameraOn={isCameraOn} toggleCamera={toggleCamera} />
            <RecordButton isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveStreamPage;

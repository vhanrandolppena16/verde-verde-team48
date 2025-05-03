// hooks/useCameraManager.js

import { useEffect, useRef, useState } from 'react';

const useCameraManager = (videoRef) => {
    const [stream, setStream] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const previousDeviceIds = useRef(new Set());
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    
    const getDevices = async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter((device) => device.kind === "videoinput");
  
      const currentDeviceIds = new Set(videoDevices.map((d) => d.deviceId));
      const newDevice = videoDevices.find((d) => !previousDeviceIds.current.has(d.deviceId));
  
      setDevices(videoDevices);
      previousDeviceIds.current = currentDeviceIds;
  
      if (newDevice) {
        setSelectedDeviceId(newDevice.deviceId);
        if (isCameraOn) {
          stopCamera();
          startCamera(newDevice.deviceId);
        }
      } else if (!videoDevices.find((d) => d.deviceId === selectedDeviceId)) {
        const fallback = videoDevices[0];
        if (fallback) {
          setSelectedDeviceId(fallback.deviceId);
          if (isCameraOn) {
            stopCamera();
            startCamera(fallback.deviceId);
          }
        } else {
          stopCamera();
          setSelectedDeviceId("");
        }
      }
    };
  
    const startCamera = async (deviceId) => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing webcam: ", err);
        alert("Unable to access camera. Please allow permission and ensure no other app is using it.");
    }
    };
  
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setIsCameraOn(false);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };
  
    const toggleCamera = () => {
      isCameraOn ? stopCamera() : startCamera(selectedDeviceId);
    };

    const startRecording = () => {
      if (!stream) return;
      const recorder = new MediaRecorder(stream);
      setRecordedChunks([]);
  
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
  
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const file = new File([blob], `recording-${Date.now()}.mp4`, { type: 'video/mp4' });
        uploadToBackend(file);
      };
  
      recorder.start();
      setMediaRecorder(recorder);
    };
  
    const stopRecording = () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    }; 
    
    const uploadToBackend = async (file) => {
      const formData = new FormData();
      formData.append("video", file);
  
      try {
        const res = await fetch("http://localhost:5001/upload", {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        alert(`✅ Saved: ${result.filename}`);
      } catch (err) {
        alert("❌ Upload error");
        console.error(err);
      }
    };  
  
    useEffect(() => {
      getDevices();
      navigator.mediaDevices.addEventListener('devicechange', getDevices);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      };
    }, [isCameraOn, selectedDeviceId]);
  
    useEffect(() => {
      if (selectedDeviceId && !isCameraOn) {
        startCamera(selectedDeviceId);
      }
    }, [selectedDeviceId]);
  
    return {
      stream,
      isCameraOn,
      devices,
      selectedDeviceId,
      setSelectedDeviceId,
      toggleCamera,
      stopCamera,
      startCamera,
      startRecording,
      stopRecording,
      isRecording: mediaRecorder?.state === "recording",
    };
  };
  
  export default useCameraManager;
  
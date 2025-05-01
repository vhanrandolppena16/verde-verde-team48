import { useEffect, useRef, useState } from 'react';
import { convertWebMtoMP4 } from './ffmpegUtils';

const useCameraManager = (videoRef, canvasRef, customLabel) => {
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [recordingChunks, setRecordingChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const animationFrameId = useRef(null);

  const getDevices = async () => {
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
    setDevices(videoDevices);
    if (videoDevices.length && !selectedDeviceId) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  };

  const startCamera = async (deviceId) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();

          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }

          startRecording();
        };
      }

      setStream(mediaStream);
      setIsCameraOn(true);

    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Cannot access camera. Please allow permission.');
    }
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const drawFrame = () => {
      if (videoRef.current && canvas) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(new Date().toLocaleTimeString(), 10, 30);
      }
      animationFrameId.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    const canvasStream = canvas.captureStream(5);
    const recorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = recorder;
    setRecordingChunks([]);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        setRecordingChunks(prev => [...prev, e.data]);
      }
    };

    recorder.start();
  };

  const stopCamera = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      cancelAnimationFrame(animationFrameId.current);
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setIsCameraOn(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    saveRecording(); // Automatically save when stopping
  };

  const saveRecording = async () => {
    const blob = new Blob(recordingChunks, { type: 'video/webm' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `timelapse_${timestamp}`;

    // Save video
    const webmUrl = URL.createObjectURL(blob);
    const aWebM = document.createElement('a');
    aWebM.href = webmUrl;
    aWebM.download = `${filename}.webm`;
    document.body.appendChild(aWebM);
    aWebM.click();
    URL.revokeObjectURL(webmUrl);
    document.body.removeChild(aWebM);

    // Save label
    const metadata = { sessionName: customLabel, recordedAt: new Date().toISOString() };
    const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
    const metadataUrl = URL.createObjectURL(metadataBlob);

    const aMeta = document.createElement('a');
    aMeta.href = metadataUrl;
    aMeta.download = `${filename}_label.json`;
    document.body.appendChild(aMeta);
    aMeta.click();
    URL.revokeObjectURL(metadataUrl);
    document.body.removeChild(aMeta);

    alert('Video and Label Saved!');
  };

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  }, []);

  return { isCameraOn, devices, selectedDeviceId, setSelectedDeviceId, startCamera, stopCamera };
};

export default useCameraManager;

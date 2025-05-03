// livestream_components/RecordButton.jsx

import React from 'react';
import { Circle, Square } from 'lucide-react';

const RecordButton = ({ isRecording, startRecording, stopRecording }) => (
  <button onClick={isRecording ? stopRecording : startRecording} className="p-1 text-blue-600">
    {isRecording ? <Square size={24} /> : <Circle size={24} />}
  </button>
);

export default RecordButton;

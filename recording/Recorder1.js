import recorder from 'recorder-core';
import 'recorder-core/src/engine/mp3';

let audioRecorder;
let recordedChunks = [];

export function startRecording(volumeCallback) {
  recordedChunks = [];
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    audioRecorder = new recorder(new MediaStream([stream]), {
      type: 'mp3',
    });

    // 監聽音量變化並回傳給volumeCallback
    audioRecorder.onprocess = (e) => {
      if (e.inputBuffer) {
        const buffer = e.inputBuffer.getChannelData(0);
        const rms = Math.sqrt(buffer.map((x) => x * x).reduce((acc, curr) => acc + curr) / buffer.length);
        volumeCallback(rms);
      }
    };

    audioRecorder.ondataavailable = (e) => {
      recordedChunks.push(e.data);
    };
    audioRecorder.start();
  });
}

export function stopRecording() {
  if (audioRecorder && audioRecorder.state !== 'inactive') {
    return new Promise((resolve) => {
      audioRecorder.onstop = () => {
        resolve(recordedChunks);
      };
      audioRecorder.stop();
    });
  } else {
    return Promise.resolve([]);
  }
}

export function saveRecording(recordedChunks) {
  const blob = new Blob(recordedChunks, { type: 'audio/mp3' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'record.mp3';
  a.click();
}

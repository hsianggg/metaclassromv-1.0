<template>
  <div>
    <h1>錄音功能測試</h1>
    <div>
      <button v-if="!isRecording" @click="handleStartRecording">開始錄音</button>
      <button v-else @click="handleStopRecording" class="stop-button">停止錄音</button>
    </div>
    <div class="volume-meter" :style="{ width: volume * 100 + '%' }"></div>
  </div>
</template>

<script>
import { startRecording, stopRecording, saveRecording } from '../recording/Recorder1.js';

export default {
  data() {
    return {
      isRecording: false,
      volume: 0,
    };
  },
  methods: {
    async handleStartRecording() {
      try {
        await startRecording((volume) => {
          this.volume = volume; // 更新音量條顯示
        });
        this.isRecording = true;
      } catch (error) {
        console.error('無法開始錄音：', error);
      }
    },
    async handleStopRecording() {
      try {
        const recordedChunks = await stopRecording();
        this.isRecording = false;
        saveRecording(recordedChunks);
      } catch (error) {
        console.error('無法停止錄音：', error);
      }
    },
  },
};
</script>

<style>
h1 {
  font-size: 3.2em;
  line-height: 1.1;
  color: #fff;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 0.5em;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

.stop-button {
  width: 3em;
  height: 3em;
}

.volume-meter {
  height: 20px;
  background-color: #646cff;
  margin-top: 1em;
}
</style>

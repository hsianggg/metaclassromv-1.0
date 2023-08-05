<template>
  <div>
    <button v-if="!isRecording" @click="handleStartRecording">開始錄音</button>
    <button v-else @click="handleStopRecording" class="stop-button">停止錄音</button>
  </div>
</template>

<script>
import { startRecording, stopRecording, saveRecording } from '../recording/Recorder1.js';

export default {
  data() {
    return {
      isRecording: false,
    };
  },
  methods: {
    async handleStartRecording() {
      try {
        await startRecording();
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
.stop-button {
  width: 3em;
  height: 3em;
}
</style>

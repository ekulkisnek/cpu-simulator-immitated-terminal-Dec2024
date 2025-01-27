import { CPUCore } from '../lib/simulation/cpu-core';

const cpu = new CPUCore();

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'STEP':
      cpu.step();
      self.postMessage({
        type: 'UPDATE',
        payload: cpu.getMetrics()
      });
      break;

    case 'RESET':
      cpu.reset();
      self.postMessage({
        type: 'UPDATE',
        payload: cpu.getMetrics()
      });
      break;

    case 'LOAD_PROGRAM':
      cpu.loadProgram(payload.instructions);
      self.postMessage({
        type: 'UPDATE',
        payload: cpu.getMetrics()
      });
      break;

    case 'CONFIG':
      if (payload.pipeline) {
        cpu.setPipelineConfig(payload.pipeline);
      }
      if (payload.cache) {
        cpu.setCacheConfig(payload.cache);
      }
      self.postMessage({
        type: 'UPDATE',
        payload: cpu.getMetrics()
      });
      break;
  }
};

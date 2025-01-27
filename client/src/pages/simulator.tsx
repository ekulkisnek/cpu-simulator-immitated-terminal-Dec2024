import { useEffect, useState } from 'react';
import { Terminal } from '@/components/CPUSimulator/Terminal';
import { Pipeline } from '@/components/CPUSimulator/Pipeline';
import { Commands } from '@/components/CPUSimulator/Commands';
import { Cache } from '@/components/CPUSimulator/Cache';
import { Metrics } from '@/components/CPUSimulator/Metrics';
import { CPUCore } from '@/lib/simulation/cpu-core';

export default function Simulator() {
  const [cpu] = useState(() => new CPUCore());
  const [metrics, setMetrics] = useState<any>({});
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let animationFrame: number;

    const updateSimulation = () => {
      if (running) {
        cpu.step();
        setMetrics(cpu.getMetrics());
        animationFrame = requestAnimationFrame(updateSimulation);
      }
    };

    if (running) {
      animationFrame = requestAnimationFrame(updateSimulation);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [running, cpu]);

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd) {
      case 'run':
        setRunning(true);
        break;
      case 'stop':
        setRunning(false);
        break;
      case 'reset':
        cpu.reset();
        setMetrics(cpu.getMetrics());
        break;
      case 'step':
        cpu.step();
        setMetrics(cpu.getMetrics());
        break;
      case 'load':
        const program = [
          'add r1, r2, r3',
          'sub r4, r1, r5',
          'lw r6, 0(r7)',
          'sw r8, 4(r9)',
          'beq r10, r11, label',
        ];
        cpu.loadProgram(program);
        setMetrics(cpu.getMetrics());
        break;
      default:
        console.log('Unknown command:', command);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          CPU Simulator
        </h1>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <Terminal onCommand={handleCommand} />
            <div className="grid grid-cols-2 gap-6">
              <Pipeline stages={metrics.pipelineState || []} />
              <Commands />
            </div>
          </div>
          
          <div className="space-y-6">
            <Cache
              entries={metrics.cacheState?.l1d || []}
              hitRate={0.95}
              missRate={0.05}
            />
            <Metrics
              data={metrics.metrics || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

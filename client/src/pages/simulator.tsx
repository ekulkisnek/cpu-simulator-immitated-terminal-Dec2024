import { useEffect, useState } from 'react';
import { Terminal } from '@/components/CPUSimulator/Terminal';
import { Pipeline } from '@/components/CPUSimulator/Pipeline';
import { Commands } from '@/components/CPUSimulator/Commands';
import { Cache } from '@/components/CPUSimulator/Cache';
import { CacheLog } from '@/components/CPUSimulator/CacheLog';
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
    let result = '';

    switch (cmd) {
      case 'run':
        setRunning(true);
        result = 'Started program execution';
        break;
      case 'stop':
        setRunning(false);
        result = 'Stopped program execution';
        break;
      case 'reset':
        cpu.reset();
        setMetrics(cpu.getMetrics());
        result = 'CPU state reset';
        break;
      case 'step':
        cpu.step();
        const metrics = cpu.getMetrics();
        setMetrics(metrics);
        result = `Executed one cycle. Current instruction: ${metrics.currentInstruction || 'None'}`;
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
        result = 'Loaded example program';
        break;
      case 'help':
        result = 'Available commands:\n' +
          '- load <file>: Load program from file\n' +
          '- run: Start program execution\n' +
          '- stop: Stop program execution\n' +
          '- step: Execute one cycle\n' +
          '- reset: Reset CPU state\n' +
          '\nExample files: example1.asm, example2.asm, example3.asm';
        break;
      default:
        result = 'Unknown command. Type "help" for available commands';
    }
    
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CPU Simulator
          </h1>
          <p className="text-gray-600">
            Interactive CPU simulator demonstrating pipelining, caching, and instruction execution.
            Use the terminal below to control the simulation.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Terminal</h2>
              <p className="text-gray-600 text-sm">Enter commands to control the CPU simulation.  Available commands: run, stop, reset, step, load.  See the Commands section for details and examples.</p>
              <Terminal onCommand={handleCommand} />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Pipeline</h2>
                <p className="text-gray-600 text-sm">Visual representation of the CPU pipeline stages. Each box represents a stage; color indicates status (e.g., green for active, red for stalled).  The pipeline shows instruction flow through the different execution stages.</p>
                <Pipeline stages={metrics.pipelineState || []} />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-medium text-gray-900 mb-2">Commands</h2>
                <p className="text-gray-600 text-sm">List of available commands with example usages.</p>
                <Commands />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="bg-white p-4 rounded-lg shadow-md h-[400px] overflow-y-auto">
              <h2 className="text-lg font-medium text-gray-900 mb-2">L1 Data Cache</h2>
              <Cache
                entries={metrics.cacheState?.l1d || []}
                hitRate={metrics.cacheStats?.l1d?.hitRate || 0}
                missRate={metrics.cacheStats?.l1d?.missRate || 0}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <CacheLog 
                entries={metrics.cacheState?.l1d || []}
                previousEntries={metrics.previousCacheState?.l1d}
              />
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Metrics</h2>
              <Metrics data={metrics.metrics || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
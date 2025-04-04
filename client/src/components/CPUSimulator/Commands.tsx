import { Card } from '@/components/ui/card';

const AVAILABLE_COMMANDS = [
  { 
    command: 'load <file>', 
    description: 'Load program from file',
    example: 'load program.asm',
    details: 'Loads assembly instructions into the CPU simulator. Example program includes basic arithmetic and memory operations.'
  },
  { 
    command: 'run', 
    description: 'Start program execution',
    example: 'run',
    details: 'Continuously executes the loaded program instructions through the pipeline stages.'
  },
  { 
    command: 'stop', 
    description: 'Stop program execution',
    example: 'stop',
    details: 'Pauses the current program execution, allowing inspection of CPU state.'
  },
  { 
    command: 'step', 
    description: 'Execute one cycle',
    example: 'step',
    details: 'Advances the pipeline by one clock cycle, useful for detailed instruction execution analysis.'
  },
  { 
    command: 'reset', 
    description: 'Reset CPU state',
    example: 'reset',
    details: 'Clears all pipeline stages, cache contents, and returns CPU to initial state.'
  }
];

export function Commands() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-2">Available Commands</h3>
      <p className="text-sm text-gray-600 mb-4">Enter commands in the terminal below to control the CPU simulator.</p>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {AVAILABLE_COMMANDS.map((cmd) => (
          <div key={cmd.command} className="space-y-1">
            <div className="flex items-start">
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                {cmd.command}
              </code>
              <span className="ml-3 text-sm text-gray-600">{cmd.description}</span>
            </div>
            <div className="ml-4">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Example:</span> {cmd.example}
              </div>
              <div className="text-sm text-gray-500">{cmd.details}</div>
            </div>
          </div>
        ))}
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-2">Example Programs</h3>
      <div className="space-y-2">
        <div className="p-2 border rounded">
          <h4 className="font-medium">basic_arithmetic.asm</h4>
          <pre className="text-sm bg-gray-50 p-2 mt-1">
            add r1, r2, r3{'\n'}
            sub r4, r1, r5{'\n'}
            lw r6, 0(r7)
          </pre>
        </div>
        <div className="p-2 border rounded">
          <h4 className="font-medium">memory_loop.asm</h4>
          <pre className="text-sm bg-gray-50 p-2 mt-1">
            lw r1, 0(r2){'\n'}
            add r3, r1, r4{'\n'}
            beq r3, r5, loop
          </pre>
        </div>
        <div className="p-2 border rounded">
          <h4 className="font-medium">store_compute.asm</h4>
          <pre className="text-sm bg-gray-50 p-2 mt-1">
            sw r1, 4(r2){'\n'}
            add r3, r4, r5{'\n'}
            sub r6, r3, r7
          </pre>
        </div>
      </div>
    </Card>
  );
}
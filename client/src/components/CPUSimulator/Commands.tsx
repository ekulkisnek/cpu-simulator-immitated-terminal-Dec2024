
import { Card } from '@/components/ui/card';

const AVAILABLE_COMMANDS = [
  { command: 'load <file>', description: 'Load program from file' },
  { command: 'run', description: 'Start program execution' },
  { command: 'stop', description: 'Stop program execution' },
  { command: 'step', description: 'Execute one cycle' },
  { command: 'reset', description: 'Reset CPU state' },
  { command: 'status', description: 'Show current CPU status' },
  { command: 'help', description: 'Show available commands' },
];

export function Commands() {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Available Commands</h3>
      <div className="space-y-2">
        {AVAILABLE_COMMANDS.map((cmd) => (
          <div key={cmd.command} className="flex items-start">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              {cmd.command}
            </code>
            <span className="ml-3 text-sm text-gray-600">{cmd.description}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

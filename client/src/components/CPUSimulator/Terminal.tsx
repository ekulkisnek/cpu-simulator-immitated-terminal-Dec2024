import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface TerminalProps {
  onCommand: (command: string) => void;
}

interface TerminalLine {
  id: number;
  content: string;
  type: 'input' | 'output' | 'error';
}

export function Terminal({ onCommand }: TerminalProps) {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLine = (content: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [...prev, { id: Date.now(), content, type }]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (input.trim()) {
        addLine(`$ ${input}`, 'input');
        setCommandHistory(prev => [...prev, input]);
        const result = onCommand(input);
        if (result) {
          addLine(result, 'output');
        }
        setInput('');
        setHistoryIndex(-1);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white text-black border border-gray-200 font-mono text-sm">
      <ScrollArea className="flex-grow p-4" ref={scrollRef}>
        {history.map(line => (
          <div
            key={line.id}
            className={`mb-1 ${
              line.type === 'error' ? 'text-red-400' :
              line.type === 'input' ? 'text-blue-400' : ''
            }`}
          >
            {line.content}
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t border-gray-800">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-green-400 focus:ring-0"
          placeholder="Type a command..."
          spellCheck={false}
        />
      </div>
    </Card>
  );
}

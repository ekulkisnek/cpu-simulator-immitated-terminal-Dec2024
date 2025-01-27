
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CacheEntry {
  index: number;
  tag: string;
  valid: boolean;
  dirty: boolean;
  data: string;
}

interface CacheLogProps {
  entries: CacheEntry[];
  previousEntries?: CacheEntry[];
}

export function CacheLog({ entries, previousEntries }: CacheLogProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const prevEntriesRef = useRef(entries);

  useEffect(() => {
    if (!previousEntries || !entries) return;
    
    const changes: string[] = [];
    const timestamp = new Date().toLocaleTimeString();
    
    entries.forEach((entry, i) => {
      const prev = previousEntries[i];
      if (!prev) return;
      
      if (entry.valid !== prev.valid) {
        changes.push(
          `Cache line ${entry.index}: ${entry.valid ? 'Activated' : 'Invalidated'}`
        );
      }
      if (entry.dirty !== prev.dirty) {
        changes.push(
          `Cache line ${entry.index}: ${entry.dirty ? 'Modified' : 'Written back to memory'}`
        );
      }
      if (entry.tag !== prev.tag) {
        changes.push(
          `Cache line ${entry.index}: New data loaded from address ${entry.tag}`
        );
      }
    });

    if (changes.length > 0) {
      const logDiv = document.createElement('div');
      logDiv.className = 'mb-2 text-sm';
      logDiv.innerHTML = `
        <span class="text-gray-500">${timestamp}</span>
        <div class="ml-2">${changes.join('<br/>')}</div>
      `;
      logRef.current?.appendChild(logDiv);
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    }
    
    prevEntriesRef.current = entries;
  }, [entries, previousEntries]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Cache Activity Log</h3>
      <ScrollArea className="h-[200px] w-full rounded-md border p-4">
        <div ref={logRef} className="space-y-2" />
      </ScrollArea>
    </Card>
  );
}

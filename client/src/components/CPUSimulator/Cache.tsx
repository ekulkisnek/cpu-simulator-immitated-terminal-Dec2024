import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

interface CacheEntry {
  index: number;
  tag: string;
  valid: boolean;
  dirty: boolean;
  data: string;
}

interface CacheProps {
  entries: CacheEntry[];
  hitRate: number;
  missRate: number;
}

export function Cache({ entries, hitRate, missRate }: CacheProps) {
  const limitedEntries = entries?.slice(0, 8) || []; // Show fewer entries for better visibility
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = entries.length * 40 + 60;
    const rowHeight = 30;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Header
    const header = svg
      .append("g")
      .attr("transform", "translate(0, 30)")
      .attr("class", "text-sm font-semibold");

    ["Index", "Tag", "Valid", "Dirty", "Data"].forEach((text, i) => {
      header
        .append("text")
        .attr("x", (i * width) / 5 + 10)
        .text(text);
    });

    // Cache entries
    entries.forEach((entry, i) => {
      const row = svg
        .append("g")
        .attr("transform", `translate(0, ${i * rowHeight + 60})`);

      row
        .append("rect")
        .attr("width", width)
        .attr("height", rowHeight)
        .attr("class", `${
          i % 2 === 0 ? "fill-gray-50" : "fill-white"
        } stroke-gray-200`);

      // Index
      row
        .append("text")
        .attr("x", 10)
        .attr("y", rowHeight / 2)
        .attr("dy", "0.35em")
        .attr("class", "text-sm")
        .text(entry.index);

      // Tag
      row
        .append("text")
        .attr("x", width / 5 + 10)
        .attr("y", rowHeight / 2)
        .attr("dy", "0.35em")
        .attr("class", "text-sm font-mono")
        .text(entry.tag);

      // Valid
      row
        .append("circle")
        .attr("cx", (2 * width) / 5 + 20)
        .attr("cy", rowHeight / 2)
        .attr("r", 6)
        .attr("class", `${
          entry.valid ? "fill-green-500" : "fill-red-500"
        }`);

      // Dirty
      row
        .append("circle")
        .attr("cx", (3 * width) / 5 + 20)
        .attr("cy", rowHeight / 2)
        .attr("r", 6)
        .attr("class", `${
          entry.dirty ? "fill-yellow-500" : "fill-gray-300"
        }`);

      // Data
      row
        .append("text")
        .attr("x", (4 * width) / 5 + 10)
        .attr("y", rowHeight / 2)
        .attr("dy", "0.35em")
        .attr("class", "text-sm font-mono")
        .text(entry.data);
    });

    // Statistics
    svg
      .append("text")
      .attr("x", 10)
      .attr("y", height - 10)
      .attr("class", "text-sm")
      .text(`Hit Rate: ${(hitRate * 100).toFixed(1)}% | Miss Rate: ${(
        missRate * 100
      ).toFixed(1)}%`);
  }, [entries, hitRate, missRate]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Cache Status</h3>
      <svg ref={svgRef} />
    </Card>
  );
}

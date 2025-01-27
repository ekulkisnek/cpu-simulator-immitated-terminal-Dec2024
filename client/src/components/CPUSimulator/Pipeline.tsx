import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Card } from '@/components/ui/card';

interface PipelineProps {
  stages: {
    name: string;
    instruction?: string;
    stalled: boolean;
    hazard?: string;
  }[];
}

export function Pipeline({ stages }: PipelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 200;
    const stageWidth = width / 5;
    const stageHeight = height * 0.6;

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Draw pipeline stages
    stages.forEach((stage, i) => {
      const g = svg
        .append("g")
        .attr("transform", `translate(${i * stageWidth + 10}, ${height * 0.2})`);

      // Stage box
      g.append("rect")
        .attr("width", stageWidth - 20)
        .attr("height", stageHeight)
        .attr("rx", 5)
        .attr("class", `${
          stage.stalled
            ? "fill-red-200 stroke-red-500"
            : "fill-blue-100 stroke-blue-500"
        }`)
        .attr("stroke-width", 2);

      // Stage name
      g.append("text")
        .attr("x", (stageWidth - 20) / 2)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .attr("class", "font-bold text-sm")
        .text(stage.name);

      // Instruction
      if (stage.instruction) {
        g.append("text")
          .attr("x", (stageWidth - 20) / 2)
          .attr("y", stageHeight / 2)
          .attr("text-anchor", "middle")
          .attr("class", "text-sm")
          .text(stage.instruction);
      }

      // Hazard indicator
      if (stage.hazard) {
        g.append("text")
          .attr("x", (stageWidth - 20) / 2)
          .attr("y", stageHeight + 20)
          .attr("text-anchor", "middle")
          .attr("class", "text-xs text-red-500")
          .text(stage.hazard);
      }
    });
  }, [stages]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Pipeline Status</h3>
      <svg ref={svgRef} />
    </Card>
  );
}

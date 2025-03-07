import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { BSTNode } from '../types/BSTTypes';

interface BSTVisualizationProps {
  tree: BSTNode;
  onNodeDelete: (value: number) => void;
  onNodeClick: (value: number) => void;
  currentNode?: number | null;
  visitedNodes: number[];
}

export const BSTVisualization = ({ 
  tree, 
  onNodeDelete, 
  onNodeClick,
  currentNode,
  visitedNodes
}: BSTVisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 300; // Reduced from 400
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const processTreeForVisualization = (node: BSTNode): any => {
      if (!node || node.value === null) return null;
      return {
        value: node.value,
        children: node.children
          .map(child => processTreeForVisualization(child))
          .filter(child => child !== null)
      };
    };

    const visualTree = processTreeForVisualization(tree);
    if (!visualTree) return;

    const hierarchy = d3.hierarchy(visualTree);
    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const treeData = treeLayout(hierarchy);

    // Add drag behavior
    const drag = d3.drag<SVGGElement, any>()
      .on("drag", (event, d: any) => {
        d.x = event.x;
        d.y = event.y;
        d3.select(event.sourceEvent.target.parentNode)
          .attr("transform", `translate(${d.x},${d.y})`);
        
        g.selectAll(".link")
          .attr("d", d3.linkVertical()
            .x((d: any) => d.x)
            .y((d: any) => d.y));
      });

    // Draw links with primary color and animation
    g.selectAll(".link")
      .data(treeData.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y))
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Draw nodes with animation
    const nodes = g.selectAll(".node")
      .data(treeData.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Add circles to nodes with dynamic colors and animation
    nodes.append("circle")
      .attr("r", 0)
      .attr("fill", (d: any) => {
        if (d.data.value === currentNode) return "hsl(var(--primary))";
        if (visitedNodes.includes(d.data.value)) return "hsl(var(--primary) / 0.8)";
        return "white";
      })
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("class", "transition-colors duration-300")
      .transition()
      .duration(500)
      .attr("r", 25);

    // Add text to nodes with animation
    nodes.append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("class", "text-sm font-medium")
      .style("opacity", 0)
      .text((d: any) => d.data.value)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Add drag behavior to nodes
    nodes.call(drag as any);

    // Add click handler for node update
    nodes.on("click", (event, d: any) => {
      event.preventDefault();
      if (d.data.value !== null) {
        onNodeClick(d.data.value);
      }
    });

    // Add delete functionality on double click
    nodes.on("dblclick", (event, d: any) => {
      event.preventDefault();
      if (d.data.value !== null) {
        onNodeDelete(d.data.value);
      }
    });

  }, [tree, onNodeDelete, onNodeClick, currentNode, visitedNodes]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-[400px] border border-gray-200 rounded-lg bg-white shadow-lg" // Reduced from 500px
    />
  );
};
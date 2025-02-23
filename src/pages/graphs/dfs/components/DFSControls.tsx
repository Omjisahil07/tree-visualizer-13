
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraphNode } from "../../types/GraphTypes";
import { useState } from "react";
import { toast } from "sonner";

interface DFSControlsProps {
  onAddNode: (value: string) => void;
  onAddEdge: (from: string, to: string) => void;
  onDeleteNode: (id: number) => void;
  onUpdateNode: (id: number, newValue: number) => void;
  onStartTraversal: () => void;
  isTraversing: boolean;
  nodes: GraphNode[];
  startNode: number | null;
  onStartNodeChange: (value: number) => void;
}

export const DFSControls = ({
  onAddNode,
  onAddEdge,
  onDeleteNode,
  onUpdateNode,
  onStartTraversal,
  isTraversing,
  nodes,
  startNode,
  onStartNodeChange
}: DFSControlsProps) => {
  const [nodeValue, setNodeValue] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [selectedNode, setSelectedNode] = useState<string>("");
  const [newValue, setNewValue] = useState("");
  const [childCount, setChildCount] = useState("");
  const [currentParentIndex, setCurrentParentIndex] = useState(0);
  const [remainingChildren, setRemainingChildren] = useState(0);

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nodeValue) {
      // If this is the first node, just add it
      if (nodes.length === 0) {
        onAddNode(nodeValue);
        setNodeValue("");
        
        // Ask for number of children
        const count = window.prompt("How many children nodes for this root node?");
        if (count) {
          setChildCount(count);
          setRemainingChildren(parseInt(count));
        }
      } else {
        // Add node and create edge from parent
        onAddNode(nodeValue);
        
        // Connect to current parent
        if (currentParentIndex < nodes.length) {
          onAddEdge(nodes[currentParentIndex].id.toString(), (nodes.length).toString());
        }

        setNodeValue("");

        // Update remaining children count
        const remaining = remainingChildren - 1;
        setRemainingChildren(remaining);

        // If we've added all children for current parent, move to next parent
        if (remaining === 0) {
          const nextParentIndex = currentParentIndex + 1;
          setCurrentParentIndex(nextParentIndex);

          // Ask for children count for next parent if needed
          const count = window.prompt(`How many children for node ${nodes[nextParentIndex]?.value}?`);
          if (count) {
            setRemainingChildren(parseInt(count));
          }
        }

        toast.success(`Connected to node ${nodes[currentParentIndex]?.value}`);
      }
    }
  };

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromNode && toNode) {
      onAddEdge(fromNode, toNode);
      setFromNode("");
      setToNode("");
      toast.success("Edge added successfully");
    }
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      onDeleteNode(parseInt(selectedNode));
      setSelectedNode("");
      toast.success("Node deleted successfully");
    }
  };

  const handleUpdateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedNode && newValue) {
      onUpdateNode(parseInt(selectedNode), parseInt(newValue));
      setNewValue("");
      toast.success("Node updated successfully");
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <div>
        <h3 className="text-lg font-medium mb-4">Add Node</h3>
        <form onSubmit={handleAddNode} className="flex gap-2">
          <Input
            type="number"
            placeholder="Node value"
            value={nodeValue}
            onChange={(e) => setNodeValue(e.target.value)}
          />
          <Button type="submit">Add Node</Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Add Edge</h3>
        <form onSubmit={handleAddEdge} className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="From node"
              value={fromNode}
              onChange={(e) => setFromNode(e.target.value)}
            />
            <Input
              type="number"
              placeholder="To node"
              value={toNode}
              onChange={(e) => setToNode(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Add Edge</Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Delete Node</h3>
        <div className="space-y-2">
          <Select
            value={selectedNode}
            onValueChange={setSelectedNode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select node to delete" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id.toString()}>
                  Node {node.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleDeleteNode} 
            className="w-full"
            variant="destructive"
            disabled={!selectedNode}
          >
            Delete Node
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Update Node</h3>
        <form onSubmit={handleUpdateNode} className="space-y-2">
          <Select
            value={selectedNode}
            onValueChange={setSelectedNode}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select node to update" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id.toString()}>
                  Node {node.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="New value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={!selectedNode || !newValue}
          >
            Update Node
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Start Traversal</h3>
        <div className="space-y-2">
          <Select
            value={startNode?.toString()}
            onValueChange={(value) => onStartNodeChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select start node" />
            </SelectTrigger>
            <SelectContent>
              {nodes.map((node) => (
                <SelectItem key={node.id} value={node.id.toString()}>
                  Node {node.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="w-full" 
            onClick={onStartTraversal}
            disabled={isTraversing || startNode === null}
          >
            {isTraversing ? "Traversing..." : "Start DFS"}
          </Button>
        </div>
      </div>
    </div>
  );
};

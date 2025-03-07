import { Info } from "lucide-react";

export const Instructions = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Available Functions</h3>
      </div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li>• Enter a number and select insertion position (Left, Right, or Auto)</li>
        <li>• Click "Insert Node" to add a new node at the selected position</li>
        <li>• Click on a node to select it for updating</li>
        <li>• Double click on a node to delete it</li>
        <li>• Select a traversal type (Preorder, Inorder, or Postorder)</li>
        <li>• Use traversal controls to visualize the algorithm step by step</li>
        <li>• Watch the pseudocode highlight as the traversal progresses</li>
        <li>• View the sequence of visited nodes in real-time</li>
      </ul>
    </div>
  );
};
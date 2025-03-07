
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Tree from "./pages/Tree";
import Graph from "./pages/Graph";
import LinkedList from "./pages/LinkedList";
import BSTTree from "./pages/trees/bst-tree";
import BinaryTree from "./pages/trees/binary-tree";
import AVLTree from "./pages/trees/avl-tree";
import BPlusTree from "./pages/trees/bplustree";
import DFS from "./pages/graphs/dfs";
import BFS from "./pages/graphs/bfs";
import NotFound from "./pages/NotFound";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/tree/binary-tree" element={<BinaryTree />} />
          <Route path="/tree/bst-tree" element={<BSTTree/>} />
          <Route path="/tree/avl-tree" element={<AVLTree />} />
          <Route path="/tree/bplustree" element={<BPlusTree />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/graph/dfs" element={<DFS />} />
          <Route path="/graph/bfs" element={<BFS />} />
          <Route path="/linked-list" element={<LinkedList />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

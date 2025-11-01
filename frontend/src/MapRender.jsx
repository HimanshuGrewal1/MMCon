import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

// const initialNodes = [
//   {
//     id: "1",
//     position: { x: 0, y: 0 },
//     data: { label: "Main Topic" },
//     style: {
//       background: "#1976d2",
//       color: "#fff",
//       padding: "10px 20px",
//       borderRadius: 12,
//       fontWeight: "bold",
//       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//     },
//   },
//   {
//     id: "2",
//     position: { x: 250, y: -120 },
//     data: { label: "Subtopic A" },
//     style: {
//       background: "#43a047",
//       color: "#fff",
//       padding: "10px 20px",
//       borderRadius: 12,
//       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//     },
//   },
//   {
//     id: "3",
//     position: { x: 250, y: 120 },
//     data: { label: "Subtopic B" },
//     style: {
//       background: "#e53935",
//       color: "#fff",
//       padding: "10px 20px",
//       borderRadius: 12,
//       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
//     },
//   },
// ];

const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { label: 'Mole Concept' },
    type: 'input',
  },
  {
    id: 'n2',
    position: { x: -250, y: 150 },
    data: { label: 'Basic Definitions' },
  },
  {
    id: 'n3',
    position: { x: 250, y: 150 },
    data: { label: 'Calculations Involving Moles' },
  },
  {
    id: 'n4',
    position: { x: -400, y: 300 },
    data: { label: 'Mole' },
  },
  {
    id: 'n5',
    position: { x: -250, y: 300 },
    data: { label: 'Avogadro’s Number (NA = 6.022×10²³)' },
  },
  {
    id: 'n6',
    position: { x: -100, y: 300 },
    data: { label: 'Molar Mass' },
  },
  {
    id: 'n7',
    position: { x: 100, y: 300 },
    data: { label: 'Number of Particles ↔ Moles' },
  },
  {
    id: 'n8',
    position: { x: 300, y: 300 },
    data: { label: 'Mass ↔ Moles' },
  },
  {
    id: 'n9',
    position: { x: 500, y: 300 },
    data: { label: 'Volume ↔ Moles (at STP)' },
  },
  {
    id: 'n10',
    position: { x: -150, y: 450 },
    data: { label: 'Empirical & Molecular Formula' },
  },
  {
    id: 'n11',
    position: { x: 100, y: 450 },
    data: { label: 'Limiting Reagent' },
  },
  {
    id: 'n12',
    position: { x: 350, y: 450 },
    data: { label: 'Stoichiometric Calculations' },
  },
  {
    id: 'n13',
    position: { x: 100, y: 600 },
    data: { label: 'Percentage Composition' },
  },
  {
    id: 'n14',
    position: { x: 350, y: 600 },
    data: { label: 'Concept of Equivalent Weight' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2', type: 'step', label: 'includes' },
  { id: 'e1-3', source: 'n1', target: 'n3', type: 'step', label: 'covers' },

  { id: 'e2-4', source: 'n2', target: 'n4', type: 'step', label: 'defines' },
  { id: 'e2-5', source: 'n2', target: 'n5', type: 'step', label: 'includes' },
  { id: 'e2-6', source: 'n2', target: 'n6', type: 'step', label: 'includes' },

  { id: 'e3-7', source: 'n3', target: 'n7', type: 'step', label: 'involves' },
  { id: 'e3-8', source: 'n3', target: 'n8', type: 'step', label: 'involves' },
  { id: 'e3-9', source: 'n3', target: 'n9', type: 'step', label: 'involves' },
  { id: 'e3-10', source: 'n3', target: 'n10', type: 'step', label: 'includes' },
  { id: 'e3-11', source: 'n3', target: 'n11', type: 'step', label: 'includes' },
  { id: 'e3-12', source: 'n3', target: 'n12', type: 'step', label: 'includes' },
  { id: 'e12-13', source: 'n12', target: 'n13', type: 'step', label: 'related to' },
  { id: 'e12-14', source: 'n12', target: 'n14', type: 'step', label: 'related to' },
];


function MindMapContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const onNodeDoubleClick = useCallback((_, node) => {
    const newLabel = prompt("Edit node text:", node.data.label);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    }
  }, [setNodes]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        panOnScroll
        zoomOnScroll
        panOnDrag
        zoomOnPinch
        defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <MiniMap zoomable pannable />
        <Controls showInteractive />
        <Background gap={16} color="#aaa" />
      </ReactFlow>
    </div>
  );
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapContent />
    </ReactFlowProvider>
  );
}

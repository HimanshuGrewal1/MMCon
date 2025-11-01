// import React, { useCallback, useState } from "react";
// import ReactFlow, {
//   MiniMap,
//   Controls,
//   Background,
//   addEdge,
//   useNodesState,
//   useEdgesState,
//   ReactFlowProvider,
// } from "reactflow";
// import "reactflow/dist/style.css";

// // const initialNodes = [
// //   {
// //     id: "1",
// //     position: { x: 0, y: 0 },
// //     data: { label: "Main Topic" },
// //     style: {
// //       background: "#1976d2",
// //       color: "#fff",
// //       padding: "10px 20px",
// //       borderRadius: 12,
// //       fontWeight: "bold",
// //       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
// //     },
// //   },
// //   {
// //     id: "2",
// //     position: { x: 250, y: -120 },
// //     data: { label: "Subtopic A" },
// //     style: {
// //       background: "#43a047",
// //       color: "#fff",
// //       padding: "10px 20px",
// //       borderRadius: 12,
// //       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
// //     },
// //   },
// //   {
// //     id: "3",
// //     position: { x: 250, y: 120 },
// //     data: { label: "Subtopic B" },
// //     style: {
// //       background: "#e53935",
// //       color: "#fff",
// //       padding: "10px 20px",
// //       borderRadius: 12,
// //       boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
// //     },
// //   },
// // ];

// const initialNodes = [
//   {
//     id: 'n1',
//     position: { x: 0, y: 0 },
//     data: { label: '⚛️ Mole Concept' },
//     type: 'input',
//     style: {
//       backgroundColor: '#16a34a',
//       color: 'white',
//       fontWeight: 'bold',
//       border: '2px solid #065f46',
//       padding: 10,
//       borderRadius: 12,
//     },
//   },
//   {
//     id: 'n2',
//     position: { x: -300, y: 150 },
//     data: { label: '📘 Basic Definitions' },
//     style: {
//       backgroundColor: '#3b82f6',
//       color: 'white',
//       borderRadius: 10,
//       padding: 8,
//       fontWeight: 500,
//     },
//   },
//   {
//     id: 'n3',
//     position: { x: 300, y: 150 },
//     data: { label: '📗 Calculations Involving Moles' },
//     style: {
//       backgroundColor: '#3b82f6',
//       color: 'white',
//       borderRadius: 10,
//       padding: 8,
//       fontWeight: 500,
//     },
//   },
//   {
//     id: 'n4',
//     position: { x: -500, y: 300 },
//     data: { label: '🧮 Mole' },
//     style: {
//       backgroundColor: '#a855f7',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n5',
//     position: { x: -300, y: 300 },
//     data: { label: '🔢 Avogadro’s Number (6.022×10²³)' },
//     style: {
//       backgroundColor: '#a855f7',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n6',
//     position: { x: -100, y: 300 },
//     data: { label: '⚖️ Molar Mass' },
//     style: {
//       backgroundColor: '#a855f7',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n7',
//     position: { x: 100, y: 300 },
//     data: { label: '🔁 No. of Particles ↔ Moles' },
//     style: {
//       backgroundColor: '#f97316',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n8',
//     position: { x: 300, y: 300 },
//     data: { label: '⚗️ Mass ↔ Moles' },
//     style: {
//       backgroundColor: '#f97316',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n9',
//     position: { x: 500, y: 300 },
//     data: { label: '💨 Volume ↔ Moles (STP)' },
//     style: {
//       backgroundColor: '#f97316',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n10',
//     position: { x: -150, y: 450 },
//     data: { label: '🧬 Empirical & Molecular Formula' },
//     style: {
//       backgroundColor: '#ef4444',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n11',
//     position: { x: 150, y: 450 },
//     data: { label: '🚧 Limiting Reagent' },
//     style: {
//       backgroundColor: '#ef4444',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n12',
//     position: { x: 400, y: 450 },
//     data: { label: '⚙️ Stoichiometric Calculations' },
//     style: {
//       backgroundColor: '#ef4444',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n13',
//     position: { x: 400, y: 600 },
//     data: { label: '📊 Percentage Composition' },
//     style: {
//       backgroundColor: '#a855f7',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
//   {
//     id: 'n14',
//     position: { x: 600, y: 600 },
//     data: { label: '⚖️ Equivalent Weight' },
//     style: {
//       backgroundColor: '#a855f7',
//       color: 'white',
//       borderRadius: 8,
//       padding: 6,
//     },
//   },
// ];

// const initialEdges = [
//   { id: 'e1-2', source: 'n1', target: 'n2', type: 'step', label: 'includes', style: { stroke: '#3b82f6' } },
//   { id: 'e1-3', source: 'n1', target: 'n3', type: 'step', label: 'covers', style: { stroke: '#3b82f6' } },

//   { id: 'e2-4', source: 'n2', target: 'n4', type: 'smoothstep', label: 'defines', style: { stroke: '#a855f7' } },
//   { id: 'e2-5', source: 'n2', target: 'n5', type: 'smoothstep', label: 'includes', style: { stroke: '#a855f7' } },
//   { id: 'e2-6', source: 'n2', target: 'n6', type: 'smoothstep', label: 'includes', style: { stroke: '#a855f7' } },

//   { id: 'e3-7', source: 'n3', target: 'n7', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
//   { id: 'e3-8', source: 'n3', target: 'n8', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
//   { id: 'e3-9', source: 'n3', target: 'n9', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
//   { id: 'e3-10', source: 'n3', target: 'n10', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
//   { id: 'e3-11', source: 'n3', target: 'n11', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
//   { id: 'e3-12', source: 'n3', target: 'n12', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
//   { id: 'e12-13', source: 'n12', target: 'n13', type: 'smoothstep', label: 'related to', style: { stroke: '#a855f7' } },
//   { id: 'e12-14', source: 'n12', target: 'n14', type: 'smoothstep', label: 'related to', style: { stroke: '#a855f7' } },
// ];


// function MindMapContent() {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
//     []
//   );

//   const onNodeDoubleClick = useCallback((_, node) => {
//     const newLabel = prompt("Edit node text:", node.data.label);
//     if (newLabel) {
//       setNodes((nds) =>
//         nds.map((n) =>
//           n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
//         )
//       );
//     }
//   }, [setNodes]);

//   return (
//     <div style={{ width: "100%", height: "100vh" }}>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onConnect={onConnect}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onNodeDoubleClick={onNodeDoubleClick}
//         fitView
//         fitViewOptions={{ padding: 0.3 }}
//         panOnScroll
//         zoomOnScroll
//         panOnDrag
//         zoomOnPinch
//         defaultViewport={{ x: 0, y: 0, zoom: 1.2 }}
//         minZoom={0.3}
//         maxZoom={2}
//       >
//         <MiniMap zoomable pannable />
//         <Controls showInteractive />
//         <Background gap={16} color="#aaa" />
//       </ReactFlow>
//     </div>
//   );
// }

// export default function MindMap() {
//   return (
//     <ReactFlowProvider>
//       <MindMapContent />
//     </ReactFlowProvider>
//   );
// }


import React, { useCallback, useState, useRef } from "react";
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

// Enhanced initialNodes with content property
const initialNodes = [
  {
    id: 'n1',
    position: { x: 0, y: 0 },
    data: { 
      label: '⚛️ Mole Concept',
      content: 'The mole is the unit of measurement for amount of substance in the International System of Units. One mole contains exactly 6.02214076×10²³ elementary entities.'
    },
    type: 'input',
    style: {
      backgroundColor: '#16a34a',
      color: 'white',
      fontWeight: 'bold',
      border: '2px solid #065f46',
      padding: 10,
      borderRadius: 12,
    },
  },
  {
    id: 'n2',
    position: { x: -300, y: 150 },
    data: { 
      label: '📘 Basic Definitions',
      content: 'Fundamental concepts and terminology related to the mole concept including definitions of key terms and constants.'
    },
    style: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: 10,
      padding: 8,
      fontWeight: 500,
    },
  },
  {
    id: 'n3',
    position: { x: 300, y: 150 },
    data: { 
      label: '📗 Calculations Involving Moles',
      content: 'Various types of calculations that involve converting between moles, mass, particles, and volume at standard conditions.'
    },
    style: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: 10,
      padding: 8,
      fontWeight: 500,
    },
  },
  {
    id: 'n4',
    position: { x: -500, y: 300 },
    data: { 
      label: '🧮 Mole',
      content: 'A mole is defined as the amount of substance that contains as many elementary entities as there are atoms in exactly 12 grams of carbon-12.'
    },
    style: {
      backgroundColor: '#a855f7',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n5',
    position: { x: -300, y: 300 },
    data: { 
      label: '🔢 Avogadro\'s Number (6.022×10²³)',
      content: 'Avogadro\'s number (6.02214076×10²³) is the number of particles in one mole of any substance. Named after Amedeo Avogadro.'
    },
    style: {
      backgroundColor: '#a855f7',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n6',
    position: { x: -100, y: 300 },
    data: { 
      label: '⚖️ Molar Mass',
      content: 'Molar mass is the mass of one mole of a substance, typically expressed in grams per mole (g/mol). It is numerically equal to the atomic/molecular weight.'
    },
    style: {
      backgroundColor: '#a855f7',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n7',
    position: { x: 100, y: 300 },
    data: { 
      label: '🔁 No. of Particles ↔ Moles',
      content: 'Conversion formula: Number of moles = Number of particles / Avogadro\'s number'
    },
    style: {
      backgroundColor: '#f97316',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n8',
    position: { x: 300, y: 300 },
    data: { 
      label: '⚗️ Mass ↔ Moles',
      content: 'Conversion formula: Number of moles = Mass (g) / Molar mass (g/mol)'
    },
    style: {
      backgroundColor: '#f97316',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n9',
    position: { x: 500, y: 300 },
    data: { 
      label: '💨 Volume ↔ Moles (STP)',
      content: 'At STP (Standard Temperature and Pressure: 0°C and 1 atm), 1 mole of any gas occupies 22.4 liters. Conversion: Moles = Volume (L) / 22.4 L/mol'
    },
    style: {
      backgroundColor: '#f97316',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n10',
    position: { x: -150, y: 450 },
    data: { 
      label: '🧬 Empirical & Molecular Formula',
      content: 'Empirical formula shows simplest whole-number ratio of atoms. Molecular formula shows actual number of atoms. They are related by: Molecular formula = n × Empirical formula'
    },
    style: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n11',
    position: { x: 150, y: 450 },
    data: { 
      label: '🚧 Limiting Reagent',
      content: 'The reactant that is completely consumed in a chemical reaction and limits the amount of product formed. Determined by comparing mole ratios.'
    },
    style: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n12',
    position: { x: 400, y: 450 },
    data: { 
      label: '⚙️ Stoichiometric Calculations',
      content: 'Calculations based on balanced chemical equations using mole ratios from the coefficients to relate quantities of reactants and products.'
    },
    style: {
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n13',
    position: { x: 400, y: 600 },
    data: { 
      label: '📊 Percentage Composition',
      content: 'Percentage by mass of each element in a compound. Calculated as: (Mass of element in 1 mole of compound / Molar mass of compound) × 100%'
    },
    style: {
      backgroundColor: '#a855f7',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
  {
    id: 'n14',
    position: { x: 600, y: 600 },
    data: { 
      label: '⚖️ Equivalent Weight',
      content: 'The mass of a substance that combines with or displaces 1 gram of hydrogen or 8 grams of oxygen. Important in titration calculations.'
    },
    style: {
      backgroundColor: '#a855f7',
      color: 'white',
      borderRadius: 8,
      padding: 6,
    },
  },
];

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2', type: 'step', label: 'includes', style: { stroke: '#3b82f6' } },
  { id: 'e1-3', source: 'n1', target: 'n3', type: 'step', label: 'covers', style: { stroke: '#3b82f6' } },

  { id: 'e2-4', source: 'n2', target: 'n4', type: 'smoothstep', label: 'defines', style: { stroke: '#a855f7' } },
  { id: 'e2-5', source: 'n2', target: 'n5', type: 'smoothstep', label: 'includes', style: { stroke: '#a855f7' } },
  { id: 'e2-6', source: 'n2', target: 'n6', type: 'smoothstep', label: 'includes', style: { stroke: '#a855f7' } },

  { id: 'e3-7', source: 'n3', target: 'n7', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
  { id: 'e3-8', source: 'n3', target: 'n8', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
  { id: 'e3-9', source: 'n3', target: 'n9', type: 'smoothstep', label: 'conversion', style: { stroke: '#f97316' } },
  { id: 'e3-10', source: 'n3', target: 'n10', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
  { id: 'e3-11', source: 'n3', target: 'n11', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
  { id: 'e3-12', source: 'n3', target: 'n12', type: 'smoothstep', label: 'includes', style: { stroke: '#ef4444' } },
  { id: 'e12-13', source: 'n12', target: 'n13', type: 'smoothstep', label: 'related to', style: { stroke: '#a855f7' } },
  { id: 'e12-14', source: 'n12', target: 'n14', type: 'smoothstep', label: 'related to', style: { stroke: '#a855f7' } },
];

// Context Menu Component
const ContextMenu = ({ position, node, onClose, onEdit }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: '300px',
        maxWidth: '400px',
        padding: '16px',
      }}
    >
      <div style={{ marginBottom: '12px' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px', fontWeight: 'bold' }}>
          {node?.data?.label}
        </h3>
        <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.4' }}>
          {node?.data?.content}
        </p>
      </div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '12px' }}>
        <button
          onClick={() => {
            onEdit(node);
            onClose();
          }}
          style={{
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Edit Content
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

function MindMapContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    []
  );

  const onNodeDoubleClick = useCallback((_, node) => {
    const newLabel = prompt("Edit node label:", node.data.label);
    if (newLabel) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
        )
      );
    }
  }, [setNodes]);

  // Handle right-click on node
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      position: { x: event.clientX, y: event.clientY },
      node: node,
    });
  }, []);

  // Handle pane click to close context menu
  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Handle edit content
  const handleEditContent = useCallback((node) => {
    const newContent = prompt("Edit node content:", node.data.content);
    if (newContent !== null) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, content: newContent } } : n
        )
      );
    }
  }, [setNodes]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
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

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          node={contextMenu.node}
          onClose={closeContextMenu}
          onEdit={handleEditContent}
        />
      )}
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
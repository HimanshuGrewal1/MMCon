import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ReactFlowProvider,
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";

// ================== Context Menu ==================
const ContextMenu = ({ position, node, onClose, onEdit, onAddNode, onDeleteNode }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        zIndex: 1000,
        minWidth: "280px",
        padding: "12px",
      }}
    >
      <div style={{ marginBottom: "12px" }}>
        <h3
          style={{
            margin: "0 0 8px 0",
            color: "#333",
            fontSize: "15px",
            fontWeight: "bold",
          }}
        >
          {node?.data?.label}
        </h3>
        <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: "1.4" }}>
          {node?.data?.content}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          borderTop: "1px solid #eee",
          paddingTop: "12px",
        }}
      >
        <button
          onClick={() => {
            onAddNode(node);
            onClose();
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ➕ Add Node
        </button>

        <button
          onClick={() => {
            onEdit(node);
            onClose();
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ✏️ Edit Content
        </button>

        <button
          onClick={() => {
            onDeleteNode(node);
            onClose();
          }}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          🗑️ Delete Node
        </button>

        <button
          onClick={onClose}
          style={{
            padding: "6px 12px",
            backgroundColor: "#6b7280",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
};


// ================== Main MindMapContent ==================
function MindMapContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const projectId = "6903290c44e1ebf3d3d63067";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data (replace later with backend call)
        const res = {
          project_id: "default",
          nodes: [
            {
              id: "61611568eb93",
              data: {
                label: "Data Structure and Dataset Statistics",
                content:
                  "The study employed a flattened JSON format for annotated data...",
              },
              position: { x: 0, y: 0 },
              style: {
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: 12,
                width: 250,
                textAlign: "center",
              },
            },
            {
              id: "80235922a073",
              data: {
                label: "Emotionally Grounded Dialogue Generation",
                content:
                  "This research explores a dual-pathway architecture for emotionally intelligent dialogue...",
              },
              position: { x: 300, y: 0 },
              style: {
                backgroundColor: "#3b82f6",
                color: "white",
                borderRadius: 12,
                width: 250,
                textAlign: "center",
              },
            },
          ],
          edges: [
            {
              id: "e1",
              source: "61611568eb93",
              target: "80235922a073",
              type: "smoothstep",
              animated: true,
              style: { stroke: "#3b82f6", strokeWidth: 3 },
            },
          ],
        };

        setNodes(res.nodes);
        setEdges(res.edges);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, setNodes, setEdges]);

  // ========== React Flow Handlers ==========
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeDoubleClick = useCallback(
    (_, node) => {
      const newLabel = prompt("Edit node label:", node.data.label);
      if (newLabel) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n
          )
        );
      }
      
    },
    [setNodes]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      position: { x: event.clientX, y: event.clientY },
      node,
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // ========== Context Menu Actions ==========
  const handleEditContent = useCallback(
    (node) => {
      const newContent = prompt("Edit node content:", node.data.content);
      if (newContent !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, content: newContent } } : n
          )
        );
      }
    },
    [setNodes]
  );

  

  const handleAddNode = useCallback(
    (parentNode) => {
      const newLabel = prompt("Enter new node label:");
      if (!newLabel) return;

      const newId = Math.random().toString(36).substring(2, 9);
      const newNode = {
        id: newId,
        data: {
          label: newLabel,
          content: "New node content here...",
        },
        position: {
          x: parentNode.position.x + Math.floor(Math.random() * 100),
          y: parentNode.position.y + Math.floor(Math.random() * 100),
        },
        style: parentNode.style,
      };

      const newEdge = {
        id: `e-${parentNode.id}-${newId}`,
        source: parentNode.id,
        target: newId,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 3 },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges]
  );

  const handleDeleteNode = useCallback(
    (node) => {
      if (!window.confirm("Are you sure you want to delete this node?")) return;
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
    },
    [setNodes, setEdges]
  );

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  // ========== Render ==========
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {loading && <p>Loading mind map...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

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

      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          node={contextMenu.node}
          onClose={closeContextMenu}
          onEdit={handleEditContent}
          onAddNode={handleAddNode}
          onDeleteNode={handleDeleteNode}
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

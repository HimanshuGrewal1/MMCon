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
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ================== Context Menu ==================
const ContextMenu = ({ position, node, onClose, onEdit, onAddNode, onDeleteNode }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
      <h3 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "15px", fontWeight: "bold" }}>
        {node?.data?.label}
      </h3>
      <p style={{ margin: 0, color: "#666", fontSize: "13px", lineHeight: "1.4" }}>
        {node?.data?.content}
      </p>

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
          style={btnStyle("#10b981")}
        >
          ➕ Add Node
        </button>
        <button
          onClick={() => {
            onEdit(node);
            onClose();
          }}
          style={btnStyle("#3b82f6")}
        >
          ✏️ Edit Content
        </button>
        <button
          onClick={() => {
            onDeleteNode(node);
            onClose();
          }}
          style={btnStyle("#ef4444")}
        >
          🗑️ Delete Node
        </button>
        <button onClick={onClose} style={btnStyle("#6b7280")}>
          ✖ Close
        </button>
      </div>
    </div>
  );
};

const btnStyle = (bg) => ({
  padding: "6px 12px",
  backgroundColor: bg,
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
});

// ================== Chat Section ==================
const ChatPanel = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "👋 Hi! I'm MMCon. Ask me anything about your project." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI("AIzaSyAyTvPx9HF1F66NK5fmaxGXqKYTLF4t1DQ");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const prompt = input;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      setMessages([...newMessages, { sender: "ai", text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "ai", text: "⚠️ Error: Unable to connect to Gemini API." },
      ]);
    } finally {
      setLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "360px",
        backgroundColor: "#f9fafb",
        borderLeft: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.1)",
        zIndex: 1200,
      }}
    >
      <div
        style={{
          backgroundColor: "#111827",
          color: "white",
          padding: "14px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        💬 Project Chat (MMCon AI)
      </div>

      <div
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#3b82f6" : "#e5e7eb",
              color: msg.sender === "user" ? "white" : "black",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "80%",
              wordBreak: "break-word",
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div
        style={{
          padding: "10px",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "8px",
          backgroundColor: "white",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask MMCon..."
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          {loading ? "..." : "Send"}
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
  const projectId = window.location.pathname.split("/").pop();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/projects/project/${projectId}`);
        setNodes(res.data.project.Nodes);
        setEdges(res.data.project.Edges);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ position: { x: event.clientX, y: event.clientY }, node });
  }, []);

  const onPaneClick = useCallback(() => setContextMenu(null), []);

  const handleNodeDragStop = useCallback(
    async (_, node) => {
      try {
        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
        );

        await axios.post(`http://localhost:5000/api/projects/project/${projectId}/editNode`, {
          id: node.id,
          position: node.position,
          data: node.data,
          type: node.type,
          style: node.style,
        });
      } catch (err) {
        console.error("Error updating node position:", err);
      }
    },
    [setNodes, projectId]
  );

  const handleaddEdge = useCallback(
    async (edge) => {
      try {
        setEdges((eds) => addEdge({ ...edge, animated: true }, eds));

        await axios.post(`http://localhost:5000/api/projects/project/${projectId}/creatEdge`, {
           id: `e-${parentNode.id}-${newId}`,
          source: edge.source,
          target: edge.target,
          type: edge.type,
          label: edge.label,
          style: edge.style,
          animated: edge.animated,
           data: { confidence: 0.5 ,
          rationale: "Created new connection"
         }
        });
      } catch (err) {
        console.error("Error adding edge:", err);
      }
    },
    [setEdges, projectId]
  );

  const handleAddNode = useCallback(
    async(parentNode) => {
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

      await axios.post(`http://localhost:5000/api/projects/project/${projectId}/creatNode`, {
        position: newNode.position,
        data: {...newNode.data,
          confidence: 0.5,
          type: "default"

        },
        id:Math.random().toString(36).substr(2, 9),
        type: newNode.type,
        style: newNode.style,
        animated: newEdge.animated,
      },{withCredentials:true});
      handleaddEdge(newEdge);
      await axios.post(`http://localhost:5000/api/projects/project/${projectId}/creatEdge`, {
        id: `e-${parentNode.id}-${newId}`,
        source: newEdge.source,
        target: newEdge.target,
        type: newEdge.type,
        label: newEdge.label,
        style: newEdge.style,
      animated: newEdge.animated,
        data: { confidence: 0.5 ,
          rationale: "Created new connection"
         }
      },
      {withCredentials:true}
      )
      

    },
    [setNodes, setEdges]
  );

  const handleEditContent = useCallback(
    async(node) => {
      const newContent = prompt("Edit node content:", node.data.content);
      if (newContent !== null) {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, data: { ...n.data, content: newContent } } : n
          )
        );

        try {
        setNodes((nds) =>
          nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
        );

        await axios.post(`http://localhost:5000/api/projects/project/${projectId}/editNode`, {
          id: node.id,
          position: node.position,
          data: { ...node.data, content: newContent },
          type: node.type,
          style: node.style,
        });
      } catch (err) {
        console.error("Error updating node position:", err);
      }

      }
    },
    [setNodes]
  );

  return (
    <div style={{ width: "calc(100% - 360px)", height: "100vh", position: "relative" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onNodeDragStop={handleNodeDragStop}
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
          onClose={() => setContextMenu(null)}
          onEdit={handleEditContent}
          onAddNode={handleAddNode}
          onDeleteNode={() => {}}
        />
      )}
    </div>
  );
}

export default function MindMap() {
  return (
    <ReactFlowProvider>
      <MindMapContent />
      <ChatPanel />
    </ReactFlowProvider>
  );
}

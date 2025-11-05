const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // ✅ FIX HERE
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI("AIzaSyAyTvPx9HF1F66NK5fmaxGXqKYTLF4t1DQ");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post("/api/pdf-to-graph", upload.single("pdf"), async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(pdfBuffer); // ✅ works now
    const pdfText = pdfData.text.slice(0, 12000); // avoid token overload

    const prompt = `
You are a document analyzer that converts PDFs into structured knowledge graphs.
use color codeing for different node types.
And give different shapes for different node types.
also diffrenent position for different type of nodes.
Analyze the following PDF content and extract key topics, concepts, and their relationships.
Represent this information as a JSON object containing nodes and edges suitable for graph visualization.
Analyze the following text and return a JSON like this format:

{
  "project_id": "default",
  "nodes": [
    {
      "id": "randomId",
      "data": {
        "label": "Topic Title",
        "content": "Detailed summary of section or paragraph",
        "confidence": 0.8,
        "type": "process"
      },
      "position": {"x": 0, "y": 0},
      "type": "default",
      "style": {
        "backgroundColor": "#3b82f6",
        "color": "white",
        "fontWeight": "500",
        "border": "2px solid #1e40af",
        "padding": 10,
        "borderRadius": 12,
        "width": 250,
        "textAlign": "center",
        "opacity": 0.8
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "node1",
      "target": "node2",
      "type": "smoothstep",
      "label": "next",
      "style": {"stroke": "#3b82f6", "strokeWidth": 3.8, "opacity": 0.9},
      "animated": true
    }
  ],
  "summary": {
    "nodes_processed": 5,
    "edges_extracted": 4
  }
}

PDF Content:
${pdfText}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch {
      jsonResponse = JSON.parse(text.replace(/```json|```/g, "").trim());
    }

    res.json(jsonResponse);
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to process PDF" });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

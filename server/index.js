const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");
const pdfParse = require("pdf-parse/lib/pdf-parse.js"); // ✅ FIX HERE
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const genAI = new GoogleGenerativeAI("AIzaSyAyTvPx9HF1F66NK5fmaxGXqKYTLF4t1DQ");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

app.post("/api/pdf-to-graph", upload.single("pdf"), async (req, res) => {
  try {
    console.log("📄 Received file:", req.file.originalname);
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
  "nodes": [  
  {
  data: {
    label: { type: String, required: true },
    content: { type: String, required: true },
    confidence: { type: Number, required: true },
    type: { type: String, required: true },
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  type: { type: String, default: "default" },
  style: {
    backgroundColor: { type: String },
    color: { type: String },
    fontWeight: { type: String },
    border: { type: String },
    padding: { type: Number },
    borderRadius: { type: String },
    width: { type: Number },
    textAlign: { type: String },
    opacity: { type: Number },
  }
  }  
  ],
  "edges": [
{  
  source: { type: String, required: true }, 
  target: { type: String, required: true }, 
  type: { type: String, default: "smoothstep" },
  label: { type: String },
  style: {
    stroke: { type: String },
    strokeWidth: { type: Number },
    opacity: { type: Number },
  },
  animated: { type: Boolean, default: false },
  data: {
    confidence: { type: Number },
    rationale: { type: String },
    }
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

    console.log("🤖 Sending prompt to Generative AI model...");
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
    if (req.file && fs.existsSync(req.file?.path)) fs.unlinkSync(req.file?.path);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
 
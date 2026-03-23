# 🤖 AI Code Reviewer — Agentic Code Analysis & Auto-Fix System

## 🚀 Overview

AI Code Reviewer is an intelligent agent-based system that can analyze, review, and automatically fix entire codebases.

Instead of just generating suggestions, it interacts with real files using a structured **agent → tools → LLM pipeline**, making it a practical example of real-world AI automation.

---

## 💡 What Makes It Different?

This is not a traditional AI code assistant.

### ❌ Limitations of Typical Tools
- Only suggest fixes  
- Cannot access or modify real files  
- Lack full codebase understanding  

### ✅ This System
- Reads complete directories  
- Understands full project context  
- Automatically fixes issues  
- Generates detailed change reports  

---

## 🔥 Key Features

### 1) Agentic AI Workflow
- Built on **agent → tools → LLM orchestration**
- LLM acts as a decision-maker, not an executor  
- Tools perform all real-world actions  

---

### 2) Full Codebase Understanding
- Recursively scans entire directories  
- Builds complete context before analysis  
- Avoids partial or incorrect suggestions  

---

### 3) Tool-Based Execution System

Custom tools designed for real interaction:

- `listFiles` → Retrieves all file paths  
- `readFile` → Reads file contents  
- `writeFile` → Applies fixes directly  

---

### 4) Autonomous Code Fixing

- Detects:
  - Bugs  
  - Code smells  
  - Inefficiencies  
- Applies fixes automatically to files  
- Ensures safe and sequential execution  

---

### 5) Smart Change Reports

Generates structured summaries:
- Files modified  
- Issues fixed  
- Reasoning behind each change  

---

## 🧠 How It Works (Under the Hood)

### 1) User Input
Example:  
`"Review the code in ./tester"`

---

### 2) Backend Processing (Node.js)

Sends:
- User query  
- Available tools & descriptions  

→ to the LLM  

---

## 🔄 Execution Flow

### 📂 File Discovery
- LLM instructs:
  - `listFiles(directory)`  
- Agent returns all file paths  

---

### 📖 Context Building
- LLM requests file contents  
- Agent calls `readFile(filePath)`  
- Repeats until full codebase is understood  

---

### ✏️ Analysis & Fixing
- LLM identifies issues  
- Instructs:
  - `writeFile(filePath, updatedContent)`  
- Agent updates files  

---

### 📊 Final Report
- LLM generates a complete summary:
  - What changed  
  - Why it changed  
  - Which files were affected  

---

## 🛠️ Tech Stack

### Frontend
- React.js  

### Backend
- Node.js  
- Express  

### AI Layer
- LLM API (tool-calling enabled)  

### Core Concepts
- AI Agents  
- Tool Calling  
- Agentic Workflows  

---

## 📊 Performance Highlights

- 🚀 Automates full codebase review  
- ⚡ Eliminates manual debugging effort  
- 🧠 Improves code quality with context-aware fixes  
- 📊 Generates instant structured reports  

---

## 🧠 System Highlights

- LLM used as a decision engine, not executor  
- Modular and scalable tool-based architecture  
- Real-world implementation of agentic AI  
- Safe file operations with controlled execution  

---

## 🌍 Future Scope

- Multi-language code support  
- CI/CD pipeline automation  
- Team collaboration features  

---

## 🧑‍💻 Author

**Shubham Saini**

Passionate about building AI-driven systems and next-gen automation platforms.

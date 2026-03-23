// aiChatting.jsx
const express = require("express");
const aiRouter = express.Router();
const { GoogleGenAI } = require("@google/genai");
const {toolsInfo, toolFunctions} = require("../utils/tools");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

aiRouter.post("/chat", async(req,res) => {
    try{
        const { messages, title, description, testCases, startCode } = req.body;
        const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY_3});

        async function AIAgent() {
            let loopCount = 0;

            while(true){
                loopCount++;

                if (loopCount > 1) {
                    await sleep(2000); // Wait 2 seconds
                }

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: messages,
                    config: {
                        systemInstruction: `You are **CodeGuardian**, an expert Senior Full-Stack Developer and automated Code Remediation Agent. Your mission is to audit codebases, 
                                            identify vulnerabilities and bugs, and strictly **repair** them while preserving the integrity of the application logic.

                                            ### FORMATTING & VISUAL STYLE GUIDELINES
                                            You must make your responses visually engaging and easy to scan by using emojis effectively. Follow these strict formatting rules:

                                            1. HEADINGS: 
                                            - Always add a contextually relevant emoji at the start of every Heading (H1, H2, H3).
                                            - Example: "## 🚀 Optimization Strategy" or "### 🐛 Debugging Steps".

                                            2. LISTS & BULLET POINTS:
                                            - Do not use standard bullets (- or *) unless necessary for nested lists. Instead, use specific emojis based on context:
                                            - For Success, Solutions, or Steps: Use "✅" (e.g., "✅ Step 1: Install dependencies").
                                            - For Errors, Mistakes, or "Don'ts": Use "❌" (e.g., "❌ Avoid modifying state directly").
                                            - For Tips, Insights, or General Info: Use "💡", "🔹", or "👉".
                                            - For Warnings: Use "⚠️".

                                            ### 🛡️ OPERATIONAL PROTOCOLS (CRITICAL)
                                            1.  **Full-File Integrity:** When using \`writeFile\`, you must **ALWAYS** provide the **COMPLETE** file content. Never use comments like \`// ... rest of code\` or snippet placeholders. Writing a partial file will corrupt the user's codebase.
                                            2.  **Safety First:** Do not alter business logic unless it is clearly broken. If a "fix" is ambiguous or subjective, document it in the report instead of applying it.
                                            3.  **Self-Documenting Fixes:** When applying a fix, you MUST add a concise comment immediately above the changed line(s) explaining *what* changed and *why*. Use the format: \`// [CodeGuardian Fix] <Reason>\`.
                                            
                                            ### ⚙️ WORKFLOW EXECUTION
                                            **Step 1: Discovery**
                                            - Call \`listFiles\` with the target directory.

                                            **Step 2: Deep Analysis**
                                            - Call \`readFile\` for every relevant file found.
                                            - Analyze content against the **Audit Matrix** below.

                                            **Step 3: Remediation (The Fix)**
                                            - Apply fixes immediately using \`writeFile\`.
                                            - **Preserve Style:** Attempt to match the existing indentation (tabs vs spaces) and coding style of the file.
                                            - **Fix Order:** Prioritize Critical Security & Crashes -> Functionality Bugs -> Best Practices.

                                            **Step 4: Reporting**
                                            - After all fixes are applied, generate a summary report.

                                            ---

                                            ### 🔍 AUDIT MATRIX

                                            #### 1. HTML & Accessibility (Structure)
                                            - **Essential Tags:** Missing \`<!DOCTYPE html>\`, \`<html lang="...">\`, \`<meta charset="...">\`, \`<meta name="viewport">\`.
                                            - **Accessibility:** Missing \`alt\` on images, empty buttons/links, improper heading hierarchy (h1-h6).
                                            - **Semantics:** Using \`div\` where \`nav\`, \`main\`, \`header\`, or \`footer\` is appropriate.
                                            - **Best Practices:** Inline \`style="..."\` attributes (move to CSS files if possible/logical).

                                            #### 2. CSS & Styling (Presentation)
                                            - **Correctness:** Invalid property names or values, missing units (e.g., \`width: 100\` instead of \`100px\`).
                                            - **Optimization:** Duplicated rules, empty blocks.
                                            - **Responsiveness:** Hardcoded large pixel widths that break on mobile (suggest \`max-width\` or \`%\`).

                                            #### 3. JavaScript/TypeScript (Logic & Security)
                                            - **🔴 CRITICAL (Security):**
                                                - Hardcoded secrets/API keys (Mask them and add a comment).
                                                - Usage of \`eval()\` or \`document.write()\`.
                                                - XSS vulnerabilities (e.g., \`innerHTML\` with unsanitized input).
                                            - **🟠 HIGH (Stability):**
                                                - usage of undeclared variables.
                                                - Potential null/undefined access (e.g., \`obj.prop\` without checking \`obj\`).
                                                - Floating promises (missing \`await\` or \`.catch\`).
                                                - Infinite loops or recursion risks.
                                            - **🟡 MEDIUM (Quality):**
                                                - \`console.log\` left in production code.
                                                - \`var\` usage (convert to \`let\`/\`const\`).
                                                - Comparison with \`==\` (convert to \`===\`).

                                            ---

                                            ### 📊 SUMMARY REPORT FORMAT FOR REFERENCE
                                            (Output this strictly at the end of your response)

                                            # 🛡️ Code Remediation Report
                                            **Scope:** [X] Files Analyzed | [Y] Files Modified

                                            ### 🔴 Critical Fixes (Security & Crashes)
                                            - \`filename.js\`: [Line X] Description of the serious fix.
                                            - \`auth.ts\`: [Line Y] Removed hardcoded API key.

                                            ### 🟠 Functional Fixes (Bugs & Logic)
                                            - \`index.html\`: [Line X] Added missing viewport meta tag.
                                            - \`utils.js\`: [Line Z] Added null check for user data.

                                            ### 🟡 Quality Improvements (Standards & Cleanliness)
                                            - \`style.css\`: [Line X] Fixed invalid CSS property.
                                            - \`app.js\`: [Line Y] Removed 4 console logs.

                                            **Next Steps:** [Provide 1 brief sentence on what the user should test next].
                                            `,
                        // ENABLE THINKING
                        thinkingConfig: {
                            includeThoughts: true,
                        },
                        tools: toolsInfo
                    },
                });

                let thoughtProcess = "";
                let answer = "";
                let functionCalls = [];

                for(obj of response.candidates[0].content.parts){
                    if(obj.thought){
                        thoughtProcess += obj.text;
                    }
                    else if(obj.functionCall){
                        functionCalls.push(obj.functionCall);
                    }
                    else{
                        answer += obj.text;
                    }
                }

                // Execute ALL function calls
                if(functionCalls.length > 0){
                    // Add the LLM's response to the conversation history.
                    // If we skip this, the LLM will forget that it instructed the AI agent to call the specified tools.
                    messages.push({
                        role: "model",
                        parts: functionCalls.map((obj) => (
                            {
                                functionCall: obj
                            }
                        ))
                    });

                    // Execute function calls one by one
                    for(const funcCall of functionCalls){
                        const {name, args} = funcCall;

                        // AI Agent Calls the actual function (returns an obj)
                        const toolResponse = await toolFunctions[name](args);

                        // Add function response to conversation history
                        messages.push({
                            role: "user",
                            parts: [{
                                functionResponse: {
                                    name: name,
                                    response: {
                                        result: toolResponse
                                    }
                                }
                            }]
                        })
                    }

                    // Force the while loop to run again immediately!
                    // We need to send the tool results back to the LLM server
                    // so it can generate a clean, well-formatted final answer from the raw tool responses.
                    // The LLM then returns this response to the AI agent, which forwards it to the frontend.
                    continue;
                }
                else{
                    // Since there are no remaining function calls, return the final response to the frontend.
                    res.status(201).json({
                        message: answer,
                        thought: thoughtProcess
                    });
                    console.log(response.text);

                    break;
                }
            }
        }
        await AIAgent();
    }   
    catch(err){
        res.status(500).send("Error:" + err.message);
    }
})

module.exports = aiRouter;










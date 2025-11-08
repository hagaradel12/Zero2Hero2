
# import os
# import json
# import traceback
# from typing import List
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from openai import OpenAI
# import re

# # ----------------------------------------------------
# # 🔧 Setup
# # ----------------------------------------------------
# load_dotenv()

# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY2")
# MODEL_NAME = os.getenv("OPENROUTER_MODEL", "qwen/qwen-2.5-72b-instruct:free")

# app = FastAPI(title="AI Review Service")

# client = OpenAI(
#     base_url="https://openrouter.ai/api/v1",
#     api_key=OPENROUTER_API_KEY,
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ----------------------------------------------------
# # 🧩 Models
# # ----------------------------------------------------
# class Node(BaseModel):
#     id: str
#     label: str


# class ReviewRequest(BaseModel):
#     userId: str
#     questionId: str
#     task: str
#     expectedOutput: str = ""
#     code: str
#     language: str = "python"  # or "java"




# class HintRequest(BaseModel):
#     userId: str
#     questionId: str
#     task: str
#     code: str
#     language: str ="python"


# class Message(BaseModel):
#     role: str
#     content: str

# class ChatRequest(BaseModel):
#     question: str
#     plan: List[dict]
#     currentFunction: str
#     studentMessage: str



# # ----------------------------------------------------
# # 🤖 AI Functional Review Endpoint
# # ----------------------------------------------------
# @app.post("/api/review")
# async def review(req: ReviewRequest):
#     """
#     Reviews the student's code focusing on whether the solution works
#     and guides them on the next missing steps.
#     """

#     system_prompt = """
# You are a kind, supportive programming tutor reviewing a beginner’s code submission.

# You will receive:
# - The original task
# - The student's code

# Your job:
# 1️⃣ Understand what the student tried to do — their intention.
# 2️⃣ Identify what they’ve done correctly.
# 3️⃣ Gently describe what’s missing or could be improved.
# 4️⃣ Suggest one helpful next step (like your hint style).
# 5️⃣ Assign a fair, confidence-based score out of 100.

# 💡 Scoring Philosophy (use your judgment flexibly):
# - 95–100 → Fully correct, well-structured, all parts conceptually correct.
# - 85–94 → Mostly correct; small missing element or slightly incomplete structure.
# - 70–84 → Partial progress; correct direction but missing major part of logic.
# - 50–69 → Significant misunderstanding but some relevant attempt.
# - <50 → Off-track or completely misunderstood task.

# ✨ Feedback Style:
# - Start with encouragement.
# - Mention one or two strengths.
# - Point out the most important gap.
# - End with a next-step hint (short, motivating, no code spoilers).

# 🎯 Output strictly as JSON:

# {
#   "score": number,
#   "feedback": "string (2–3 sentences max)",
#   "hints": [string]
# }

# ⚙️ Important:
# - Focus on conceptual understanding and decomposition, not syntax.
# - Do not give full solutions or rewrite code.
# - Stay warm and conversational, like a human tutor.
# """




#     user_prompt = f"""
#     🧩 Problem:
#     {req.task}

#     💻 Student Code ({req.language}):
#     ```{req.language}
#     {req.code}
#     ```

#     Analyze if the solution works fully.
#     Then guide the student to the next step if it’s incomplete.
#     """

#     try:
#         ai_response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_prompt},
#             ],
#             response_format={"type": "json_object"},
#         )

#         content = ai_response.choices[0].message.content
#         ai_feedback = json.loads(content)

#     except json.JSONDecodeError:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Invalid JSON returned by AI model.")
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"AI review failed: {str(e)}")

#     score = ai_feedback.get("score", 0)
#     feedback = ai_feedback.get("feedback", "No feedback provided.")
#     next_steps = ai_feedback.get("next_steps", [])

#     passed = score >= 85
#     can_get_feedback = score < 100

#     print(f"[REVIEW] user={req.userId}, question={req.questionId}, score={score}, passed={passed}")

#     return {
#         "message": "review complete",
#         "data": {
#             "userId": req.userId,
#             "questionId": req.questionId,
#             "score": score,
#             "passed": passed,
#             "aiFeedback": feedback if can_get_feedback else "Excellent! Your solution works perfectly 🎉",
#             "nextSteps": next_steps if can_get_feedback else [],
#         },
#     }
# #hint
# @app.post("/api/hints")
# async def get_hint(req: HintRequest):
#     """
#     Provides a personalized hint based on the user's current code and task.
#     The hint adapts to what the user has already done and avoids repeating old advice.
#     """

#     system_prompt = """
# You are a patient programming tutor helping a beginner progress step-by-step.
# You will receive:
# - A task description
# - The student's current code attempt
# - Context about the question

# Your job is to:
# 1️⃣ Identify what the student has *already* done correctly (so you don't repeat that).
# 2️⃣ Detect what the *next missing concept or function* is.
# 3️⃣ Give ONE short, specific, and kind hint to help them move forward without spoiling the full solution.

# Tone: warm, supportive, and motivating.
# Length: 1–2 sentences max.

# Avoid:
# - Repeating the full task.
# - Giving away full code.
# - Criticizing or discouraging language.

# Structure your JSON output like this:

# {
#   "hint": "string",
#   "focus_area": "string (e.g., logic / loops / function usage / condition / data structure)",
#   "confidence": "high | medium | low"
# }
# """

#     user_prompt = f"""
# 🧩 Task:
# {req.task}

# 💻 Student's Code ({req.language}):
# ```{req.language}
# {req.code}
# """
#     try:
#         ai_response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_prompt},
#             ],
#             response_format={"type": "json_object"},
#         )

#         content = ai_response.choices[0].message.content
#         ai_hint = json.loads(content)

#     except json.JSONDecodeError:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail="Invalid JSON returned by AI model.")
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"AI hint generation failed: {str(e)}")

#     print(f"[HINT] user={req.userId}, question={req.questionId}, focus={ai_hint.get('focus_area')}")

#     return {
#         "message": "personalized hint generated",
#         "data": {
#             "userId": req.userId,
#             "questionId": req.questionId,
#             "hint": ai_hint.get("hint", "Keep going — you’re on the right track!"),
#             "focusArea": ai_hint.get("focus_area", "general logic"),
#             "confidence": ai_hint.get("confidence", "medium"),
#         },
#     }



# #plan phase (decomposition)
# @app.post("/api/plan")
# async def generate_plan(request: dict):
#     question = request.get("question", "")

#     system_prompt = """
# You are a programming instructor skilled at decomposition.
# Given a beginner-level coding task, design a clean function-based plan.

# Each function should have:
# - A clear purpose
# - Inputs and outputs
# - A short, simple name (snake_case)
# - Logical order (helper functions before main)

# Return 3–6 functions maximum.
# Output JSON only:

# {
#   "plan": [
#     { "function": "...", "purpose": "...", "input": "...", "output": "..." },
#     ...
#   ]
# }
# """

#     user_prompt = f"Problem: {question}"

#     try:
#         ai_response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": user_prompt},
#             ],
#             response_format={"type": "json_object"},
#         )

#         plan_data = json.loads(ai_response.choices[0].message.content)
#         return {"message": "Plan created successfully", "data": plan_data}

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"AI plan generation failed: {str(e)}")



#  #Chat (respone)
# @app.post("/api/chat")
# async def mentor_chat(req: ChatRequest):
#     print("🟢 Incoming body:", req)
#     messages = [m.dict() for m in req.messages]
#     plan = req.plan
#     current_function = req.currentFunction
#     thread_id = req.thread_id or os.urandom(8).hex()

#     plan_text = json.dumps(plan, indent=2) if plan else "No plan provided."

#     last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
#     is_code = any(kw in last_user_msg for kw in ["def ", "class ", "return ", "import "])

#     system_prompt = """


#     You are a warm, encouraging programming mentor guiding a beginner.
#     Keep replies JSON-only:
#     {
#     "message": "string",
#     "hints": ["string"],
#     "next_step": "string"
#     }
#     """
#     if is_code:
#         system_prompt += "\nThey just wrote some code — provide a short validation and a hint for improvement."

#     formatted_messages = [
#         {"role": m["role"], "content": m["content"]}
#         for m in messages[-6:]
#         if m.get("role") in ["user", "assistant"]
#     ]

#     try:
#         ai_response = client.chat.completions.create(
#             model=MODEL_NAME,
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 *formatted_messages,
#                 {"role": "user", "content": f"Current function: {current_function}\nPlan: {plan_text}"},
#             ],
#             response_format={"type": "json_object"},
#         )

#         raw = ai_response.choices[0].message.content
#         try:
#             chat_output = json.loads(raw)
#         except json.JSONDecodeError:
#             match = re.search(r"\{.*\}", raw, re.S)
#             chat_output = json.loads(match.group(0)) if match else {"message": raw, "hints": [], "next_step": ""}

#         return {
#             "message": "Chat response generated",
#             "data": {**chat_output, "thread_id": thread_id},
#         }

#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"AI chat failed: {str(e)}")

import os
import json
import traceback
from typing import List, Optional, Dict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import re
from huggingface_hub import InferenceClient

# ----------------------------------------------------
# 🔧 Setup
# ----------------------------------------------------
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("OPENROUTER_MODEL", "qwen/qwen-2.5-72b-instruct:free")

app = FastAPI(title="AI Review Service")

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# 🧩 Models
# ----------------------------------------------------
class Message(BaseModel):
    role: str
    content: str

class FunctionStatus(BaseModel):
    function: str
    status: str  # "not_started" | "in_progress" | "completed"
    score: int = 0  # 0-100

class ChatRequest(BaseModel):
    messages: List[Message]
    plan: List[dict] = []
    currentFunction: str = ""
    thread_id: Optional[str] = None
    completedFunctions: List[FunctionStatus] = []

class PlanRequest(BaseModel):
    question: str

class ReviewRequest(BaseModel):
    userId: str
    questionId: str
    task: str
    expectedOutput: str = ""
    code: str
    language: str = "python"

class HintRequest(BaseModel):
    userId: str
    questionId: str
    task: str
    code: str
    language: str = "python"


# ----------------------------------------------------
# 🧠 Plan Phase (Decomposition)
# ----------------------------------------------------
@app.post("/api/plan")
async def generate_plan(request: PlanRequest):
    """
    Generates a function-based plan for solving the coding problem.
    """
    system_prompt = """
You are a programming instructor skilled at decomposition.
Given a beginner-level coding task, design a clean function-based plan.

Each function should have:
- A clear purpose
- Inputs and outputs
- A short, simple name (snake_case)
- Logical order (helper functions before main)

Return 3–6 functions maximum.
Output JSON only:

{
  "plan": [
    { "function": "...", "purpose": "...", "input": "...", "output": "..." },
    ...
  ],
  "starting_message": "A brief encouraging message about the plan"
}
"""

    user_prompt = f"Problem: {request.question}"

    try:
        ai_response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )

        plan_data = json.loads(ai_response.choices[0].message.content)
        thread_id = os.urandom(8).hex()
        
        print(f"[PLAN] Generated plan with {len(plan_data.get('plan', []))} functions, thread_id={thread_id}")
        
        return {
            "message": "Plan created successfully",
            "data": {
                **plan_data,
                "thread_id": thread_id,
                "question": request.question
            }
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI plan generation failed: {str(e)}")


# ----------------------------------------------------
# 💬 Chat Interface (Conversation & Code Review)
# ----------------------------------------------------
@app.post("/api/chat")
async def mentor_chat(req: ChatRequest):
    """
    Handles ongoing conversation, code reviews, and guidance.
    Maintains context of the plan and current progress.
    Tracks completed functions and determines when problem is fully solved.
    """
    print(f"🟢 Chat request: {len(req.messages)} messages, thread_id={req.thread_id}")
    
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    plan = req.plan
    current_function = req.currentFunction
    completed_functions = [cf.dict() for cf in req.completedFunctions]
    thread_id = req.thread_id or os.urandom(8).hex()

    # Calculate progress
    total_functions = len(plan)
    completed_count = sum(1 for cf in completed_functions if cf["status"] == "completed")
    progress_percent = round((completed_count / total_functions * 100)) if total_functions > 0 else 0

    # Check if last message contains code
    last_user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    is_code_review = any(kw in last_user_msg.lower() for kw in ["review", "```", "def ", "function ", "class "])

    # Build progress summary
    progress_summary = ""
    if completed_functions:
        progress_summary = "\n\n📊 **Progress Tracker:**\n"
        for i, func in enumerate(plan):
            func_name = func.get('function', f'Function {i+1}')
            status = next((cf for cf in completed_functions if cf['function'] == func_name), None)
            
            if status:
                if status['status'] == 'completed':
                    progress_summary += f"✅ {func_name} - COMPLETED ({status['score']}/100)\n"
                elif status['status'] == 'in_progress':
                    progress_summary += f"🔄 {func_name} - IN PROGRESS ({status['score']}/100)\n"
                else:
                    progress_summary += f"⏸️ {func_name} - NOT STARTED\n"
            else:
                progress_summary += f"⏸️ {func_name} - NOT STARTED\n"

    # Build context-aware system prompt
    plan_text = ""
    if plan:
        plan_text = "📋 **Current Plan:**\n" + "\n".join(
            [f"{i+1}. {func.get('function', 'Unknown')} - {func.get('purpose', '')}" 
             for i, func in enumerate(plan)]
        )
    
    current_step_text = f"\n\n🎯 **Current Focus:** {current_function}" if current_function else ""

    system_prompt = f"""
You are a warm, patient programming mentor guiding a beginner through problem-solving.

{plan_text}{current_step_text}{progress_summary}

**Your Role:**
- Help the student understand concepts step-by-step
- **IMPORTANT**: When they submit code, analyze ALL functions present in their code, not just one
- Students may implement functions in ANY order - that's perfectly fine!
- For each function found in their code, assign a score (0-100):
  * 95-100: Fully correct, well-structured
  * 85-94: Mostly correct, minor issues
  * 70-84: Partial progress, missing major logic
  * 50-69: Significant issues but relevant attempt
  * <50: Off-track or misunderstood

- Determine function completion status:
  * "not_started": No code for this function yet
  * "in_progress": Working on it but not complete (score < 85)
  * "completed": Function works correctly (score >= 85)

- Track overall progress:
  * Analyze which functions from the plan are present in the submitted code
  * Update status for ALL functions found, even if they're out of order
  * If ALL planned functions are completed (score >= 85), celebrate completion!
  * Acknowledge functions completed out of order positively
  * Provide specific feedback on what's working and what needs improvement

**Response Format (JSON only):**
{{
  "message": "Your main response to the student",
  "hints": ["Specific hints if they're stuck"],
  "next_step": "What they should work on next",
  "functions_analyzed": [
    {{
      "function": "function name from plan",
      "status": "not_started | in_progress | completed",
      "score": 0-100,
      "found": true/false
    }}
  ],
  "all_completed": false,
  "completion_message": "Congratulations message if all functions done"
}}

**Important:**
- ALWAYS analyze ALL functions in the submitted code
- Return status for EVERY function in the plan in "functions_analyzed"
- If a function isn't in the code, mark it as "not_started" with "found": false
- Don't give away full solutions
- Be encouraging and constructive
- Praise working on functions out of order if they make sense independently
- If all functions are completed, set "all_completed": true and provide a celebratory message
"""

    # Use recent conversation history (last 10 messages to save tokens)
    formatted_messages = [
        {"role": m["role"], "content": m["content"]}
        for m in messages[-10:]
    ]

    try:
        ai_response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                *formatted_messages,
            ],
            response_format={"type": "json_object"},
        )

        raw = ai_response.choices[0].message.content
        
        # Parse JSON response
        try:
            chat_output = json.loads(raw)
        except json.JSONDecodeError:
            # Fallback: try to extract JSON from response
            match = re.search(r"\{.*\}", raw, re.S)
            if match:
                chat_output = json.loads(match.group(0))
            else:
                chat_output = {
                    "message": raw,
                    "hints": [],
                    "next_step": "Continue working on your functions",
                    "functions_analyzed": [],
                    "all_completed": False
                }

        # Recalculate progress based on functions_analyzed
        if chat_output.get("functions_analyzed"):
            analyzed = chat_output["functions_analyzed"]
            completed_count = sum(1 for f in analyzed if f.get("status") == "completed")
            progress_percent = round((completed_count / total_functions * 100)) if total_functions > 0 else 0
        
        print(f"[CHAT] Response generated for thread_id={thread_id}, progress={progress_percent}%, {completed_count}/{total_functions} complete")

        return {
            "message": "Chat response generated",
            "data": {
                **chat_output,
                "thread_id": thread_id,
                "progress_percent": progress_percent,
                "completed_count": completed_count,
                "total_count": total_functions,
            },
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI chat failed: {str(e)}")


# ----------------------------------------------------
# 🤖 Code Review Endpoint (Alternative dedicated endpoint)
# ----------------------------------------------------
@app.post("/api/review")
async def review(req: ReviewRequest):
    """
    Detailed code review with scoring.
    """
    system_prompt = """
You are a kind, supportive programming tutor reviewing a beginner's code submission.

You will receive:
- The original task
- The student's code

Your job:
1️⃣ Understand what the student tried to do — their intention.
2️⃣ Identify what they've done correctly.
3️⃣ Gently describe what's missing or could be improved.
4️⃣ Suggest one helpful next step (like your hint style).
5️⃣ Assign a fair, confidence-based score out of 100.

💡 Scoring Philosophy (use your judgment flexibly):
- 95–100 → Fully correct, well-structured, all parts conceptually correct.
- 85–94 → Mostly correct; small missing element or slightly incomplete structure.
- 70–84 → Partial progress; correct direction but missing major part of logic.
- 50–69 → Significant misunderstanding but some relevant attempt.
- <50 → Off-track or completely misunderstood task.

✨ Feedback Style:
- Start with encouragement.
- Mention one or two strengths.
- Point out the most important gap.
- End with a next-step hint (short, motivating, no code spoilers).
- ignore typo's

🎯 Output strictly as JSON:

{
  "score": number,
  "feedback": "string (2–3 sentences max)",
  "hints": [string]
}
"""

    user_prompt = f"""
🧩 Problem:
{req.task}

💻 Student Code ({req.language}):
```{req.language}
{req.code}
```

Analyze if the solution works fully.
Then guide the student to the next step if it's incomplete.
"""

    try:
        ai_response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )

        content = ai_response.choices[0].message.content
        ai_feedback = json.loads(content)

    except json.JSONDecodeError:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Invalid JSON returned by AI model.")
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI review failed: {str(e)}")

    score = ai_feedback.get("score", 0)
    feedback = ai_feedback.get("feedback", "No feedback provided.")
    hints = ai_feedback.get("hints", [])

    passed = score >= 85
    can_get_feedback = score < 100

    print(f"[REVIEW] user={req.userId}, question={req.questionId}, score={score}, passed={passed}")

    return {
        "message": "review complete",
        "data": {
            "userId": req.userId,
            "questionId": req.questionId,
            "score": score,
            "passed": passed,
            "aiFeedback": feedback if can_get_feedback else "Excellent! Your solution works perfectly 🎉",
            "hints": hints if can_get_feedback else [],
        },
    }


# ----------------------------------------------------
# 💡 Hint Endpoint
# ----------------------------------------------------
@app.post("/api/hints")
async def get_hint(req: HintRequest):
    """
    Provides a personalized hint based on the user's current code and task.
    """
    system_prompt = """
You are a patient programming tutor helping a beginner progress step-by-step.
You will receive:
- A task description
- The student's current code attempt

Your job is to:
1️⃣ Identify what the student has *already* done correctly.
2️⃣ Detect what the *next missing concept or function* is.
3️⃣ Give ONE short, specific, and kind hint to help them move forward.

Tone: warm, supportive, and motivating.
Length: 1–2 sentences max.

Structure your JSON output like this:

{
  "hint": "string",
  "focus_area": "string (e.g., logic / loops / function usage / condition / data structure)",
  "confidence": "high | medium | low"
}
"""

    user_prompt = f"""
🧩 Task:
{req.task}

💻 Student's Code ({req.language}):
```{req.language}
{req.code}
```
"""
    
    try:
        ai_response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={"type": "json_object"},
        )

        content = ai_response.choices[0].message.content
        ai_hint = json.loads(content)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI hint generation failed: {str(e)}")

    print(f"[HINT] user={req.userId}, question={req.questionId}, focus={ai_hint.get('focus_area')}")

    return {
        "message": "personalized hint generated",
        "data": {
            "userId": req.userId,
            "questionId": req.questionId,
            "hint": ai_hint.get("hint", "Keep going — you're on the right track!"),
            "focusArea": ai_hint.get("focus_area", "general logic"),
            "confidence": ai_hint.get("confidence", "medium"),
        },
    }
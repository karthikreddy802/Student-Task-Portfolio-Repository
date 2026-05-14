import requests
from django.conf import settings
import json

def generate_portfolio_content(student_name, submissions_data):
    """
    Uses local Ollama AI to generate high-fidelity portfolio content including
    summaries, skill extraction, highlights, and resume-style descriptions.
    """
    ollama_url = getattr(settings, 'OLLAMA_URL', 'http://localhost:11434/api/generate')
    ollama_model = getattr(settings, 'OLLAMA_MODEL', 'gemma:2b') # Use Gemma 2B as requested

    prompt = f"""
    You are an elite career coach and tech recruiter. 
    A student named {student_name} is building a high-fidelity academic portfolio.
    
    Data: {json.dumps(submissions_data)}
    
    Tasks:
    1. Bio: A 3-sentence powerful professional bio.
    2. Skills: Extract a list of 8-10 technical and soft skills from the work.
    3. Recommendations: Identify the 'Star Project' and explain why it stands out.
    4. Feedback: Suggest 2 growth areas for the student's career path.
    5. For each Project:
       - 'resume_description': A professional, result-oriented description (action verbs).
       - 'highlights': 3 bullet points of key technical achievements.
       - 'tags': 3 industry-standard skill tags.
    
    Return ONLY JSON:
    {{
        "bio": "...",
        "skills": ["...", "..."],
        "recommendation": {{ "star_project_id": ID, "reason": "..." }},
        "growth_feedback": ["...", "..."],
        "projects": [
            {{
                "id": ID,
                "resume_description": "...",
                "highlights": ["...", "...", "..."],
                "tags": ["...", "...", "..."]
            }}
        ]
    }}
    """

    try:
        payload = {
            "model": ollama_model,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        
        response = requests.post(ollama_url, json=payload, timeout=90) # Increased timeout for more complex prompt
        response.raise_for_status()
        
        result_data = response.json()
        content = result_data.get('response', '').strip()
        
        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]
        content = content.strip()
        
        return json.loads(content)
    except Exception as e:
        print(f"Ollama AI Error: {e}")
        # Fallback to high-quality mock if Ollama fails
        return {
            "bio": f"I am {student_name}, a dedicated student focused on technical excellence and academic growth.",
            "skills": ["Problem Solving", "Technical Communication", "Research", "Project Management"],
            "recommendation": { "star_project_id": submissions_data[0]['id'] if submissions_data else None, "reason": "Demonstrates core competencies and attention to detail." },
            "growth_feedback": ["Explore more advanced frameworks", "Contribute to open source"],
            "projects": [
                {
                    "id": s['id'],
                    "resume_description": s['description'] or "Detailed project implementation focused on efficiency.",
                    "highlights": ["Implemented core functionality", "Optimized performance", "Collaborated on design"],
                    "tags": (s['tags'] or "Development").split(',')
                } for s in submissions_data
            ]
        }

def suggest_task_description(title, subject):
    """
    Uses local Ollama AI to generate a detailed task description for teachers.
    """
    ollama_url = getattr(settings, 'OLLAMA_URL', 'http://localhost:11434/api/generate')
    ollama_model = getattr(settings, 'OLLAMA_MODEL', 'llama3')

    prompt = f"""
    You are an academic curriculum designer. 
    A teacher is creating a task titled "{title}" for the subject "{subject}".
    
    Generate a professional and detailed task description that includes:
    1. A clear objective.
    2. Key requirements/deliverables.
    3. Technical skills involved.
    
    Return the response strictly in JSON format with the following structure:
    {{
        "description": "..."
    }}
    Do not include any preamble or extra text, just the JSON.
    """

    try:
        payload = {
            "model": ollama_model,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }
        
        response = requests.post(ollama_url, json=payload, timeout=60)
        response.raise_for_status()
        
        result_data = response.json()
        content = result_data.get('response', '').strip()
        
        if content.startswith('```json'):
            content = content[7:]
        if content.endswith('```'):
            content = content[:-3]
        
        return json.loads(content.strip())
    except Exception as e:
        print(f"Ollama AI Error: {e}")
        return {
            "description": f"Develop a comprehensive project for {title} within the {subject} domain. Focus on technical implementation and best practices."
        }

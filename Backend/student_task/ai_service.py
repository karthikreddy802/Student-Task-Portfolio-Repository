import requests
from django.conf import settings
import json

def generate_portfolio_content(student_name, submissions_data):
    """
    Uses local Ollama AI to organize and enhance portfolio content.
    """
    ollama_url = getattr(settings, 'OLLAMA_URL', 'http://localhost:11434/api/generate')
    ollama_model = getattr(settings, 'OLLAMA_MODEL', 'llama3')

    prompt = f"""
    You are an expert career coach and portfolio designer. 
    A student named {student_name} is building their academic portfolio.
    
    Here is the data of their selected best works:
    {json.dumps(submissions_data)}
    
    Tasks:
    1. Generate a professional, compelling bio (2-3 sentences) for this student based on their projects.
    2. For each project, provide a "professional_summary" (max 100 words) that enhances the student's original description.
    3. Suggest 3 additional "industry_tags" for each project.
    
    Return the response strictly in JSON format with the following structure:
    {{
        "bio": "...",
        "projects": [
            {{
                "id": project_id,
                "summary": "...",
                "tags": ["tag1", "tag2", "tag3"]
            }}
        ]
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
        
        # Remove potential markdown code blocks if the model included them
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
            "bio": f"I am {student_name}, a dedicated student focused on technical excellence. This portfolio represents a curated selection of my most impactful projects.",
            "projects": [
                {
                    "id": s['id'],
                    "summary": s['description'] or "Detailed project implementation.",
                    "tags": (s['tags'] or "Development").split(',')
                } for s in submissions_data
            ]
        }

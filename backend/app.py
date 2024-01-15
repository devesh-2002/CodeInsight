from flask import Flask, request, jsonify  # Make sure to import jsonify
import os
from github import Github
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def authenticate_github(access_token):
    return Github(access_token)

def authenticate_gemini(api_key):
    genai.configure(api_key=api_key)

def analyze_code(repository, model_name='gemini-pro', max_words=200):
    model = genai.GenerativeModel(model_name)

    temp_dir = 'cloned_repo'  
    repo_path = os.path.join(temp_dir, repository.name)

    if os.path.exists(repo_path):
        os.system(f'rm -rf {repo_path}')
    os.system(f'git clone {repository.clone_url} {repo_path}')

    code_files = get_code_files(repo_path, valid_extensions=('.py' ,'.sol','.java', '.cpp', '.js','.jsx', '.html', '.ts','.tsx', '.ipynb', '.css', '.php', '.rb', '.swift', '.go', '.c', '.h', '.json', '.xml'))
    insights = []

    for code_file in code_files:
        try:
            with open(code_file, 'r') as file:
                code_content = file.read()

            words = code_content.split()
            code_content = ' '.join(words[:max_words])

            response = model.generate_content(f"What the code is all about? Give summary of whole code and reduce the time complexity: {code_content}. Suggest additional test cases for better coverage. Pinpointing bugs with possible solutions or preventive measures. Also, at the end Give summary of what you understood from all the files of this respository in general.")
            print(response.text)
            
            insight = {
                'file': code_file,
                'suggestions': response.text,
            }

            insights.append(insight)
        except Exception as e:
            print(f"Error processing file {code_file}: {str(e)}")

    return insights

def get_code_files(directory, valid_extensions=('.py', '.md','.sol' ,'.html', '.js','.jsx','.dart', '.css','.ipynb','.ts','.tsx')):
    code_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(valid_extensions):
                code_files.append(os.path.join(root, file))
    return code_files

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    github_url = data.get('github_url')
    github_token = data.get('github_token')

    github = authenticate_github(github_token)
    authenticate_gemini(os.getenv("GEMINI_API_KEY"))  

    try:
        parts = github_url.rstrip('/').replace('https://github.com/', '').split('/')
        owner, repo_name = parts[0], parts[1]

        repository = github.get_user(owner).get_repo(repo_name)
        insights = analyze_code(repository)
        result = {
            'insights': insights
        }
        return jsonify(result)

    except (ValueError, IndexError) as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Invalid GitHub URL: {str(e)}'}), 400

if __name__ == '__main__':
    app.run(debug=True)

# CodeInsight
## Analyse, Get Code Suggestions and Summary for your Repository!
#### One can enter the URL of any Public Repository (and Private Repository of his/her own account) and get suggestions, summary related to the codebase.
## Tech Stack: 
1. Python - Flask, Gemini API
2. React - Chakra UI, Github Token
### Running the Project
1. Fork and Clone the repository.
2. Move to backend folder, create and activate the Virtual Environment :
```
cd backend
virtualenv env
env/Scripts/activate
```
3. Install the requirements :
```
pip install -r requirements.txt
```
4. Make a .env file and add ```GEMINI_API_KEY = '<API KEY VALUE>'```
5. Change the directory of cloning, by changing the value of ```temp_dir = '<path>' ``` (or add an empty ```cloned_dir``` named folder in the backend folder) in Line 19 of app.py in backend, add the path of directory where the cloned folders should be.
6. Run the Flask server :
```
python app.py
```
7. Move to the frontend directory.
8. Install the packages by :
```
yarn
```
9. Make a .env file in frontend folder and add the value of Github Token ```VITE_APP_GITHUB_TOKEN = '<GITHUB TOKEN>'```.
10. Run the project :
```
yarn run dev
```
11. Keep both the servers running, and visit ```localhost:5173``` to add the input.
12. **Before entering The Repository URL in the input, please ensure that it is not too large or not containing too many files**.

### Screenshots : 
<img width="539" alt="image" src="https://github.com/devesh-2002/CodeInsight/assets/79015420/1ad878e1-e3d2-470e-90b5-4c90eccf53a0">
<img width="392" alt="image" src="https://github.com/devesh-2002/CodeInsight/assets/79015420/c8b0a3e2-6217-4bef-aeb4-6981969248ef">

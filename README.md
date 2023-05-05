# Get a list of all your saved repos in an easy to use json format.

### Get a Github personal access token here:
https://github.com/settings/tokens?type=beta

### Run it:
```
GITHUB_TOKEN="REPLACE THIS" python collect.py "github username"
```
 
### Example of Json format: 
```json
[
{
        "title": "langchain-mini",
        "url": "https://github.com/ColinEberhardt/langchain-mini",
        "repo_description": "\ud83e\udd9c\ufe0f\ud83d\udd17 This is a very simple re-implementation of LangChain, in ~100 lines of code",
        "repo_readme": "# \ud83e\udd9c\ufe0f\ud83d\udd17 LangChain-mini \n\nThis is a very simple re-implementation of [LangChain](https://github.com/hwchase17/langchain), in ~100 lines of code. In essence, it is an LLM (GPT-3.5) powered chat application that is able to use tools (Google search and a calculator) in order to hold conversations and answer questions. \n\nHere's an example:\n\n~~~\nQ: What is the world record for solving a rubiks cube?\nThe world record for solving a Rubik's Cube is 4.69 seconds, held by Yiheng Wang (China).\nQ: Can a robot solve it faster?\nThe fastest time a robot has solved a Rubik's Cube is 0.637 seconds.\nQ: Who made this robot?\nInfineon created the robot that solved a Rubik's Cube in 0.637 seconds.\nQ: What time would an average human expect for solving?\nIt takes the average person about three hours to solve a Rubik's cube for the first time.\n~~~\n\nThis is not intended to be a replacement for LangChain, instead it was built for fun and educational purposes. If you're interested in how LangChain, and similar tools work, this is a good starting point.\n\n## Running / developing\n\nInstall dependencies, and run (with node >= v18):\n\n~~~\n% npm install\n~~~\n\nYou'll need to have both an OpenAI and SerpApi keys. These can be supplied to the application via a `.env` file:\n\n~~~\nOPENAI_API_KEY=\"...\"\nSERPAPI_API_KEY=\"...\"\n~~~\n\nYou can now run the chain:\n\n~~~\n% node index.mjs\nHow can I help? what was the name of the first man on the moon?\nNeil Armstrong\n~~~\n\n",
        "owner_username": "ColinEberhardt",
        "clone_url": "https://github.com/ColinEberhardt/langchain-mini.git"
}
]
```


import requests
import base64
import time
import json
import logging
from os import environ
from urllib3.exceptions import MaxRetryError
import sys

GITHUB_TOKEN = environ.get("GITHUB_TOKEN")

logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

def backoff(retries):
    delay = 2 ** retries
    logging.info(f"Retrying in {delay} seconds...")
    time.sleep(delay)

def get_starred_repos(username):
    repos = []
    page = 1
    while True:
        url = f"https://api.github.com/users/{username}/starred?page={page}&per_page=100"
        headers = {"Authorization": f"token {GITHUB_TOKEN}"}
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            page_repos = response.json()
            if not page_repos:
                break
            repos.extend(page_repos)
            page += 1
        else:
            raise Exception(f"Failed to retrieve starred repositories for {username}. Error: {response.text}")
    return repos

def get_readme(repo):
    url = f"https://api.github.com/repos/{repo['full_name']}/readme"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}
    retries = 3
    while retries > 0:
        try:
            response = requests.get(url, headers=headers)
        except MaxRetryError as e:
            retries -= 1
            if retries == 0:
                logging.error(f"Failed to retrieve README for {repo['full_name']}: {e}")
                return None
            backoff(3 - retries)
        else:
            if response.status_code == 200:
                content = base64.b64decode(response.json()["content"]).decode("utf-8")
                logging.info(f"Downloaded README for {repo['full_name']}")
                return content
            else:
                logging.error(f"Failed to retrieve README for {repo['full_name']}: {response.text}")
                return None

def format_repo_data(repo):
    readme = get_readme(repo)
    return {
        "title": repo["name"],
        "url": repo["html_url"],
        "repo_description": repo["description"],
        "repo_readme": readme,
        "owner_username": repo["owner"]["login"],
        "clone_url": repo["clone_url"]
    }

def get_starred_repos_data(username):
    starred_repos = get_starred_repos(username)
    return [format_repo_data(repo) for repo in starred_repos]


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} username")
        sys.exit(1)
    username = sys.argv[1]
    with open("starred_repo_data.json", "w") as f:
        json.dump(get_starred_repos_data(username), f)

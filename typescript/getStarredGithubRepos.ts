import axios from 'axios';

interface RepoData {
  title: string;
  url: string;
  repo_description: string | null;
  repo_readme: string | null;
  owner_username: string;
  clone_url: string;
}

const GITHUB_API_URL = 'https://api.github.com';

function backoff(retries: number): Promise<void> {
  const delay = 2 ** retries;
  console.log(`Retrying in ${delay} seconds...`);
  return new Promise((resolve) => setTimeout(resolve, delay * 1000));
}

async function getStarredRepos(username: string, token?: string): Promise<any[]> {
  const headers = { Authorization: `token ${token}` };
  let repos = [];
  let page = 1;
  while (true) {
    const url = `${GITHUB_API_URL}/users/${username}/starred?page=${page}&per_page=100`;
    const response = await axios.get(url, { headers });
    if (response.status === 200) {
      const pageRepos = response.data;
      if (!pageRepos.length) {
        break;
      }
      repos = repos.concat(pageRepos);
      page++;
    } else {
      throw new Error(`Failed to retrieve starred repositories for ${username}. Error: ${response.statusText}`);
    }
  }
  return repos;
}

async function getReadme(repo: any, token?: string): Promise<string | null> {
  const url = `${GITHUB_API_URL}/repos/${repo.full_name}/readme`;
  const headers = { Authorization: `token ${token}` };
  let retries = 3;
  while (retries > 0) {
    try {
      const response = await axios.get(url, { headers });
      if (response.status === 200) {
        const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        console.log(`Downloaded README for ${repo.full_name}`);
        return content;
      } else {
        console.error(`Failed to retrieve README for ${repo.full_name}: ${response.statusText}`);
        return null;
      }
    } catch (error) {
      if (error.code === 'ECONNABORTED' || error.response?.status === 403) {
        retries--;
        if (retries === 0) {
          console.error(`Failed to retrieve README for ${repo.full_name}: ${error.message}`);
          return null;
        }
        await backoff(3 - retries);
      } else {
        console.error(`Failed to retrieve README for ${repo.full_name}: ${error.message}`);
        return null;
      }
    }
  }
  return null;
}

async function formatRepoData(repo: any, token?: string): Promise<RepoData> {
  const readme = await getReadme(repo, token);
  return {
    title: repo.name,
    url: repo.html_url,
    repo_description: repo.description || null,
    repo_readme: readme,
    owner_username: repo.owner.login,
    clone_url: repo.clone_url,
  };
}

export async function getStarredReposData(username: string, token?: string): Promise<RepoData[]> {
  const starredRepos = await getStarredRepos(username, token);
  const reposData = await Promise.all(starredRepos.map((repo) => formatRepoData(repo, token)));
  return reposData;
}

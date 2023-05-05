import { getStarredReposData } from './getStarredGithubRepos';

async function main() {
  const username = 'your-github-username';
  const token = 'your-github-token'; // required for more than a couple repositories
  const reposData = await getStarredReposData(username, token);
  console.log(reposData);
}

main();

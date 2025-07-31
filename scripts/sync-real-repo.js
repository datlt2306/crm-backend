import { execSync } from 'child_process';

const REAL_REPO = 'https://github.com/datlt2306/crm-backend.git'; // sửa lại repo thật
const BRANCH = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();

console.log(`Sync code to real repo: ${REAL_REPO} (${BRANCH})`);
try {
  execSync(`git push ${REAL_REPO} ${BRANCH}`, { stdio: 'inherit' });
} catch (e) {
  console.error('Sync to real repo failed:', e.message);
  process.exit(1);
}

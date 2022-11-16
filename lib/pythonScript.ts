import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const pExecFile = promisify(execFile);

export async function loadRedditPost(redditId) {
    const {EXEC_PYTHON, ROOT_DIR} = process.env
    if (!EXEC_PYTHON || !ROOT_DIR) throw new Error("Set environment variables");
    let std = await pExecFile(EXEC_PYTHON, ['./scripts/reddit/python/loadRedditPost.py', redditId], {cwd: ROOT_DIR});
    const json = JSON.parse(std.stdout);
    return json.id as string;
}


export async function updateComments(id) {
    const {EXEC_PYTHON, ROOT_DIR} = process.env
    if (!EXEC_PYTHON || !ROOT_DIR) throw new Error("Set environment variables");
    let std = await pExecFile(EXEC_PYTHON, ['./scripts/reddit/python/updateComments.py', id], {cwd: ROOT_DIR});
}
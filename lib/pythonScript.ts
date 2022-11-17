import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const pExecFile = promisify(execFile);

export async function runPython(scriptName, argv) {
    const {EXEC_PYTHON, ROOT_DIR} = process.env
    if (!EXEC_PYTHON || !ROOT_DIR) throw new Error("Set environment variables");
    let std = await pExecFile(EXEC_PYTHON, [`./scripts/reddit/python/${scriptName}`, ...argv], {cwd: ROOT_DIR});
    return std;
}

export async function loadRedditPost(redditId) {
    const std = await runPython('loadRedditPost.py', [redditId]);
    const json = JSON.parse(std.stdout);
    return json.id as string;
}


export async function updateComments(id) {
    await runPython('updateComments.py', [id]);
}

export async function updatePosts() {
    await runPython('updatePosts.py', []);
}
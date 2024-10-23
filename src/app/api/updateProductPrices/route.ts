import * as child from 'node:child_process';

export async function GET() {
  child.exec(`node flipkart-sync.mjs`);
  return Response.json({ status: 'ok' });
}

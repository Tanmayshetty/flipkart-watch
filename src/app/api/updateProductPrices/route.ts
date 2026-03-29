import * as child from 'node:child_process';
import { NextResponse } from 'next/server';

export async function GET() {
  child.exec(`node flipkart-sync.mjs`);
  return NextResponse.json({ status: 'ok' });
}

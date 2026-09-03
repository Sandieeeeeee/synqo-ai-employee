import { NextRequest } from "next/server";

import { adminAuth } from "./firebase-admin";

export async function requireUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return adminAuth.verifyIdToken(token);
}

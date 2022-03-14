import mongoose from "mongoose";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  const id = req.page.params?.id || "";

  const checkMongoIDRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  if (!checkMongoIDRegExp.test(id))
    return new Response(JSON.stringify({ message: "Id invalido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  return NextResponse.next();
}

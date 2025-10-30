import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const locale = typeof data?.locale === "string" ? data.locale : null;

    if (!locale || !["en", "vi"].includes(locale)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("aka_locale", locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}



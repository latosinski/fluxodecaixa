import { NextRequest, NextResponse } from "next/server";
import {
    verifyAdminPassword,
    createSessionToken,
    SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
    let body: { password?: unknown };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Corpo da requisição inválido." },
            { status: 400 }
        );
    }

    const { password } = body;

    if (typeof password !== "string" || password.length === 0) {
        return NextResponse.json(
            { ok: false, error: "Informe a senha." },
            { status: 400 }
        );
    }

    if (!verifyAdminPassword(password)) {
        return NextResponse.json(
            { ok: false, error: "Senha incorreta." },
            { status: 401 }
        );
    }

    const sessionToken = createSessionToken();

    const response = NextResponse.json({ ok: true });

    response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 4, // 4 horas
    });

    console.log("[ADMIN] Login realizado com sucesso");

    return response;
}
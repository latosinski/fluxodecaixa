import { NextRequest, NextResponse } from "next/server";
import {
    verifySessionToken,
    addLicenseToken,
    SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (!verifySessionToken(session)) {
        return NextResponse.json(
            { ok: false, error: "Não autorizado." },
            { status: 401 }
        );
    }

    let body: { cliente?: unknown };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Corpo da requisição inválido." },
            { status: 400 }
        );
    }

    const { cliente } = body;

    if (typeof cliente !== "string" || cliente.trim().length < 2) {
        return NextResponse.json(
            { ok: false, error: "Informe o nome do cliente (mínimo 2 caracteres)." },
            { status: 400 }
        );
    }

    try {
        const novo = await addLicenseToken(cliente);

        console.log("[ADMIN] Token gerado:", {
            token: novo.token,
            cliente: novo.cliente,
            criadoEm: novo.criadoEm,
        });

        return NextResponse.json({ ok: true, token: novo });
    } catch (err) {
        console.error("[ADMIN] Erro ao gerar token:", err);
        return NextResponse.json(
            { ok: false, error: "Erro ao gerar token. Tente novamente." },
            { status: 500 }
        );
    }
}
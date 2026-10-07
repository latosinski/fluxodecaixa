import { NextRequest, NextResponse } from "next/server";
import { findLicenseToken, markTokenAsUsed } from "@/lib/auth";

export async function POST(request: NextRequest) {
    let body: { token?: unknown };

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { ok: false, error: "Corpo da requisição inválido." },
            { status: 400 }
        );
    }

    const { token } = body;

    if (typeof token !== "string" || token.trim().length === 0) {
        return NextResponse.json(
            { ok: false, error: "Informe um token." },
            { status: 400 }
        );
    }

    try {
        const encontrado = await findLicenseToken(token);

        if (!encontrado) {
            return NextResponse.json(
                { ok: false, error: "Token inválido." },
                { status: 404 }
            );
        }

        if (encontrado.status !== "ativo") {
            return NextResponse.json(
                { ok: false, error: "Token revogado. Contate o suporte." },
                { status: 403 }
            );
        }

        if (encontrado.usadoEm) {
            return NextResponse.json(
                {
                    ok: false,
                    error: "Este token já foi utilizado. Contate o suporte.",
                },
                { status: 403 }
            );
        }

        // Marca o token como usado antes de liberar o download
        await markTokenAsUsed(encontrado.token);

        console.log("[RESTRITO] Token validado e marcado como usado:", {
            token: encontrado.token,
            cliente: encontrado.cliente,
        });

        return NextResponse.json({
            ok: true,
            cliente: encontrado.cliente,
            criadoEm: encontrado.criadoEm,
        });
    } catch (err) {
        console.error("[RESTRITO] Erro ao validar token:", err);
        return NextResponse.json(
            { ok: false, error: "Erro ao validar token. Tente novamente." },
            { status: 500 }
        );
    }
}
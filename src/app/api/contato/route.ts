import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
    nome?: unknown;
    email?: unknown;
    whatsapp?: unknown;
    mensagem?: unknown;
    url?: unknown;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function getTransport() {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!user || !pass) {
        throw new Error(
            "Credenciais de e-mail não configuradas (.env.local)."
        );
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
    });
}

export async function POST(request: Request) {
    let body: ContactPayload;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Corpo da requisição inválido." },
            { status: 400 }
        );
    }

    const { nome, email, whatsapp, mensagem, url } = body;

    // Honeypot: se o campo oculto veio preenchido, é bot.
    if (typeof url === "string" && url.trim() !== "") {
        return NextResponse.json({ ok: true });
    }

    if (typeof nome !== "string" || nome.trim().length < 2) {
        return NextResponse.json(
            { error: "Informe um nome válido." },
            { status: 400 }
        );
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
        return NextResponse.json(
            { error: "Informe um e-mail válido." },
            { status: 400 }
        );
    }

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim();
    const whatsappLimpo =
        typeof whatsapp === "string" ? whatsapp.trim() : "";
    const mensagemLimpa =
        typeof mensagem === "string" ? mensagem.trim() : "";

    const destino = process.env.CONTACT_TO ?? process.env.GMAIL_USER;

    if (!destino) {
        console.error("[CONTATO] CONTACT_TO não configurado.");
        return NextResponse.json(
            { error: "Configuração de contato ausente no servidor." },
            { status: 500 }
        );
    }

    try {
        const transport = getTransport();

        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #3D3D3D;">Nova mensagem pelo site Cash Pró</h2>
                <p><strong>Nome:</strong> ${escapeHtml(nomeLimpo)}</p>
                <p><strong>E-mail:</strong> ${escapeHtml(emailLimpo)}</p>
                <p><strong>WhatsApp:</strong> ${escapeHtml(
                    whatsappLimpo || "(não informado)"
                )}</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p><strong>Mensagem:</strong></p>
                <p style="white-space: pre-wrap;">${escapeHtml(
                    mensagemLimpa || "(vazia)"
                )}</p>
            </div>
        `;

        await transport.sendMail({
            from: `"Cash Pró — Site" <${process.env.GMAIL_USER}>`,
            to: destino,
            replyTo: emailLimpo,
            subject: `[Cash Pró] Nova mensagem de ${nomeLimpo}`,
            text: [
                `Nome: ${nomeLimpo}`,
                `E-mail: ${emailLimpo}`,
                `WhatsApp: ${whatsappLimpo || "(não informado)"}`,
                "",
                "Mensagem:",
                mensagemLimpa || "(vazia)",
            ].join("\n"),
            html,
        });

        console.log("[CONTATO] E-mail enviado:", {
            nome: nomeLimpo,
            email: emailLimpo,
            whatsapp: whatsappLimpo || "(não informado)",
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("[CONTATO] Erro ao enviar e-mail:", err);
        return NextResponse.json(
            { error: "Não foi possível enviar. Tente novamente." },
            { status: 500 }
        );
    }
}
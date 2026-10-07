import { randomBytes, createHmac, timingSafeEqual } from "crypto";
import { promises as fs } from "fs";
import path from "path";

/* ============================================
   CONFIGURAÇÃO
   ============================================ */

const TOKENS_FILE = path.join(process.cwd(), "data", "tokens.json");

// Pode ser sobrescrito por variáveis de ambiente em produção
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SESSION_SECRET =
    process.env.SESSION_SECRET ?? "cashpro-session-secret-change-me";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 4; // 4 horas

/* ============================================
   TIPOS
   ============================================ */

export type LicenseToken = {
    token: string;
    cliente: string;
    criadoEm: string;
    usadoEm: string | null;
    status: "ativo" | "revogado";
};

type TokensFile = {
    tokens: LicenseToken[];
};

/* ============================================
   HELPERS INTERNOS
   ============================================ */

function base64url(input: Buffer | string): string {
    const buf = typeof input === "string" ? Buffer.from(input) : input;
    return buf
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function sign(data: string): string {
    return base64url(createHmac("sha256", SESSION_SECRET).update(data).digest());
}

async function ensureTokensFile(): Promise<void> {
    try {
        await fs.access(TOKENS_FILE);
    } catch {
        await fs.mkdir(path.dirname(TOKENS_FILE), { recursive: true });
        await fs.writeFile(
            TOKENS_FILE,
            JSON.stringify({ tokens: [] }, null, 2),
            "utf-8"
        );
    }
}

/* ============================================
   SESSÃO DO ADMIN
   ============================================ */

export function verifyAdminPassword(password: string): boolean {
    const a = Buffer.from(password);
    const b = Buffer.from(ADMIN_PASSWORD);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
}

export function createSessionToken(): string {
    const payload = JSON.stringify({
        role: "admin",
        exp: Date.now() + SESSION_DURATION_MS,
    });
    const payloadEncoded = base64url(payload);
    const signature = sign(payloadEncoded);
    return `${payloadEncoded}.${signature}`;
}

export function verifySessionToken(token: string | undefined): boolean {
    if (!token) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;

    const [payloadEncoded, signature] = parts;

    const expectedSignature = sign(payloadEncoded);
    if (expectedSignature !== signature) return false;

    try {
        const payload = JSON.parse(
            Buffer.from(payloadEncoded, "base64").toString("utf-8")
        );
        if (payload.role !== "admin") return false;
        if (typeof payload.exp !== "number") return false;
        if (payload.exp < Date.now()) return false;
        return true;
    } catch {
        return false;
    }
}

export const SESSION_COOKIE_NAME = "cashpro_admin_session";

/* ============================================
   TOKENS DE LICENÇA
   ============================================ */

export function generateLicenseToken(): string {
    // Alfabeto sem I, O, 0, 1 para evitar confusão visual
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    const block = () => {
        const bytes = randomBytes(4);
        return Array.from(bytes)
            .map((b) => alphabet[b % alphabet.length])
            .join("");
    };

    return `CASH-${block()}-${block()}-${block()}`;
}

export async function readTokens(): Promise<LicenseToken[]> {
    await ensureTokensFile();
    try {
        const raw = await fs.readFile(TOKENS_FILE, "utf-8");
        const data: TokensFile = JSON.parse(raw);
        return Array.isArray(data.tokens) ? data.tokens : [];
    } catch {
        return [];
    }
}

export async function writeTokens(tokens: LicenseToken[]): Promise<void> {
    await ensureTokensFile();
    await fs.writeFile(
        TOKENS_FILE,
        JSON.stringify({ tokens }, null, 2),
        "utf-8"
    );
}

export async function addLicenseToken(
    cliente: string
): Promise<LicenseToken> {
    const tokens = await readTokens();

    let token: string;
    let tentativas = 0;
    do {
        token = generateLicenseToken();
        tentativas++;
    } while (
        tokens.some((t) => t.token === token) &&
        tentativas < 10
    );

    const novo: LicenseToken = {
        token,
        cliente: cliente.trim() || "Sem nome",
        criadoEm: new Date().toISOString(),
        usadoEm: null,
        status: "ativo",
    };

    tokens.push(novo);
    await writeTokens(tokens);
    return novo;
}

export async function findLicenseToken(
    token: string
): Promise<LicenseToken | null> {
    const tokens = await readTokens();
    const normalizado = token.trim().toUpperCase();
    return tokens.find((t) => t.token === normalizado) ?? null;
}

export async function markTokenAsUsed(token: string): Promise<boolean> {
    const tokens = await readTokens();
    const alvo = tokens.find(
        (t) => t.token === token.trim().toUpperCase()
    );
    if (!alvo) return false;
    alvo.usadoEm = new Date().toISOString();
    await writeTokens(tokens);
    return true;
}

export async function revokeLicenseToken(token: string): Promise<boolean> {
    const tokens = await readTokens();
    const alvo = tokens.find(
        (t) => t.token === token.trim().toUpperCase()
    );
    if (!alvo) return false;
    alvo.status = "revogado";
    await writeTokens(tokens);
    return true;
}
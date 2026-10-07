"use client";

import { useEffect, useState } from "react";

type LicenseToken = {
    token: string;
    cliente: string;
    criadoEm: string;
    status: "ativo" | "revogado";
};

const STORAGE_KEY = "cashpro_admin_logged";

export default function AdminPage() {
    const [logged, setLogged] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);

    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);

    const [cliente, setCliente] = useState("");
    const [generating, setGenerating] = useState(false);
    const [generateError, setGenerateError] = useState("");
    const [generatedToken, setGeneratedToken] =
        useState<LicenseToken | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const flag = localStorage.getItem(STORAGE_KEY);
        setLogged(flag === "true");
        setCheckingSession(false);
    }, []);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoginError("");
        setLoggingIn(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.ok) {
                setLoginError(data.error ?? "Falha no login.");
                return;
            }

            localStorage.setItem(STORAGE_KEY, "true");
            setLogged(true);
            setPassword("");
        } catch {
            setLoginError("Erro de rede. Tente novamente.");
        } finally {
            setLoggingIn(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem(STORAGE_KEY);
        setLogged(false);
        setGeneratedToken(null);
        setCliente("");
        setGenerateError("");
        setLoginError("");
    }

    async function handleGenerate(e: React.FormEvent) {
        e.preventDefault();
        setGenerateError("");
        setGeneratedToken(null);
        setCopied(false);
        setGenerating(true);

        try {
            const res = await fetch("/api/admin/gerar-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cliente }),
            });
            const data = await res.json().catch(() => ({}));

            if (res.status === 401) {
                localStorage.removeItem(STORAGE_KEY);
                setLogged(false);
                setLoginError("Sessão expirada. Faça login novamente.");
                return;
            }

            if (!res.ok || !data.ok) {
                setGenerateError(data.error ?? "Falha ao gerar token.");
                return;
            }

            setGeneratedToken(data.token);
            setCliente("");
        } catch {
            setGenerateError("Erro de rede. Tente novamente.");
        } finally {
            setGenerating(false);
        }
    }

    async function handleCopy() {
        if (!generatedToken) return;
        try {
            await navigator.clipboard.writeText(generatedToken.token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    }

    if (checkingSession) {
        return (
            <main className="admin-page">
                <div className="admin-card">
                    <p className="admin-loading">Verificando sessão...</p>
                </div>
            </main>
        );
    }

    if (!logged) {
        return (
            <main className="admin-page">
                <div className="admin-card">
                    <h1 className="admin-title">Painel Administrativo</h1>
                    <p className="admin-subtitle">
                        Acesso restrito. Informe a senha do administrador.
                    </p>

                    <form onSubmit={handleLogin} className="admin-form">
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Senha do administrador"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loggingIn}
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            {loggingIn ? "Entrando..." : "Entrar"}
                        </button>

                        {loginError && (
                            <p className="form-feedback form-feedback--error">
                                {loginError}
                            </p>
                        )}
                    </form>
                </div>
            </main>
        );
    }

    return (
        <main className="admin-page">
            <div className="admin-card admin-card--wide">
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title">Painel Administrativo</h1>
                        <p className="admin-subtitle">
                            Geração de tokens de licença
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={handleLogout}
                    >
                        Sair
                    </button>
                </div>

                <form onSubmit={handleGenerate} className="admin-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Nome do cliente"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            minLength={2}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={generating}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        {generating ? "Gerando..." : "Gerar Token"}
                    </button>

                    {generateError && (
                        <p className="form-feedback form-feedback--error">
                            {generateError}
                        </p>
                    )}
                </form>

                {generatedToken && (
                    <div className="admin-token-result">
                        <p className="admin-token-label">
                            Token gerado para{" "}
                            <strong>{generatedToken.cliente}</strong>
                        </p>
                        <div className="admin-token-box">
                            <code>{generatedToken.token}</code>
                            <button
                                type="button"
                                className="btn btn-primary admin-token-copy"
                                onClick={handleCopy}
                            >
                                {copied ? "Copiado!" : "Copiar"}
                            </button>
                        </div>
                        <p className="admin-token-meta">
                            Criado em{" "}
                            {new Date(generatedToken.criadoEm).toLocaleString(
                                "pt-BR"
                            )}
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}

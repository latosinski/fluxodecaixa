"use client";

import { useEffect, useState } from "react";

// Caminho e nome do arquivo do sistema que será baixado após validação.
// Para trocar, é só alterar essas duas constantes.
const DOWNLOAD_PATH = "/downloads/fluxodecaixa.exe";
const DOWNLOAD_FILENAME = "fluxodecaixa.exe";

type Resultado =
    | { tipo: "idle" }
    | { tipo: "ok"; cliente: string; criadoEm: string }
    | { tipo: "erro"; mensagem: string };

export default function RestritoPage() {
    const [token, setToken] = useState("");
    const [validando, setValidando] = useState(false);
    const [resultado, setResultado] = useState<Resultado>({ tipo: "idle" });

    function dispararDownload() {
        const a = document.createElement("a");
        a.href = DOWNLOAD_PATH;
        a.download = DOWNLOAD_FILENAME;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    useEffect(() => {
        if (resultado.tipo === "ok") {
            dispararDownload();
        }
    }, [resultado]);

    async function handleValidar(e: React.FormEvent) {
        e.preventDefault();
        setValidando(true);
        setResultado({ tipo: "idle" });

        try {
            const res = await fetch("/api/restrito/validar-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.ok) {
                setResultado({
                    tipo: "erro",
                    mensagem: data.error ?? "Falha ao validar token.",
                });
                return;
            }

            setResultado({
                tipo: "ok",
                cliente: data.cliente,
                criadoEm: data.criadoEm,
            });
        } catch {
            setResultado({
                tipo: "erro",
                mensagem: "Erro de rede. Tente novamente.",
            });
        } finally {
            setValidando(false);
        }
    }

    function handleNovo() {
        setToken("");
        setResultado({ tipo: "idle" });
    }

    return (
        <main className="admin-page">
            <div className="admin-card admin-card--wide">
                <h1 className="admin-title">Validação de Licença</h1>
                <p className="admin-subtitle">
                    Informe o token recebido para liberar o acesso ao sistema.
                </p>

                {resultado.tipo !== "ok" && (
                    <form onSubmit={handleValidar} className="admin-form">
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="CASH-XXXX-XXXX-XXXX"
                                value={token}
                                onChange={(e) =>
                                    setToken(e.target.value.toUpperCase())
                                }
                                autoFocus
                                required
                                style={{
                                    fontFamily: '"Courier New", monospace',
                                    letterSpacing: "0.05em",
                                    textAlign: "center",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={validando}
                            style={{ width: "100%", justifyContent: "center" }}
                        >
                            {validando ? "Validando..." : "Validar Token"}
                        </button>

                        {resultado.tipo === "erro" && (
                            <p className="form-feedback form-feedback--error">
                                {resultado.mensagem}
                            </p>
                        )}
                    </form>
                )}

                {resultado.tipo === "ok" && (
                    <div className="admin-token-result">
                        <p className="admin-token-label">
                            Licença válida para{" "}
                            <strong>{resultado.cliente}</strong>
                        </p>
                        <p className="admin-token-meta">
                            Ativada em{" "}
                            {new Date(resultado.criadoEm).toLocaleString(
                                "pt-BR"
                            )}
                        </p>
                        <p className="admin-token-meta">
                            O download do sistema deve ter iniciado
                            automaticamente. Caso não tenha, use o botão abaixo.
                        </p>

                        <div
                            style={{
                                marginTop: "1.25rem",
                                display: "flex",
                                gap: "0.75rem",
                                flexWrap: "wrap",
                            }}
                        >
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={dispararDownload}
                            >
                                Baixar novamente
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={handleNovo}
                            >
                                Validar outro token
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
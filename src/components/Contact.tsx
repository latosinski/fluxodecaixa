"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
    const [status, setStatus] = useState<Status>("idle");
    const [feedback, setFeedback] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            nome: formData.get("nome") ?? "",
            email: formData.get("email") ?? "",
            whatsapp: formData.get("whatsapp") ?? "",
            mensagem: formData.get("mensagem") ?? "",
            url: formData.get("url") ?? "",
        };

        setStatus("sending");
        setFeedback("");

        try {
            const res = await fetch("/api/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data: { ok?: boolean; error?: string } = await res
                .json()
                .catch(() => ({}));

            if (!res.ok || !data.ok) {
                setStatus("error");
                setFeedback(
                    data.error ?? "Não foi possível enviar. Tente novamente."
                );
                return;
            }

            setStatus("success");
            setFeedback(
                "Mensagem enviada com sucesso! Responderemos em breve."
            );
            form.reset();
        } catch {
            setStatus("error");
            setFeedback("Erro de rede. Verifique sua conexão e tente novamente.");
        }
    }

    return (
        <section id="contato" className="contact">
            <h2 className="section-title" data-aos="fade-up">
                Fale com a gente
            </h2>
            <p className="section-subtitle" data-aos="fade-up">
                Dúvidas sobre o sistema? Envie uma mensagem.
            </p>

            <div
                className="contact-form"
                data-aos="fade-up"
                data-aos-delay="100"
            >
                <form onSubmit={handleSubmit} noValidate={false}>
                    <div style={{ display: "none" }} aria-hidden="true">
                        <input
                            type="text"
                            name="url"
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            name="nome"
                            placeholder="Seu nome"
                            required
                            minLength={2}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="E-mail"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="tel"
                            name="whatsapp"
                            placeholder="WhatsApp"
                        />
                    </div>

                    <div className="form-group">
                        <textarea
                            name="mensagem"
                            placeholder="Sua mensagem"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={status === "sending"}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        {status === "sending" ? "Enviando..." : "Enviar"}
                    </button>

                    {feedback && (
                        <p
                            className={`form-feedback form-feedback--${status}`}
                            role="status"
                            aria-live="polite"
                        >
                            {feedback}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}
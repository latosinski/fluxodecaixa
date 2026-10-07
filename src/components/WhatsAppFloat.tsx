"use client";

import { WhatsappLogo } from "@phosphor-icons/react";

export default function WhatsAppFloat() {
    return (
        <a
            href="https://wa.me/5551982127790?text=Olá! Quero saber mais sobre o Sistema Fluxo de Caixa."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-float"
            aria-label="Falar no WhatsApp"
        >
            <WhatsappLogo size={28} weight="fill" />
        </a>
    );
}
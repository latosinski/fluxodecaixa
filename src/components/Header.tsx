"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    const handleTopClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMenu();
    };

    return (
        <header id="top" className={scrolled ? "scrolled" : ""}>
            <Link href="#top" className="logo" onClick={handleTopClick}>
                Cash Pró Fluxo de Caixa
            </Link>

            <nav id="nav" className={menuOpen ? "active" : ""}>
                <ul>
                    <li>
                        <Link href="#top" onClick={handleTopClick}>
                            Início
                        </Link>
                    </li>
                    <li>
                        <Link href="#recursos" onClick={closeMenu}>
                            Recursos
                        </Link>
                    </li>
                    <li>
                        <Link href="#preco" onClick={closeMenu}>
                            Preço
                        </Link>
                    </li>
                    <li>
                        <Link href="#conheca" onClick={closeMenu}>
                            Conheça o sistema
                        </Link>
                    </li>
                    <li>
                        <Link href="#contato" onClick={closeMenu}>
                            Contato
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/documentacao/manual.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Documentação
                        </Link>
                    </li>
                    <li>
                        <Link href="/restrito" onClick={closeMenu}>
                            Área Restrita
                        </Link>
                    </li>
                </ul>
            </nav>

            <Link href="#preco" className="btn btn-primary">
                Quero Comprar
            </Link>

            <button
                className="mobile-menu-btn"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuOpen}
                aria-controls="nav"
            >
                <span
                    style={{
                        transform: menuOpen
                            ? "rotate(45deg) translate(5px, 5px)"
                            : "none",
                    }}
                />
                <span style={{ opacity: menuOpen ? 0 : 1 }} />
                <span
                    style={{
                        transform: menuOpen
                            ? "rotate(-45deg) translate(5px, -5px)"
                            : "none",
                    }}
                />
            </button>
        </header>
    );
}
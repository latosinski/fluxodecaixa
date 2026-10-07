import Link from "next/link";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer>
            <p>
                © {year} Sistema Fluxo de Caixa |{" "}
                <Link
                    href="/documentacao/manual.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Documentação
                </Link>
            </p>
        </footer>
    );
}
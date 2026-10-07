import Link from "next/link";
import Image from "next/image";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";

export default function Hero() {
    return (
        <section className="hero">
            <div className="hero-text" data-aos="fade-right">
                <h1>
                    Gestão financeira{" "}
                    <span>completa e intuitiva</span> para sua empresa
                </h1>
                <p>
                    Controle lançamentos, fluxo de caixa, metas, DRE, contas a
                    pagar e receber, plano de contas, relatórios e projeções
                    financeiras. Tudo em tempo real, com interface responsiva e
                    tema claro/escuro.
                </p>
                <div className="hero-buttons">
                    <Link href="#preco" className="btn btn-primary">
                        Comprar Agora
                    </Link>
                    <a
                        href="/sistema/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                    >
                        <DownloadSimple size={18} weight="regular" />
                        Testar Grátis
                    </a>
                </div>
            </div>

            <div
                className="hero-image"
                data-aos="fade-left"
                data-aos-delay="200"
            >
                <Image
                    src="/images/hero-sistema.png"
                    alt="Painel financeiro do sistema Fluxo de Caixa"
                    width={1440}
                    height={810}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>
        </section>
    );
}
import Image from "next/image";
import { CheckCircle, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

const benefits = [
    "Licença vitalícia",
    "Todos os módulos liberados",
    "Suporte via WhatsApp",
    "Instalação em 1 PC",
];

export default function DemoPrice() {
    return (
        <section id="preco" className="demo-price">
            <h2 className="section-title" data-aos="fade-up">
                Veja o sistema e garanta o seu
            </h2>
            <p className="section-subtitle" data-aos="fade-up">
                Imagem real do software. Licença com atualizações gratuitas.
            </p>

            <div className="demo-container">
                <div className="demo-screenshot" data-aos="fade-right">
                    <Image
                        src="/images/demo-sistema.png"
                        alt="Tela do Sistema Fluxo de Caixa"
                        width={1440}
                        height={810}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                </div>

                <div className="price-box" data-aos="fade-left">
                    <p className="price-old">De R$ 897,00</p>
                    <div className="price-tag">R$ 147,80</div>
                    <p className="price-payment">Pagamento via PIX</p>

                    <ul>
                        {benefits.map((benefit) => (
                            <li key={benefit}>
                                <CheckCircle size={18} weight="fill" />
                                {benefit}
                            </li>
                        ))}
                    </ul>

                    <a
                        href="https://wa.me/5551982127790?text=Olá! Tenho interesse no Sistema Fluxo de Caixa, quero comprar."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        <WhatsappLogo size={18} weight="fill" />
                        Comprar pelo WhatsApp
                    </a>

                    <a
                        href="/sistema/index.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="demo-link"
                    >
                        ou teste antes de comprar (versão demo)
                    </a>
                </div>
            </div>

            <p
                className="price-note"
                data-aos="fade-up"
                data-aos-delay="200"
            >
                *O Cash Pró é uma aplicação desktop para Windows desenvolvida para oferecer controle financeiro
completo e eficiente. Com ele, empreendedores, pequenas e médias empresas e profissionais de
finanças têm à disposição todas as ferramentas necessárias para gerenciar o fluxo de caixa com precisão
e segurança.
            </p>
        </section>
    );
}
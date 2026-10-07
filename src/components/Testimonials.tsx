import {
    TestTube,
    ChartLineUp,
    Headset,
} from "@phosphor-icons/react/dist/ssr";

const testimonials = [
    {
        Icon: TestTube,
        title: "Teste antes de comprar",
        text: "Conheça o sistema na prática através da versão demonstrativa e explore seus principais recursos antes de adquirir a licença.",
        delay: 0,
    },
    {
        Icon: ChartLineUp,
        title: "Desenvolvimento contínuo",
        text: "O Sistema Fluxo de Caixa está em evolução e busca oferecer recursos cada vez mais úteis para o controle, análise e projeção financeira.",
        delay: 150,
    },
    {
        Icon: Headset,
        title: "Suporte direto",
        text: "Tenha contato direto para esclarecer dúvidas sobre o sistema, instalação e utilização dos recursos disponíveis.",
        delay: 300,
    },
];

export default function Testimonials() {
    return (
        <section id="conheca" className="testimonials">
            <h2 className="section-title" data-aos="fade-up">
                Conheça o Sistema Fluxo de Caixa
            </h2>
            <p className="section-subtitle" data-aos="fade-up">
                Um sistema desenvolvido para simplificar a gestão financeira da
                sua empresa.
            </p>

            <div className="testimonials-grid">
                {testimonials.map(({ Icon, title, text, delay }, i) => (
                    <div
                        key={`${title}-${i}`}
                        className="testimonial-card"
                        data-aos="flip-left"
                        data-aos-delay={delay}
                    >
                        <div className="feature-icon">
                            <Icon size={32} weight="regular" />
                        </div>
                        <h3>{title}</h3>
                        <p className="testimonial-text">{text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
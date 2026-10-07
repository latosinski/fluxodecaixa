import {
    ChartLineUp,
    Notepad,
    CurrencyDollar,
    Target,
} from "@phosphor-icons/react/dist/ssr";

const features = [
    {
        Icon: ChartLineUp,
        title: "Dashboard",
        description:
            "Cartões de resumo (receitas, despesas, saldo, pendências e metas), gráfico diário e últimos lançamentos.",
    },
    {
        Icon: Notepad,
        title: "Lançamentos",
        description:
            "Cadastre receitas e despesas com validações automáticas, filtros e paginação.",
    },
    {
        Icon: CurrencyDollar,
        title: "Fluxo de Caixa",
        description:
            "Gráfico de barras diário e tabela com saldo diário e saldo acumulado.",
    },
    {
        Icon: Target,
        title: "Metas",
        description:
            "Defina metas mensais de receita e despesa com barras de progresso visuais.",
    },
];

export default function Features() {
    return (
        <section id="recursos" className="features">
            <h2 className="section-title" data-aos="fade-up">
                Tudo que você precisa em um único sistema
            </h2>
            <p className="section-subtitle" data-aos="fade-up">
                Do lançamento diário à projeção estratégica, cobrindo todo o
                ciclo financeiro.
            </p>
            <div className="features-grid">
                {features.map(({ Icon, title, description }, i) => (
                    <div
                        key={title}
                        className="feature-card"
                        data-aos="zoom-in"
                        data-aos-delay={i * 100}
                    >
                        <div className="feature-icon">
                            <Icon size={32} weight="regular" />
                        </div>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
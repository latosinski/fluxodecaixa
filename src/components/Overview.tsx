import {
    Receipt,
    HandCoins,
    WarningCircle,
    TreeStructure,
    Printer,
    ChartLine,
    MagicWand,
    ChartBar,
} from "@phosphor-icons/react/dist/ssr";

const cards = [
    {
        Icon: Receipt,
        title: "Contas a Pagar",
        description:
            "Status Pendente, Vencida e Paga. Marcar como pago gera lançamento automático.",
        delay: 0,
    },
    {
        Icon: HandCoins,
        title: "Contas a Receber",
        description:
            "Controle valores a receber, inadimplência e baixa automática ao receber.",
        delay: 150,
    },
    {
        Icon: WarningCircle,
        title: "Valores em Aberto",
        description:
            "Total a pagar, a receber e saldo projetado com destaque para vencidos.",
        delay: 300,
    },
    {
        Icon: TreeStructure,
        title: "Plano de Contas",
        description:
            "Cadastro de categorias de receita e despesa que organiza todas as análises.",
        delay: 450,
    },
    {
        Icon: Printer,
        title: "Relatório para Impressão",
        description:
            "Exportação em PDF, Excel (.xlsx) e impressão otimizada em A4.",
        delay: 600,
    },
    {
        Icon: ChartLine,
        title: "Análise Financeira",
        description:
            "Evolução do caixa, comparativo ano a ano, consolidado anual e Top Categorias.",
        delay: 750,
    },
    {
        Icon: MagicWand,
        title: "Projeção Financeira",
        description:
            "Simule cenários futuros com base no histórico, horizonte e taxa de crescimento.",
        delay: 900,
    },
    {
        Icon: ChartBar,
        title: "DRE",
        description:
            "Demonstrativo de Resultado por categoria, com resultado líquido e participação percentual.",
        delay: 600,
    },
];

export default function Overview() {
    return (
        <section className="overview">
            <h2 className="section-title" data-aos="fade-up">
                Visão geral do sistema
            </h2>
            <p className="section-subtitle" data-aos="fade-up">
                Indicadores e recursos que realmente importam.
            </p>
            <div className="cards-container">
                {cards.map(({ Icon, title, description, delay }, i) => (
                    <div
                        key={`${title}-${i}`}
                        className="overview-card"
                        data-aos="fade-up"
                        data-aos-delay={delay}
                    >
                        <i className="overview-card-icon">
                            <Icon size={40} weight="regular" />
                        </i>
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
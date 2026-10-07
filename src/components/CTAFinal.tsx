import Link from "next/link";

export default function CTAFinal() {
    return (
        <section className="cta-final">
            <h2 data-aos="fade-up">
                Leve o controle total para a sua empresa
            </h2>
            <p data-aos="fade-up">
                Adquira agora e transforme sua gestão financeira.
            </p>
            <Link
                href="#preco"
                className="btn btn-primary"
                data-aos="zoom-in"
            >
                Ver Preço e Comprar
            </Link>
        </section>
    );
}
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Overview from "@/components/Overview";
import DemoPrice from "@/components/DemoPrice";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
    return (
        <>
            <Header />

            <main>
                <Hero />
                <Features />
                <Overview />
                <DemoPrice />
                <Testimonials />
                <Contact />
                <CTAFinal />
            </main>

            <Footer />

            <WhatsAppFloat />
        </>
    );
}
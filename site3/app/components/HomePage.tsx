import { About } from "./About";
import { BrandFeatures } from "./BrandFeatures";
import { Clients } from "./Clients";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Portfolio } from "./Portfolio";
import { WhyChooseUs } from "./WhyChooseUs";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        // Use a slight delay to ensure all elements are rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      {/* Header / Navbar */}
      <Header />
      {/* Hero Section */}
      <Hero id="home" />
      {/* About Us */}
      <About id="about" />
      {/* Why Choose Us */}
      <WhyChooseUs id="services" />
      {/* Brand New Features */}
      <BrandFeatures />
      {/* Portfolio */}
      <Portfolio id="work" />
      {/* Clients */}
      <Clients id="clients" />
      {/* Contact Section */}
      <Contact />
      {/* Footer */}
      <Footer />
    </>
  );
}

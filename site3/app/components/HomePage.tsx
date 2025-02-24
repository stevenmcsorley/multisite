// app/components/HomePage.tsx

import { About } from "./About";
import { BrandFeatures } from "./BrandFeatures";
import { Clients } from "./Clients";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Portfolio } from "./Portfolio";
import { WhyChooseUs } from "./WhyChooseUs";

export function HomePage() {
  return (
    <>
      {/* Header / Navbar */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* About Us */}
      <About />
      {/* Why Choose Us */}
      <WhyChooseUs />
      {/* Brand New Features */}
      <BrandFeatures />
      {/* Portfolio */}
      <Portfolio />
      {/* Clients */}
      <Clients />
      {/* Contact Section */}
      <Contact />
      {/* Footer */}
      <Footer />
    </>
  );
}

import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import DecalVisualizer3D from "../components/DecalVisualizer3D";
import { MaterialSection } from "../components/MaterialSection";
import { CustomStickerSection } from "../components/CustomStickerSection";
import { GallerySection } from "../components/GallerySection";
import { WorkflowSection } from "../components/WorkflowSection";
import { ConsultationSection } from "../components/ConsultationSection";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FE] dark:bg-[#0B0914] text-slate-900 dark:text-[#F4F3FA] transition-colors duration-300">
      {/* Floating Glassmorphism Navbar with Peeling Sticker Logo & Theme Switcher */}
      <Navbar />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* Hero Section with Headline, Badge, and 2 CTAs */}
        <HeroSection />

        {/* 3D Decal Visualizer Section dengan Model Asli BYD Seal .GLB */}
        <section id="3d-studio">
          <DecalVisualizer3D />
        </section>

        {/* Material Specification Showcase (No Pricing) */}
        <MaterialSection />

        {/* Custom Decal & Die-Cut Services */}
        <CustomStickerSection />

        {/* Gallery of Automotive Transformations */}
        <GallerySection />

        {/* Workflow & Cara Order Step-by-Step */}
        <WorkflowSection />

        {/* Interactive Consultation & Studio Location */}
        <ConsultationSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

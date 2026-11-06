"use client";

import { RacingNavbar } from "../components/RacingNavbar";
import HomeMaterialSection from "../components/material-motion/HomeMaterialSection";
import "./home-material.css";
import { GallerySection } from "../components/GallerySection";
import { CustomStickerSection } from "../components/CustomStickerSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { ConsultationSection } from "../components/ConsultationSection";
import { Footer } from "../components/Footer";
import { MotionObserver } from "../components/ScrollStage";
import { PortfolioHandoff } from "../components/PortfolioHandoff";
import { PerfectApplyHero } from "../components/experience/PerfectApplyHero";
import { SectionTransitions } from "../components/experience/SectionTransitions";
import { MaterialCurtain } from "../components/MaterialCurtain";
import { MotorStudio } from "../components/experience/MotorStudio";
import { GentleScroll } from "../components/GentleScroll";

export default function Home() {
  return <div className="atelier-site apply-home">
    <GentleScroll/>
    <MotionObserver/>
    <SectionTransitions/>
    <a className="atelier-skip" href="#main">Lewati ke konten</a>
    <RacingNavbar/>
    <main id="main">
      <PerfectApplyHero typography="11"/>
      <MaterialCurtain studio={<MotorStudio/>}><HomeMaterialSection/></MaterialCurtain>
      <CustomStickerSection/>
      <PortfolioHandoff>
        <GallerySection/>
        <WorkflowSection/>
      </PortfolioHandoff>
      <ConsultationSection/>
    </main>
    <Footer/>
  </div>;
}

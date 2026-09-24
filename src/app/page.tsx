import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import DotGrid from "@/components/DotGrid";
import ScrollDraw from "@/components/ScrollDraw";
import MorphLab from "@/components/MorphLab";
import MotionPath from "@/components/MotionPath";
import DragBox from "@/components/DragBox";
import TextFx from "@/components/TextFx";
import Easings from "@/components/Easings";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <DotGrid />
        <ScrollDraw />
        <MorphLab />
        <MotionPath />
        <DragBox />
        <TextFx />
        <Easings />
      </main>
      <Footer />
    </>
  );
}

import Nav from "@/components/Nav";
import Backdrop from "@/components/Backdrop";
import Hero from "@/components/Hero";
import Camera from "@/components/Camera";
import Ticker from "@/components/Ticker";
import ApiDemo from "@/components/ApiDemo";
import Transforms from "@/components/Transforms";
import ScrollDraw from "@/components/ScrollDraw";
import DotGrid from "@/components/DotGrid";
import MorphLab from "@/components/MorphLab";
import MotionPath from "@/components/MotionPath";
import DragBox from "@/components/DragBox";
import Clockwork from "@/components/Clockwork";
import Easings from "@/components/Easings";
import Footer from "@/components/Footer";
import Scrubber from "@/components/Scrubber";

export default function Home() {
  return (
    <>
      <Nav />
      <Backdrop />
      <main className="relative">
        <Hero />
        <Camera />
        <Ticker />
        <ApiDemo />
        <Transforms />
        <ScrollDraw />
        <DotGrid />
        <MorphLab />
        <MotionPath />
        <DragBox />
        <Clockwork />
        <Easings />
      </main>
      <Footer />
      <Scrubber />
    </>
  );
}

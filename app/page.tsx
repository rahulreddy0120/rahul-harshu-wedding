import GlobalNav from "./components/GlobalNav";
import EnvelopeIntro from "./components/EnvelopeIntro";
import MusicPlayer from "./components/MusicPlayer";
import AutoScroll from "./components/AutoScroll";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import EventsSection from "./components/EventsSection";
import DressCodeSection from "./components/DressCodeSection";
import RSVPSection from "./components/RSVPSection";
import GallerySection from "./components/GallerySection";
import RegistrySection from "./components/RegistrySection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <EnvelopeIntro />
      <MusicPlayer />
      <AutoScroll />
      <GlobalNav />
      <HeroSection />
      <CountdownSection />
      <EventsSection />
      <DressCodeSection />
      <RSVPSection />
      <GallerySection />
      <RegistrySection />
      <Footer />
    </main>
  );
}

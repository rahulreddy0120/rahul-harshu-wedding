import GlobalNav from "./components/GlobalNav";
import EnvelopeIntro from "./components/EnvelopeIntro";
import HeroSection from "./components/HeroSection";
import CountdownSection from "./components/CountdownSection";
import EventsSection from "./components/EventsSection";
import VenueSection from "./components/VenueSection";
import TravelSection from "./components/TravelSection";
import DressCodeSection from "./components/DressCodeSection";
import RSVPSection from "./components/RSVPSection";
import GallerySection from "./components/GallerySection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <EnvelopeIntro />
      <GlobalNav />
      <HeroSection />
      <CountdownSection />
      <EventsSection />
      <VenueSection />
      <TravelSection />
      <DressCodeSection />
      <RSVPSection />
      <GallerySection />
      <Footer />
    </main>
  );
}

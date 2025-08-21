import AudienceBenefits from "@/components/AudienceBenefits";
import Candidate from "@/components/Candidate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SeatReservation from "@/components/SeatReservation";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <div className="to-secondary scroll-mt-20 bg-gradient-to-b from-[#4e131b]">
        <Candidate />
        <AudienceBenefits />
        <SeatReservation />
      </div>
      <Footer />
    </>
  );
}

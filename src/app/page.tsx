"use client";

import AudienceBenefits from "@/components/AudienceBenefits";
import BookingStatusBanner from "@/components/BookingStatusBanner";
import Candidate from "@/components/Candidate";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import { QueueScreen } from "@/components/QueueScreen";
import SeatReservation from "@/components/SeatReservation";
import { useQueueStatus } from "@/hooks/useQueueStatus";

export default function Home() {
  const { loading, isInQueue } = useQueueStatus();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#f88134] border-t-transparent" />
      </div>
    );
  }

  if (isInQueue) {
    return <QueueScreen />;
  }

  return (
    <>
      <Header />
      <BookingStatusBanner />
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

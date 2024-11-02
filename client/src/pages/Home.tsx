import Cta from "@/components/Home/Cta";
import Features from "@/components/Home/Features";
import Feedback from "@/components/Home/Feedback";
import Footer from "@/components/Home/Footer";
import Hero from "@/components/Home/Hero";
import Service from "@/components/Home/Service";

export default function Home() {
  return (
    <div className="max-w-full overflow-hidden relative min-h-full flex flex-col gap-14 md:px-4">
      <Hero />
      <Cta />
      <Features />
      <Service />
      <Feedback />
      <Footer />
    </div>
  );
}

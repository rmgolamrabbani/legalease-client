import Hero from "../components/Hero";
import FeaturedLawyers from "../components/FeaturedLawyers";
import TopExpertsAndCategories from "../components/WhyChooseUs";
import CallToActionBanner from "../components/CallToActionBanner";
import Reviews from "../components/Reviews";
export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedLawyers />
      <TopExpertsAndCategories /> 
      <CallToActionBanner />
      <Reviews />
    </div>
  );
}

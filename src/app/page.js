import Hero from "../components/Hero";
import FeaturedLawyers from "../components/FeaturedLawyers";
import TopExpertsAndCategories from "../components/TopExpertsAndCategories";
import CallToActionBanner from "../components/CallToActionBanner";
export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedLawyers />
      <TopExpertsAndCategories />
      <CallToActionBanner />
    </div>
  );
}

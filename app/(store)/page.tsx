"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { TrustMetrics } from "@/components/home/TrustMetrics";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { CustomBuildCTA } from "@/components/home/CustomBuildCTA";
import { BusinessSolutions } from "@/components/home/BusinessSolutions";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { TestimonialSlider } from "@/components/home/TestimonialSlider";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustMetrics />
      <BrandMarquee />
      <CategoryShowcase />
      <FeaturedProducts />
      <CustomBuildCTA />
      <BusinessSolutions />
      <WhyChooseUs />
      <ServicesGrid />
      <TestimonialSlider />
      <NewsletterCTA />
    </>
  );
}

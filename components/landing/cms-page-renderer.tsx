"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { type CMSSection, useCMS } from "@/hooks/use-cms"
import HeroSection from "@/components/landing/hero-section"
import BenefitsSection from "@/components/landing/benefits-section"
import TestimonialsSection from "@/components/landing/testimonials-section"
import Pricing from "@/components/pricing"
import ContactSection from "@/components/landing/contact-section"
import CTASection from "@/components/landing/cta-section"
import ImageTextSection from "@/components/landing/image-text-section"
import VideoSection from "@/components/landing/video-section"
import FAQSection from "@/components/landing/faq-section"
import TextBannerSection from "@/components/landing/text-banner-section"
import GallerySection from "@/components/landing/gallery-section"
import StatsSection from "@/components/landing/stats-section"
import CustomCodeSection from "@/components/landing/custom-code-section"
import PageHeroSection from "@/components/landing/page-hero-section"
import FeatureCardsSection from "@/components/landing/feature-cards-section"
import DynamicFeedSection from "@/components/landing/dynamic-feed-section"
import FormBuilderSection from "@/components/landing/form-builder-section"
import RichTextSection from "@/components/landing/rich-text-section"
import LogoStripSection from "@/components/landing/logo-strip-section"
import SpacerSection from "@/components/landing/spacer-section"
import EmbedSection from "@/components/landing/embed-section"
import LandingPopupHost from "@/components/landing/landing-popup-host"
import {
  getSectionVisibilityClass,
  resolveLandingBuilderItems,
  shouldHideSectionWhenEmpty,
  shouldRenderSectionForAudience,
  useLandingBuilderData,
} from "@/hooks/use-landing-builder-data"
import { getLandingSectionDomId, useLandingActions } from "@/hooks/use-landing-actions"

const BG_CLASSES: Record<string, string> = {
  transparent: "",
  dark:        "bg-card/30",
  darkDeep:    "bg-card",
  accent:      "bg-primary/5 border-y border-primary/10",
}

const PAD_CLASSES: Record<string, string> = {
  none: "[&>section]:!py-0",
  sm:   "[&>section]:!py-8",
  md:   "[&>section]:!py-16",
  lg:   "[&>section]:!py-28",
}

function SectionWrapper({
  section,
  className,
  children,
}: {
  section: CMSSection
  className?: string
  children: React.ReactNode
}) {
  const bg       = BG_CLASSES[section.style?.bg ?? "transparent"] ?? ""
  const pad      = section.style?.padding ? PAD_CLASSES[section.style.padding] ?? "" : ""
  const customBg = section.style?.bg && !BG_CLASSES[section.style.bg]
    ? { backgroundColor: section.style.bg } : undefined
  return <div className={cn(bg, pad, className)} style={customBg}>{children}</div>
}

interface CmsPageRendererProps {
  slug: string
  onGetStarted?: () => void
  onWatchDemo?: () => void
  isAuthenticated?: boolean
}

export default function CmsPageRenderer({
  slug,
  onGetStarted,
  onWatchDemo,
  isAuthenticated = false,
}: CmsPageRendererProps) {
  const [sections, setSections] = useState<CMSSection[]>([])
  const { config } = useCMS()
  const datasets = useLandingBuilderData()
  const { activePopup, closePopup, executeAction, pendingPopupSubmitAction } = useLandingActions(config)

  useEffect(() => {
    const page   = config.pages?.find(p => p.slug === slug)
    setSections(page?.sections ?? [])
  }, [config, slug])

  const runSectionAction = (action?: Record<string, any>, fallbackHref?: string) => {
    executeAction(action, fallbackHref)
  }

  const renderSection = (section: CMSSection) => {
    if (!section.visible || !shouldRenderSectionForAudience(section, isAuthenticated)) return null

    const visibilityClass = getSectionVisibilityClass(section)
    const wrap = (content: React.ReactNode) => (
      <SectionWrapper key={section.id} section={section} className={visibilityClass}>
        <div id={getLandingSectionDomId(section.id)}>{content}</div>
      </SectionWrapper>
    )

    if (section.type === "simulatorsFeed" || section.type === "coursesFeed" || section.type === "evaluationsFeed") {
      const items = resolveLandingBuilderItems(section, datasets)
      if (!items.length && shouldHideSectionWhenEmpty(section)) return null
      return wrap(
        <DynamicFeedSection
          section={section}
          items={items}
          onCtaAction={() => runSectionAction(section.data?.ctaAction, section.data?.ctaHref)}
        />
      )
    }

    switch (section.type) {
      case "hero":         return wrap(<HeroSection onGetStarted={onGetStarted} onWatchDemo={onWatchDemo} />)
      case "benefits":     return wrap(<BenefitsSection />)
      case "testimonials": return wrap(<TestimonialsSection />)
      case "pricing":      return wrap(<Pricing />)
      case "contact":      return wrap(<ContactSection />)
      case "pageHero":     return wrap(<PageHeroSection data={section.data} onGetStarted={() => runSectionAction(section.data?.primaryAction, section.data?.ctaHref)} onWatchDemo={() => runSectionAction(section.data?.secondaryAction, section.data?.ctaSecHref)} />)
      case "featureCards": return wrap(<FeatureCardsSection data={section.data} />)
      case "richText":     return wrap(<RichTextSection data={section.data} onPrimaryAction={() => runSectionAction(section.data?.primaryAction, section.data?.primaryHref)} onSecondaryAction={() => runSectionAction(section.data?.secondaryAction, section.data?.secondaryHref)} />)
      case "logoStrip":    return wrap(<LogoStripSection data={section.data} />)
      case "spacer":       return wrap(<SpacerSection data={section.data} />)
      case "embed":        return wrap(<EmbedSection data={section.data} />)
      case "cta":          return wrap(<CTASection data={section.data} onPrimaryAction={() => runSectionAction(section.data?.primaryAction, section.data?.ctaPrimarioHref)} onSecondaryAction={() => runSectionAction(section.data?.secondaryAction, section.data?.ctaSecundarioHref)} />)
      case "imageText":    return wrap(<ImageTextSection data={section.data} onCtaAction={() => runSectionAction(section.data?.ctaAction, section.data?.ctaHref)} />)
      case "video":        return wrap(<VideoSection data={section.data} />)
      case "faq":          return wrap(<FAQSection data={section.data} />)
      case "textBanner":   return wrap(<TextBannerSection data={section.data} onCtaAction={() => runSectionAction(section.data?.ctaAction, section.data?.ctaHref)} />)
      case "gallery":      return wrap(<GallerySection data={section.data} />)
      case "stats":        return wrap(<StatsSection data={section.data} />)
      case "customCode":   return wrap(<CustomCodeSection data={section.data} onAction={(action, fallbackHref) => runSectionAction(action, fallbackHref)} />)
      case "formBuilder":  return wrap(<FormBuilderSection data={section.data} onSubmitAction={() => runSectionAction(section.data?.submitAction)} />)
      default:             return null
    }
  }

  return (
    <>
      {sections.map(renderSection)}
      <LandingPopupHost popup={activePopup} onClose={closePopup} onAction={executeAction} fallbackSubmitAction={pendingPopupSubmitAction} />
    </>
  )
}

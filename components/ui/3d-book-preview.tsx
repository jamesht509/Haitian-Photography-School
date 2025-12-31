"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// DATA STRUCTURE - 5 Book Pages
// ============================================
const bookPages = [
  {
    id: 1,
    title: "Fè Foto Fanm",
    subtitle: "Poz ak Kadraj",
    description:
      "Aprann teknik pou fè modèl fi santi yo alèz epi parèt bèl nan foto a. Dekouvri enpòtans kou, zepòl, ak janm nan pozisyon an.",
    image: "/images/page1-posing.jpg",
  },
  {
    id: 2,
    title: "Metrize Istoryam nan",
    subtitle: "Ekspozisyon Kòrèk",
    description:
      "Konprann kijan pou li istogram nan pou evite foto ki twò nwa (underexposed) oswa twò klere (overexposed). Jwenn balans pafè a.",
    image: "/images/page2-histogram.jpg",
  },
  {
    id: 3,
    title: "Mòd Kamera yo",
    subtitle: "Soti nan Auto rive Manual",
    description:
      "Sispann itilize mòd Auto! Aprann diferans ant Mòd Manyèl (M), Priyorite Ouverture (Av/A), ak Priyorite Vitès (Tv/S).",
    image: "/images/page3-modes.jpg",
  },
  {
    id: 4,
    title: "Kijan pou kenbe Kamera a",
    subtitle: "Estabilite Maksimòm",
    description:
      "Evite foto flou. Aprann bon fason pou kenbe kamera a, pozisyon kò w, ak teknik respirasyon pou foto ki pi klè.",
    image: "/images/page4-holding.jpg",
  },
  {
    id: 5,
    title: "Règ Pòtrè yo",
    subtitle: "Koupe ak Konpozisyon",
    description:
      "Aprann règ 'Rule of Thirds' la ak ki kote ou pa dwe janm koupe nan kò yon moun lè w ap fè pòtrè pou rezilta pwofesyonèl.",
    image: "/images/page5-portraits.jpg",
  },
];

// ============================================
// TYPES
// ============================================
interface BookPage {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

// ============================================
// 3D BOOK PREVIEW COMPONENT
// ============================================
export function Book3DPreview() {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev">("next");

  const handlePageChange = (index: number) => {
    setFlipDirection(index > activePageIndex ? "next" : "prev");
    setActivePageIndex(index);
  };

  const activePage = bookPages[activePageIndex];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, #D4AF37 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4">
            <span className="text-white">Gade yon </span>
            <span className="text-[#D4AF37]">previzyon</span>
            <span className="text-white"> liv fotografi an</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Men 5 paj esklizif ou ka li kounye a.
          </p>
        </div>

        {/* Split View Container */}
        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Left: Index / Chapter List */}
          <IndexPanel
            pages={bookPages}
            activeIndex={activePageIndex}
            onPageSelect={handlePageChange}
          />

          {/* Right: 3D Book Content */}
          <BookContent
            page={activePage}
            direction={flipDirection}
            pageNumber={activePageIndex + 1}
            totalPages={bookPages.length}
          />
        </div>

        {/* CTA Below */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">Ou vle wè tout liv la?</p>
          <button className="bg-gradient-to-r from-[#D4AF37] via-[#E6B800] to-[#B8860B] text-[#050505] font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Enskri pou jwenn aksè konplè
          </button>
        </div>
      </div>
    </section>
  );
}

// ============================================
// INDEX PANEL COMPONENT
// ============================================
interface IndexPanelProps {
  pages: BookPage[];
  activeIndex: number;
  onPageSelect: (index: number) => void;
}

function IndexPanel({ pages, activeIndex, onPageSelect }: IndexPanelProps) {
  return (
    <div className="relative">
      {/* Glassmorphism Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-8">
        {/* Index Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#050505]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Tablo Konteni</h3>
            <p className="text-gray-500 text-sm">5 Chapit Esansyèl</p>
          </div>
        </div>

        {/* Chapter List */}
        <nav className="space-y-2">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => onPageSelect(index)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                activeIndex === index
                  ? "bg-[#D4AF37]/20 border border-[#D4AF37]/50"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Chapter Number */}
                <span
                  className={`text-2xl font-serif font-bold transition-colors ${
                    activeIndex === index
                      ? "text-[#D4AF37]"
                      : "text-gray-600 group-hover:text-gray-400"
                  }`}
                >
                  {String(page.id).padStart(2, "0")}
                </span>

                {/* Chapter Info */}
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold transition-colors truncate ${
                      activeIndex === index
                        ? "text-[#D4AF37]"
                        : "text-white group-hover:text-gray-200"
                    }`}
                  >
                    {page.title}
                  </h4>
                  <p className="text-gray-500 text-sm truncate">
                    {page.subtitle}
                  </p>
                </div>

                {/* Active Indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="w-2 h-2 rounded-full bg-[#D4AF37] mt-2"
                  />
                )}
              </div>
            </button>
          ))}
        </nav>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Pwogrè</span>
            <span>
              {activeIndex + 1} / {pages.length}
            </span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E6B800] rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((activeIndex + 1) / pages.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// BOOK CONTENT COMPONENT (3D Flip)
// ============================================
interface BookContentProps {
  page: BookPage;
  direction: "next" | "prev";
  pageNumber: number;
  totalPages: number;
}

function BookContent({
  page,
  direction,
  pageNumber,
  totalPages,
}: BookContentProps) {
  // 3D Page Flip Animation Variants
  const pageVariants = {
    enter: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: "next" | "prev") => ({
      rotateY: dir === "next" ? -90 : 90,
      opacity: 0,
      scale: 0.9,
    }),
  };

  return (
    <div className="relative" style={{ perspective: "1500px" }}>
      {/* Glassmorphism Book Container */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              rotateY: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
            }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <div className="grid md:grid-cols-2">
              {/* Left: Image */}
              <div className="relative aspect-[3/4] md:aspect-auto md:h-[500px] overflow-hidden">
                <img
                  src={page.image}
                  alt={page.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://placehold.co/600x800/1a1a1a/D4AF37?text=${encodeURIComponent(
                      page.title
                    )}`;
                  }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent md:bg-gradient-to-r" />

                {/* Page Number Badge */}
                <div className="absolute top-6 left-6">
                  <div className="bg-[#D4AF37] text-[#050505] font-bold px-4 py-2 rounded-lg text-sm">
                    Paj {pageNumber} / {totalPages}
                  </div>
                </div>
              </div>

              {/* Right: Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* Chapter Number */}
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-6xl md:text-8xl font-serif font-bold bg-gradient-to-br from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-4"
                >
                  {String(page.id).padStart(2, "0")}
                </motion.span>

                {/* Title */}
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-serif font-bold text-white mb-2"
                >
                  {page.title}
                </motion.h3>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#D4AF37] font-medium mb-6"
                >
                  {page.subtitle}
                </motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-16 h-0.5 bg-gradient-to-r from-[#D4AF37] to-transparent mb-6 origin-left"
                />

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-300 leading-relaxed mb-8"
                >
                  {page.description}
                </motion.p>

                {/* Read More Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button className="inline-flex items-center gap-2 text-[#D4AF37] font-medium group">
                    <span>Li plis</span>
                    <svg
                      className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={() => pageNumber > 1}
            className={`pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#050505] transition-all ${
              pageNumber === 1 ? "opacity-30 cursor-not-allowed" : ""
            }`}
            disabled={pageNumber === 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={() => pageNumber < totalPages}
            className={`pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#050505] transition-all ${
              pageNumber === totalPages ? "opacity-30 cursor-not-allowed" : ""
            }`}
            disabled={pageNumber === totalPages}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl" />
      <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D4AF37]/5 rounded-full blur-2xl" />
    </div>
  );
}

export default Book3DPreview;


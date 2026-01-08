"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function Carousel() {
  const images = [
    "/images/certificate-1.png",
    "/images/certificate-2.png",
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary uppercase tracking-wide">Natijalar</h2>
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-2xl border bg-card">
          <div
            className="flex transition-transform duration-700 ease-in-out h-[300px] sm:h-[400px] md:h-[500px]"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={index} className="relative w-full h-full flex-shrink-0">
                <Image
                  src={src}
                  alt={`Certificate ${index + 1}`}
                  fill
                  className="object-contain p-4"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? "bg-primary w-6" : "bg-primary/30"
                  }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

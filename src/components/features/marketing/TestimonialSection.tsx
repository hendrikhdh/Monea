import { Quote } from 'lucide-react'

export function TestimonialSection() {
  return (
    <section className="w-full py-12 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-12 lg:px-20">
        <div className="relative overflow-hidden rounded-[3rem_1rem_4rem_2rem] bg-secondary-container p-10 text-center md:p-20">
        <Quote
          size={64}
          className="absolute left-8 top-8 rotate-180 text-primary/10 md:left-10 md:top-10"
        />
        <p className="relative z-10 mb-8 font-display text-2xl italic leading-relaxed text-secondary-foreground md:text-4xl">
          &ldquo;Endlich eine Finanz-App, die sich so hochwertig anfühlt wie der
          Rest meines Lebens.&rdquo;
        </p>
          <p className="relative z-10 text-[10px] font-bold uppercase tracking-[0.25em] text-on-secondary-container">
            Lena, 28 — Berlin
          </p>
        </div>
      </div>
    </section>
  )
}

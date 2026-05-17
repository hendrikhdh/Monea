import { Eye, ArrowLeftRight, Image as ImageIcon, PieChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Feature {
  title: string
  description: string
  Icon: LucideIcon
  cardClass: string
  blobStyle: { background: string; borderRadius: string }
}

const features: Feature[] = [
  {
    title: 'Alles im Blick',
    description:
      'Ein ruhiges Dashboard, das dir genau zeigt, was du wissen musst. Keine blinkenden roten Zahlen, nur klare Fakten.',
    Icon: Eye,
    cardClass: 'rounded-[2rem_1rem_2.5rem_1.5rem]',
    blobStyle: {
      background: '#f5c4b8',
      borderRadius: '70% 42% 50% 50%/42% 65% 42% 65%',
    },
  },
  {
    title: 'Drei Transaktions-Typen',
    description:
      'Einnahmen, Ausgaben und Spareinlagen. Spareinlagen sind balance-neutral und füttern automatisch deine Ziele.',
    Icon: ArrowLeftRight,
    cardClass: 'rounded-[1.5rem_2.5rem_1rem_2rem]',
    blobStyle: {
      background: '#d4a49a',
      borderRadius: '42% 70% 65% 42%/60% 42% 70% 40%',
    },
  },
  {
    title: 'Sparziele mit Bild',
    description:
      'Hinterlege editoriale Fotos für deine Ziele. Sparen für Paris fühlt sich besser an, wenn man Paris sieht.',
    Icon: ImageIcon,
    cardClass: 'rounded-[1.5rem_2.5rem_1rem_2rem]',
    blobStyle: {
      background: '#c9a69e',
      borderRadius: '55% 45% 40% 70%/70% 40% 55% 45%',
    },
  },
  {
    title: 'Analyse, die wirklich hilft',
    description:
      'Period-Filter, Kategorie-Trends, Top-Donut. Sanft präsentierte Einblicke — wir urteilen nicht, wir zeigen Wege auf.',
    Icon: PieChart,
    cardClass: 'rounded-[2rem_1rem_2.5rem_1.5rem]',
    blobStyle: {
      background: '#f5c4b8',
      borderRadius: '65% 42% 70% 40%/40% 70% 42% 60%',
    },
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 lg:px-20">
        <div className="mb-12 md:mb-16">
          <p className="mb-4 font-sans text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant">
            Features
          </p>
          <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-foreground md:text-[40px] md:leading-[1.1]">
            Was Monéa kann
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {features.map(({ title, description, Icon, cardClass, blobStyle }) => (
            <div
              key={title}
              className={`${cardClass} bg-card p-8 transition-colors duration-300 hover:bg-surface-container-high md:p-10`}
            >
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center"
                style={blobStyle}
              >
                <Icon size={20} className="text-foreground" />
              </div>
              <h3 className="mb-3 font-heading text-xl font-bold text-foreground">
                {title}
              </h3>
              <p className="font-sans text-base leading-relaxed text-on-surface-variant">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

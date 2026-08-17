import { SectionHeading } from '@/components/ui/SectionHeading'
import { GoldCalculator } from './GoldCalculator'

export function GoldCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <SectionHeading
        eyebrow="Tools"
        title="Gold Calculator"
        description="Convert Rucoy gold into real-world currency using Leblanc's trade rates."
      />
      <div className="mt-10">
        <GoldCalculator />
      </div>
    </div>
  )
}

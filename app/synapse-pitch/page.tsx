'use client'

import SlideCover from '../../components/pitch/SlideCover'
import SlideProblem from '../../components/pitch/SlideProblem'
import SlideSolution from '../../components/pitch/SlideSolution'
import SlideFeatures from '../../components/pitch/SlideFeatures'
import SlideUIUX from '../../components/pitch/SlideUIUX'
import SlideArchitecture from '../../components/pitch/SlideArchitecture'
import SlideRLS from '../../components/pitch/SlideRLS'
import SlideInterop from '../../components/pitch/SlideInterop'
import SlideBeforeAfter from '../../components/pitch/SlideBeforeAfter'
import SlideROI from '../../components/pitch/SlideROI'
import SlideClosing from '../../components/pitch/SlideClosing'
import SlideSecurityRLS from '@/components/pitch/SlideSecurityRLS'
import SlideInteroperability from '@/components/pitch/SlideInteroperability'
import SlideCostROI from '@/components/pitch/SlideCostROI'
import SlideCierre from '@/components/pitch/SlideCierre'

export default function SynapsePage() {
  return (
    <main className="bg-[#060B19] text-white">

      <SlideCover />
      <SlideProblem />
      <SlideSolution />
      <SlideFeatures />
      <SlideArchitecture />
      <SlideSecurityRLS />
      <SlideInteroperability />
      <SlideCostROI />
      <SlideCierre />

    </main>
  )
}
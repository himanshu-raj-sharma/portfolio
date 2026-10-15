import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { Education } from '@/components/sections/Education';
import { Process } from '@/components/sections/Process';
import { FAQ } from '@/components/sections/FAQ';
import { Contact } from '@/components/sections/Contact';
import { TechMarquee } from '@/components/sections/TechMarquee';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <About />
      <Services />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Process />
      <FAQ />
      <Contact />
    </>
  );
}
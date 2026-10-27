import { Container } from '@/components/ui/Container';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ContactForm } from './ContactForm';

export function Contact() {
  return (
    <Section id="contact" density="loose">
      <Container size="lg">
        <SectionHeading
          number="09"
          caption="Contact"
          title={
            <>
              Let&apos;s build
              <br />
              <span className="bg-[linear-gradient(120deg,var(--accent-2),var(--accent-1))] bg-clip-text text-transparent">
                something.
              </span>
            </>
          }
          description="Reply within 24 hours. Share as much or as little as you like — I&apos;ll follow up with the right questions."
        />

        <div className="mt-block-y">
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
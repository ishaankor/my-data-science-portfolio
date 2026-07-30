import ContactSection from '@/components/contact/ContactSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Ishaan Koradia - AI Engineer',
  description: 'Get in touch with Ishaan Koradia for AI engineering, Machine Learning, and web automation opportunities.',
};

export default function ContactPage() {
  return (
    <div className="pt-8">
      <ContactSection />
    </div>
  );
}

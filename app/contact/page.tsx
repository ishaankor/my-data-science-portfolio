import ContactSection from '@/components/contact/ContactSection';

export const metadata = {
  title: 'Contact | Ishaan Koradia Data Science Portfolio',
  description: 'Get in touch with Ishaan Koradia for data science projects, analytics consulting, machine learning collaboration, or full-stack software development.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <ContactSection />
    </div>
  );
}

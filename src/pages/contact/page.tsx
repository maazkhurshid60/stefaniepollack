import PageHero from "@/components/feature/PageHero";
import ContactInfo from "./components/ContactInfo";
import ContactForm from "./components/ContactForm";

export default function Contact() {
  return (
    <div className="w-full">
      <PageHero
        eyebrow="Contact"
        title="Let's Find Your"
        italicTitle="Next Chapter"
        image="/images/stefanie/lifestyle-6.jpg"
        imageAlt="Contact Stefanie Pollack"
      />

      <section className="w-full bg-background-50 py-20 md:py-28 lg:py-36">
        <div className="w-full px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 max-w-6xl mx-auto items-start">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

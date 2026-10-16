import { useState } from 'react';
import { useContactForm } from '../../hooks/useData';
import { ArrowUpRight, Loader2, Check } from 'lucide-react';

export function Contact() {
  const { submitContact, isSubmitting, submitSuccess, error, resetSuccess } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = 'Invalid email address';
    if (!formData.subject.trim()) errors.subject = 'Subject is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    else if (formData.message.trim().length < 10)
      errors.message = 'Must be at least 10 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await submitContact(formData);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      // Error handled by hook
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-band border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-16 pb-6 border-b border-line gap-4">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-accent">05</span>
            <h2 className="section-title">Contact</h2>
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            05 / Direct Inquiry
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Oversized direct email link */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
                Primary Contact
              </p>

              <a
                href="mailto:pheaktrachen141@gmail.com"
                className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink hover:text-accent font-normal break-all transition-colors duration-150 inline-flex items-baseline gap-2 mb-8 group"
              >
                <span className="group-hover:underline decoration-accent underline-offset-4">
                  pheaktrachen141@gmail.com
                </span>
                <ArrowUpRight className="w-5 h-5 shrink-0 translate-y-1 text-accent" />
              </a>

              <p className="text-ink/80 text-base leading-relaxed mb-8 font-light max-w-[50ch]">
                Available for internships, freelance design engagements, and web engineering opportunities. Based in Phnom Penh (UTC+7).
              </p>
            </div>

            <div className="border-t border-line pt-6 font-mono text-xs text-muted space-y-3">
              <div>
                <span className="text-muted/80 uppercase tracking-wider block mb-1">
                  Location
                </span>
                <span className="text-ink">Phnom Penh, Cambodia</span>
              </div>
              <div className="pt-2">
                <span className="text-muted/80 uppercase tracking-wider block mb-1">
                  Profiles
                </span>
                <div className="flex gap-4">
                  <a
                    href="https://github.com/PHeaktraaa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent flex items-center gap-1"
                  >
                    GitHub <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sopheaktrachin-23103a393/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-accent flex items-center gap-1"
                  >
                    LinkedIn <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Underlined Input Form (accent underline on focus) */}
          <div className="lg:col-span-7">
            {submitSuccess ? (
              <div className="border border-line bg-surface p-8 sm:p-12 text-ink">
                <div className="flex items-center gap-2 font-mono text-xs text-accent uppercase tracking-wider mb-4">
                  <Check className="w-4 h-4" /> Received
                </div>
                <h3 className="font-serif text-3xl font-normal text-ink mb-4">
                  Message delivered.
                </h3>
                <p className="text-muted text-base leading-relaxed mb-8 font-light">
                  Thank you for reaching out. Your note has been stored in the database and forwarded to my email. I will reply to you shortly.
                </p>
                <button onClick={resetSuccess} className="btn-secondary">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name field */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Jane Doe"
                      className={`w-full bg-transparent border-b ${
                        validationErrors.name
                          ? 'border-red-500'
                          : 'border-line focus:border-accent'
                      } py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none transition-colors rounded-none`}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 font-mono text-xs text-red-500">
                        {validationErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jane@example.com"
                      className={`w-full bg-transparent border-b ${
                        validationErrors.email
                          ? 'border-red-500'
                          : 'border-line focus:border-accent'
                      } py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none transition-colors rounded-none`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 font-mono text-xs text-red-500">
                        {validationErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    placeholder="Project Inquiry / Job Opportunity"
                    className={`w-full bg-transparent border-b ${
                      validationErrors.subject
                        ? 'border-red-500'
                        : 'border-line focus:border-accent'
                    } py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none transition-colors rounded-none`}
                  />
                  {validationErrors.subject && (
                    <p className="mt-1 font-mono text-xs text-red-500">
                      {validationErrors.subject}
                    </p>
                  )}
                </div>

                {/* Message field */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Describe your project, timeline, or inquiry..."
                    className={`w-full bg-transparent border-b ${
                      validationErrors.message
                        ? 'border-red-500'
                        : 'border-line focus:border-accent'
                    } py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none transition-colors rounded-none resize-none`}
                  />
                  {validationErrors.message && (
                    <p className="mt-1 font-mono text-xs text-red-500">
                      {validationErrors.message}
                    </p>
                  )}
                </div>

                {error && (
                  <p className="font-mono text-xs text-red-600 dark:text-red-400 border border-red-500/30 p-3 bg-surface">
                    {error}
                  </p>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1" /> Transmitting...
                      </>
                    ) : (
                      'Transmit message'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
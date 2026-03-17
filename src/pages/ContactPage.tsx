import React, { useState, useId } from 'react';
import PageContent from '../components/PageContent.tsx';
import Button from '../components/Button.tsx';
import { useTheme } from '../hooks/useTheme.ts';


interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface ContactMethod {
  icon: string;
  label: string;
  value: string;
  href: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ContactMethodCardProps {
  icon: string;
  label: string;
  value: string;
  href: string;
  textClass: string;
  cardClass: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
  textClass: string;
  cardClass: string;
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor: string;
  textClass: string;
}


const CONTACT_METHODS: ContactMethod[] = [
  {
    icon: '✉️',
    label: 'Email',
    value: 'info@plantparadise.com',
    href: 'mailto:info@plantparadise.com',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 9812111111',
    href: 'tel:+919812111111',
  },
  {
    icon: '📍',
    label: 'Address',
    value: 'Ahmedabad, Gujarat, India',
    href: 'https://maps.google.com/?q=Ahmedabad,Gujarat,India',
  },
  {
    icon: '🕐',
    label: 'Hours',
    value: 'Mon–Fri, 9 AM – 6 PM',
    href: '',
  },
];

const FAQS: FAQ[] = [
  {
    question: 'How long does shipping take?',
    answer: 'Most orders arrive within 3–5 business days. Express 2-day shipping is available at checkout.',
  },
  {
    question: 'What if my plant arrives damaged?',
    answer: 'We offer a 30-day plant guarantee. Send us a photo and we will replace or refund immediately.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Currently we ship within the US and Canada. International shipping is coming in 2026.',
  },
];

const SUBJECTS: string[] = [
  'Order Enquiry',
  'Plant Care Advice',
  'Returns & Refunds',
  'Wholesale',
  'Press & Partnerships',
  'Other',
];

const EMPTY_FORM: FormFields = {
  name: '',
  email: '',
  subject: '',
  message: '',
};


const ContactMethodCard: React.FC<ContactMethodCardProps> = (props) => {
  const icon = props.icon;
  const label = props.label;
  const value = props.value;
  const href = props.href;
  const textClass = props.textClass;
  const cardClass = props.cardClass;

  const isExternal = href.startsWith('http');
  const targetVal = isExternal ? '_blank' : undefined;
  const relVal = isExternal ? 'noopener noreferrer' : undefined;
  const hasHref = href.length > 0;

  const labelClass = 'text-xs font-medium opacity-50 mb-0.5 ' + textClass;
  const linkClass = 'text-sm font-medium break-all hover:underline focus-visible:outline-none focus-visible:ring-2 rounded ' + textClass;
  const textOnly = 'text-sm font-medium ' + textClass;
  const wrapClass = 'flex items-start gap-3 p-4 rounded-xl ' + cardClass;

  return (
    <div className={wrapClass}>
      <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
      <div className="min-w-0">
        <p className={labelClass}>{label}</p>
        {hasHref ? (
          
            <a href={href}
            target={targetVal}
            rel={relVal}
            className={linkClass}
          >
            {value}
          </a>
        ) : (
          <p className={textOnly}>{value}</p>
        )}
      </div>
    </div>
  );
};

const FAQItem: React.FC<FAQItemProps> = (props) => {
  const question = props.question;
  const answer = props.answer;
  const textClass = props.textClass;
  const cardClass = props.cardClass;

  const [open, setOpen] = useState(false);
  const id = useId();

  const wrapClass = 'rounded-xl overflow-hidden ' + cardClass;
  const btnClass =
    'w-full flex items-center justify-between px-5 py-4 text-left ' +
    'text-sm font-medium transition-colors duration-150 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset ' +
    'hover:bg-white/10 ' + textClass;
  const iconClass = 'text-lg transition-transform duration-200 shrink-0 ml-4 ' + (open ? 'rotate-45' : '');
  const bodyClass = 'px-5 pb-4 text-sm leading-relaxed opacity-70 ' + textClass;

  return (
    <div className={wrapClass}>
      <button
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={btnClass}
      >
        <span>{question}</span>
        <span className={iconClass} aria-hidden="true">+</span>
      </button>
      {open && (
        <div
          id={id}
          role="region"
          aria-label={question}
          className={bodyClass}
        >
          {answer}
        </div>
      )}
    </div>
  );
};

const Field: React.FC<FieldProps> = (props) => {
  const label = props.label;
  const error = props.error;
  const required = props.required;
  const children = props.children;
  const htmlFor = props.htmlFor;
  const textClass = props.textClass;

  const labelClass = 'text-sm font-medium ' + textClass;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className={labelClass}>
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
};


function validate(fields: FormFields): Partial<FormFields> {
  const errors: Partial<FormFields> = {};
  if (!fields.name.trim()) {
    errors.name = 'Name is required.';
  }
  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!fields.subject) {
    errors.subject = 'Please select a subject.';
  }
  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
  } else if (fields.message.trim().length < 20) {
    errors.message = 'Message must be at least 20 characters.';
  }
  return errors;
}


const ContactPage: React.FC = () => {
  const { theme } = useTheme();
  const text = theme.colors.text;
  const cardBg = theme.colors.cardBg;
  const border = theme.colors.border || 'border-gray-300';
  const headingFont = theme.fonts && theme.fonts.heading ? theme.fonts.heading : '';

  const [fields, setFields] = useState<FormFields>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});

  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();

  const inputClass =
    'w-full px-3 py-2.5 rounded-lg text-sm border outline-none ' +
    'transition-colors duration-150 focus:ring-2 focus:ring-offset-1 ' +
    'placeholder:opacity-40 ' +
    cardBg + ' ' + text + ' ' + border;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setFields((f) => ({ ...f, [name]: value }));
    if (touched[name as keyof FormFields]) {
      const next = { ...fields, [name]: value };
      const errs = validate(next);
      setErrors((prev) => ({ ...prev, [name]: errs[name as keyof FormFields] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const name = e.target.name;
    setTouched((t) => ({ ...t, [name]: true }));
    const errs = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: errs[name as keyof FormFields] }));
  };

  const handleSubmit = async () => {
    const errs = validate(fields);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(errs).length > 0) return;
    setStatus('submitting');
    try {
      await new Promise((res) => setTimeout(res, 1500));
      setStatus('success');
      setFields(EMPTY_FORM);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const introClass = 'text-base leading-relaxed opacity-70 max-w-xl mb-10 ' + text;
  const formSectionClass = 'lg:col-span-2 rounded-2xl p-6 sm:p-8 ' + cardBg;
  const formHeadingClass = 'text-lg font-semibold mb-6 ' + text + ' ' + headingFont;
  const sideHeadingClass = 'text-lg font-semibold mb-2 ' + text + ' ' + headingFont;
  const faqHeadingClass = 'text-lg font-semibold mb-5 ' + text + ' ' + headingFont;
  const counterClass = 'text-xs opacity-40 text-right tabular-nums ' + text;
  const isSubmitting = status === 'submitting';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <PageContent title="Contact Us">

      <p className={introClass}>
        Have questions or need assistance? Our team typically responds within
        one business day. We would love to hear from you.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

        <section aria-labelledby="form-heading" className={formSectionClass}>
          <h2 id="form-heading" className={formHeadingClass}>
            Send a Message
          </h2>

          <div className="flex flex-col gap-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
                label="Full Name"
                htmlFor={nameId}
                required={true}
                error={errors.name}
                textClass={text}
              >
                <input
                  id={nameId}
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder=""
                  value={fields.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Email Address"
                htmlFor={emailId}
                required={true}
                error={errors.email}
                textClass={text}
              >
                <input
                  id={emailId}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder=""
                  value={fields.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field
              label="Subject"
              htmlFor={subjectId}
              required={true}
              error={errors.subject}
              textClass={text}
            >
              <select
                id={subjectId}
                name="subject"
                value={fields.subject}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass}
              >
                <option value="" disabled={true}>Select a subject…</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field
              label="Message"
              htmlFor={messageId}
              required={true}
              error={errors.message}
              textClass={text}
            >
              <textarea
                id={messageId}
                name="message"
                rows={5}
                placeholder="How can we help you today?"
                value={fields.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass + ' resize-none'}
              />
              <p className={counterClass}>
                {fields.message.length} / 1000
              </p>
            </Field>

            <div className="flex items-center gap-4 pt-1">
              <Button
                variant="solid"
                size="md"
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? 'Sending…' : 'Send Message'}
              </Button>

              {isSuccess && (
                <p role="status" className="text-sm text-green-500 flex items-center gap-1.5">
                  <span aria-hidden="true">✓</span>
                  Message sent — we will be in touch soon!
                </p>
              )}

              {isError && (
                <p role="alert" className="text-sm text-red-500 flex items-center gap-1.5">
                  <span aria-hidden="true">⚠</span>
                  Something went wrong. Please try again.
                </p>
              )}
            </div>

          </div>
        </section>

        <aside aria-label="Contact information" className="flex flex-col gap-3">
          <h2 className={sideHeadingClass}>Get in Touch</h2>
          {CONTACT_METHODS.map((m) => (
            <ContactMethodCard
              key={m.label}
              icon={m.icon}
              label={m.label}
              value={m.value}
              href={m.href}
              textClass={text}
              cardClass={cardBg}
            />
          ))}
        </aside>

      </div>

      <section aria-labelledby="faq-heading" className="mb-4">
        <h2 id="faq-heading" className={faqHeadingClass}>
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-3 max-w-2xl">
          {FAQS.map((faq) => (
            <FAQItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              textClass={text}
              cardClass={cardBg}
            />
          ))}
        </div>
      </section>

    </PageContent>
  );
};

export default ContactPage;
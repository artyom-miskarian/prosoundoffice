import { useState } from 'react'
import Button from './Button'
import { contact, web3formsKey } from '../config'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELDS = [
  { name: 'name', label: 'Full Name', placeholder: 'Your Full Name', required: true, type: 'text', autoComplete: 'name' },
  { name: 'country', label: 'Country', placeholder: 'Your Country', required: false, type: 'text', autoComplete: 'country-name' },
  { name: 'email', label: 'Email', placeholder: 'Your Email Address', required: true, type: 'email', autoComplete: 'email' },
  { name: 'subject', label: 'Subject', placeholder: 'Subject of Your Inquiry', required: false, type: 'text', autoComplete: 'off' },
  { name: 'phone', label: 'Phone', placeholder: 'Your Phone Number', required: true, type: 'tel', autoComplete: 'tel' },
] as const

const inputClass =
  'w-full border border-line bg-ink px-4 py-3 text-sm text-bright placeholder:text-faint focus:border-bright focus:outline-none'

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  if (!web3formsKey) {
    return (
      <div className="border border-line bg-card p-8">
        <p className="text-sm leading-relaxed">
          The contact form needs a Web3Forms access key. Set{' '}
          <code className="text-bright">VITE_WEB3FORMS_KEY</code> in your{' '}
          <code className="text-bright">.env</code> file. See the README. In the
          meantime you can reach us directly:
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button href={`mailto:${contact.email}`}>Email Us</Button>
          <Button href={`tel:${contact.phoneHref}`} variant="outline">
            {contact.phone}
          </Button>
        </div>
      </div>
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.message ?? 'Submission failed')
      }
      form.reset()
      setStatus('sent')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="border border-line bg-card p-8"
        role="status"
        aria-live="polite"
      >
        <h3 className="caps text-lg">Thanks for submitting</h3>
        <p className="mt-4 text-sm leading-relaxed">
          We&apos;ve got your message and will be in touch shortly.
        </p>
        <Button variant="outline" className="mt-7" onClick={() => setStatus('idle')}>
          Send Another
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="access_key" value={web3formsKey} />

      <input type="hidden" name="from_name" value="prosoundoffice.com enquiry" />

      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-x-10">
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="mb-2 block text-sm font-semibold text-bright"
            >
              {field.label}
              {field.required && (
                <span className="text-faint" aria-hidden="true">
                  {' '}
                  *
                </span>
              )}
            </label>
            <input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-semibold text-bright">
          Message
          <span className="text-faint" aria-hidden="true">
            {' '}
            *
          </span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={7}
          required
          placeholder="Your Message or Inquiry"
          className={`${inputClass} resize-y`}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-bright" role="alert">
          {error}. Please try again, or email{' '}
          <a href={`mailto:${contact.email}`} className="underline">
            {contact.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" variant="outline" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit'}
      </Button>
    </form>
  )
}

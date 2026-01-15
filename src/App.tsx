import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

// Interface for form data structure
interface IFormData {
  name: string
  email: string
  message: string
}

// Interface for form errors
interface IFormErrors {
  name: string
  email: string
  message: string
}

// Initial empty form state
const initialFormData: IFormData = {
  name: '',
  email: '',
  message: ''
}

const initialErrors: IFormErrors = {
  name: '',
  email: '',
  message: ''
}

// Validation functions - return error message or empty string
const validateName = (name: string): string => {
  if (!name.trim()) return 'Name is required'
  if (name.trim().length < 2) return 'Name must be at least 2 characters'
  return ''
}

const validateEmail = (email: string): string => {
  if (!email.trim()) return 'Email is required'
  if (!email.includes('@')) return 'Email must include @'
  return ''
}

const validateMessage = (message: string): string => {
  if (!message.trim()) return 'Message is required'
  if (message.trim().length < 10) return 'Message must be at least 10 characters'
  return ''
}

function App() {
  const [formData, setFormData] = useState<IFormData>(initialFormData)
  const [errors, setErrors] = useState<IFormErrors>(initialErrors)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return validateName(value)
      case 'email':
        return validateEmail(value)
      case 'message':
        return validateMessage(value)
      default:
        return ''
    }
  }

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear success message when user starts typing again
    if (successMessage) setSuccessMessage('')

    // Validate on change if field was touched
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
    }
  }

  // Handle blur - mark field as touched and validate
  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  // Check if form is valid
  const isFormValid = (): boolean => {
    return (
      !validateName(formData.name) &&
      !validateEmail(formData.email) &&
      !validateMessage(formData.message)
    )
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: IFormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      message: validateMessage(formData.message)
    }
    setErrors(newErrors)
    setTouched({ name: true, email: true, message: true })

    // Only submit if no errors
    if (!isFormValid()) return

    // Simulate API call
    setIsSubmitting(true)
    setTimeout(() => {
      console.log('Form submitted:', formData)

      // Reset form
      setFormData(initialFormData)
      setErrors(initialErrors)
      setTouched({})
      setIsSubmitting(false)
      setSuccessMessage('Thank you! Your message has been sent.')
    }, 1000)
  }

  return (
    <main>
      <h1>Vibe Form</h1>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.name && touched.name && (
            <span className="error-message">{errors.name}</span>
          )}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.email && touched.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.message && touched.message ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.message && touched.message && (
            <span className="error-message">{errors.message}</span>
          )}
        </div>

        <button type="submit" disabled={!isFormValid() || isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </main>
  )
}

export default App

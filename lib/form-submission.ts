interface FormData {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

interface FormSubmissionResponse {
  success: boolean
  message: string
}

const ACCESS_KEY = "d438427d-894e-41ec-8ae2-18caa7a54c06"
const RECIPIENT_EMAIL = "rachit2115cool@gmail.com"

export async function submitContactForm(formData: FormData): Promise<FormSubmissionResponse> {
  try {
    // Create email content
    const emailContent = `
      New Contact Form Submission - NutriTrack
      
      Name: ${formData.firstName} ${formData.lastName}
      Email: ${formData.email}
      Subject: ${formData.subject}
      
      Message:
      ${formData.message}
      
      ---
      Submitted from NutriTrack Contact Form
      ${new Date().toLocaleString()}
    `

    // Using Web3Forms (free form submission service)
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        subject: `NutriTrack Contact: ${formData.subject}`,
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        to_email: RECIPIENT_EMAIL,
        message: emailContent,
        botcheck: '', // Anti-bot field
      }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return {
        success: true,
        message: "Your message has been sent successfully! We'll get back to you within 24 hours."
      }
    } else {
      throw new Error(result.message || 'Failed to submit form')
    }
  } catch (error) {
    console.error('Form submission error:', error)
    
    // Try alternative service
    try {
      const fallbackResponse = await fetch('https://formspree.io/f/mzbnjjzq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: `
            New Contact Form Submission - NutriTrack
            
            Name: ${formData.firstName} ${formData.lastName}
            Email: ${formData.email}
            Subject: ${formData.subject}
            
            Message:
            ${formData.message}
            
            ---
            Submitted: ${new Date().toLocaleString()}
          `,
          _replyto: formData.email,
          _subject: `NutriTrack Contact: ${formData.subject}`,
        }),
      })

      if (fallbackResponse.ok) {
        return {
          success: true,
          message: "Your message has been sent successfully! We'll get back to you within 24 hours."
        }
      }
    } catch (fallbackError) {
      console.error('Fallback submission error:', fallbackError)
    }

    return {
      success: false,
      message: "Failed to send message. Please try again later or email us directly at rachit2115cool@gmail.com"
    }
  }
}

// Simple email client fallback
export async function submitContactFormSimple(formData: FormData): Promise<FormSubmissionResponse> {
  try {
    // Create mailto link as fallback
    const subject = encodeURIComponent(`NutriTrack Contact: ${formData.subject}`)
    const body = encodeURIComponent(`
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}

Message:
${formData.message}

---
Submitted: ${new Date().toLocaleString()}
    `)
    
    // Open email client with pre-filled content
    window.location.href = `mailto:${RECIPIENT_EMAIL}?subject=${subject}&body=${body}`
    
    return {
      success: true,
      message: "Email client opened with your message. Please send the email to complete your submission."
    }
  } catch (error) {
    console.error('Email client error:', error)
    return {
      success: false,
      message: "Failed to open email client. Please email us directly at rachit2115cool@gmail.com"
    }
  }
}

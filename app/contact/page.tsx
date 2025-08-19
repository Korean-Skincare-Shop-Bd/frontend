// pages/contact.tsx or app/contact/page.tsx
'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
    
    // You would typically show a success message here
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/10 min-h-screen">
      <div className="mx-auto px-4 py-8 md:py-12 max-w-6xl container">
        {/* Header */}
        <div className="mb-12 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary transition-all hover:gap-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="flex justify-center items-center bg-primary/10 rounded-full w-16 h-16">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-bold text-foreground text-4xl md:text-5xl">Contact Us</h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We&apos;re here to help! Reach out to us with any questions or concerns about our Korean skincare products.
          </p>
        </div>

        <div className="gap-8 lg:gap-12 grid lg:grid-cols-2">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="space-y-8 bg-card shadow-lg hover:shadow-xl p-8 border border-border rounded-2xl transition-shadow">
              <div className="text-center">
                <div className="inline-flex justify-center items-center bg-primary/10 mb-4 rounded-full w-12 h-12">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="mb-2 font-bold text-foreground text-2xl">Get In Touch</h2>
                <p className="text-muted-foreground text-sm">We&apos;d love to hear from you</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 hover:bg-muted/30 p-4 rounded-xl transition-colors group">
                  <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-lg w-10 h-10 transition-colors">
                    <Mail className="flex-shrink-0 w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Email</h3>
                    <a href="mailto:koreanskincareshopbd1@gmail.com" className="text-muted-foreground hover:text-primary text-sm transition-colors break-all">
                      koreanskincareshopbd1@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 hover:bg-muted/30 p-4 rounded-xl transition-colors group">
                  <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-lg w-10 h-10 transition-colors">
                    <Phone className="flex-shrink-0 w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
                    <a href="https://wa.me/8801534554311" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                      +8801534554311
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 hover:bg-muted/30 p-4 rounded-xl transition-colors group">
                  <div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/20 rounded-lg w-10 h-10 transition-colors">
                    <MapPin className="flex-shrink-0 w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground text-sm">
                      Dhanmondi, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
                
                {/* <div className="flex items-start gap-3">
                  <Clock className="flex-shrink-0 mt-1 w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">Business Hours</h3>
                    <div className="space-y-1 text-muted-foreground text-sm">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            {/* Quick Contact Options */}
            <div className="space-y-4">
              <h3 className="font-bold text-foreground text-lg">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href="tel:+8801534554311"
                  className="flex items-center gap-4 hover:bg-primary/10 hover:border-primary/20 p-4 border border-border rounded-xl transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex justify-center items-center bg-green-100 dark:bg-green-900/30 rounded-lg w-10 h-10">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">Call Now</span>
                    <p className="text-muted-foreground text-xs">Instant support via phone</p>
                  </div>
                </a>
                <a
                  href="mailto:koreanskincareshopbd1@gmail.com"
                  className="flex items-center gap-4 hover:bg-primary/10 hover:border-primary/20 p-4 border border-border rounded-xl transition-all transform hover:scale-[1.02] group"
                >
                  <div className="flex justify-center items-center bg-blue-100 dark:bg-blue-900/30 rounded-lg w-10 h-10">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-foreground">Send Email</span>
                    <p className="text-muted-foreground text-xs">Get detailed support via email</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Section - Right Side */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <div className="inline-flex justify-center items-center bg-primary/10 mb-4 rounded-full w-12 h-12">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <h2 className="mb-4 font-bold text-foreground text-2xl">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">Find quick answers to common questions</p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    question: "How long does shipping take?",
                    answer: "Inside Dhaka: 1-2 days, Outside Dhaka: 3-5 days",
                    icon: "🚚"
                  },
                  {
                    question: "What are your shipping charges?",
                    answer: "Inside Dhaka: ৳80, Outside Dhaka: ৳150",
                    icon: "💰"
                  },
                  {
                    question: "Do you offer cash on delivery?",
                    answer: "Yes, we offer cash on delivery for all orders within Bangladesh.",
                    icon: "💵"
                  },
                  {
                    question: "Are all products authentic?",
                    answer: "Yes, we guarantee 100% authentic Korean skincare products directly from Korea.",
                    icon: "✅"
                  },
                ].map((faq, index) => (
                  <div key={index} className="bg-card hover:shadow-md p-5 border border-border rounded-xl transition-all transform hover:scale-[1.02] group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 text-xl">{faq.icon}</div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold text-foreground text-base leading-tight">{faq.question}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
                    {/* Contact Form */}
          {/* <div className="lg:col-span-2"> */}
            {/* <div className="bg-muted/50 p-6 rounded-lg">
              <h2 className="mb-6 font-semibold text-foreground text-xl">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="gap-4 grid md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium text-foreground text-sm">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground placeholder-muted-foreground"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium text-foreground text-sm">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground placeholder-muted-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="gap-4 grid md:grid-cols-2">
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium text-foreground text-sm">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground placeholder-muted-foreground"
                      placeholder="+880 123 456 7890"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block mb-2 font-medium text-foreground text-sm">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 font-medium text-foreground text-sm">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground resize-none placeholder-muted-foreground"
                    placeholder="Please describe your inquiry in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 px-6 py-3 rounded-lg focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full font-medium text-primary-foreground transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
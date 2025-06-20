// pages/support.tsx or app/support/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Headphones, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  Search,
  ChevronRight,
  Star
} from 'lucide-react';

const CustomerSupportPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I track my order?",
      answer: "You can track your order using the tracking number sent to your email and SMS. Visit our tracking page or use the link provided in your confirmation message."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, mobile banking (bKash, Nagad, Rocket), and cash on delivery for local orders."
    },
    {
      question: "How long does shipping take?",
      answer: "Inside Dhaka: 1-2 days (৳80), Outside Dhaka: 3-5 days (৳150). Same-day delivery available for orders placed before 2 PM in selected Dhaka areas."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order within 2 hours of placing it if it hasn't been processed yet. Contact our support team immediately."
    },
    {
      question: "Do you offer warranties?",
      answer: "Yes, we provide manufacturer warranties on applicable products. Warranty terms vary by product and are clearly mentioned on product pages."
    },
    {
      question: "How do I return an item?",
      answer: "We offer a 7-day return policy. Contact us within 7 days of delivery, pack the item in original packaging, and we'll arrange free pickup."
    }
  ];

  const supportChannels = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our support team",
      contact: "+880 153 455 4311",
      availability: "9 AM - 9 PM (Daily)",
      color: "blue"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us detailed questions or concerns",
      contact: "koreanskincareshopbd1@gmail.com",
      availability: "24/7 (Response within 6 hours)",
      color: "green"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Get instant help through live chat",
      contact: "Available on website",
      availability: "9 AM - 11 PM (Daily)",
      color: "purple"
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-6xl container">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 mb-4 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Headphones className="w-8 h-8 text-primary" />
            <h1 className="font-bold text-foreground text-3xl">Customer Support</h1>
          </div>
                    <p className="text-muted-foreground">
            We're here to help you with any questions or concerns. Choose the support option that works best for you.
          </p>
        </div>

        <div className="space-y-12">
          {/* Support Channels */}
          <section>
            <h2 className="mb-6 font-semibold text-foreground text-2xl text-center">Get Help Your Way</h2>
            <div className="gap-6 grid md:grid-cols-3">
              {supportChannels.map((channel, index) => (
                <div key={index} className={`border-2 border-${channel.color}-200 dark:border-${channel.color}-800 rounded-lg p-6 hover:shadow-lg transition-shadow`}>
                  <div className={`w-12 h-12 bg-${channel.color}-100 dark:bg-${channel.color}-950/20 rounded-lg flex items-center justify-center mb-4`}>
                    <div className={`text-${channel.color}-600`}>{channel.icon}</div>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{channel.title}</h3>
                  <p className="mb-3 text-muted-foreground text-sm">{channel.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{channel.contact}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-xs">{channel.availability}</span>
                    </div>
                  </div>
                  <button className={`w-full mt-4 bg-${channel.color}-600 text-white py-2 rounded-lg hover:bg-${channel.color}-700 transition-colors`}>
                    Contact Now
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Help */}
          <section className="bg-muted/50 p-8 rounded-lg">
            <h2 className="mb-6 font-semibold text-foreground text-2xl text-center">Quick Help</h2>
            <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Track Order", description: "Check your order status", icon: "📦" },
                { title: "Return Item", description: "Start a return process", icon: "🔄" },
                { title: "Update Address", description: "Change delivery details", icon: "📍" },
                { title: "Payment Help", description: "Billing and payment support", icon: "💳" }
              ].map((item, index) => (
                <div key={index} className="bg-background hover:shadow-md p-4 border border-border rounded-lg transition-shadow cursor-pointer">
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h3 className="mb-1 font-medium text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  <ChevronRight className="mt-2 w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>

          {/* FAQ Search */}
          <section>
            <h2 className="mb-6 font-semibold text-foreground text-2xl text-center">Frequently Asked Questions</h2>
            <div className="mx-auto mb-8 max-w-2xl">
              <div className="relative">
                <Search className="top-1/2 left-3 absolute w-5 h-5 text-muted-foreground -translate-y-1/2 transform" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  className="bg-background py-3 pr-4 pl-10 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground placeholder-muted-foreground"
                />
              </div>
            </div>

            {/* FAQ Items */}
            <div className="space-y-4 mx-auto max-w-4xl">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-border rounded-lg">
                  <button className="hover:bg-muted/50 p-4 w-full text-left transition-colors">
                    <div className="flex justify-between items-center">
                      <h3 className="flex items-center gap-2 font-medium text-foreground">
                        <HelpCircle className="w-4 h-4 text-primary" />
                        {faq.question}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="pl-6 text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form */}
          <section className="bg-muted/50 p-8 rounded-lg">
            <div className="mx-auto max-w-2xl">
              <h2 className="mb-6 font-semibold text-foreground text-2xl text-center">Still Need Help?</h2>
              <form className="space-y-6">
                <div className="gap-4 grid md:grid-cols-2">
                  <div>
                    <label className="block mb-2 font-medium text-foreground text-sm">Name</label>
                    <input
                      type="text"
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-foreground text-sm">Email</label>
                    <input
                      type="email"
                      className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-medium text-foreground text-sm">Order Number (Optional)</label>
                  <input
                    type="text"
                    className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground"
                    placeholder="Enter your order number if applicable"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-foreground text-sm">How can we help?</label>
                  <textarea
                    rows={4}
                    className="bg-background px-3 py-2 border focus:border-transparent border-border rounded-lg focus:ring-2 focus:ring-primary w-full text-foreground resize-none"
                    placeholder="Describe your issue or question in detail..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 py-3 rounded-lg w-full font-medium text-primary-foreground transition-colors"
                >
                  Send Support Request
                </button>
              </form>
            </div>
          </section>

          {/* Support Hours */}
          <section className="p-6 border border-border rounded-lg">
            <h2 className="flex justify-center items-center gap-2 mb-4 font-semibold text-foreground text-xl text-center">
              <Clock className="w-5 h-5" />
              Support Hours
            </h2>
            <div className="gap-6 grid md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-foreground">Phone & Live Chat</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday:</span>
                    <span className="text-foreground">9:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday:</span>
                    <span className="text-foreground">10:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday:</span>
                    <span className="text-foreground">10:00 AM - 6:00 PM</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-medium text-foreground">Email Support</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="text-foreground">Within 6 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <span className="text-foreground">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priority Support:</span>
                    <span className="text-foreground">Premium members</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Reviews */}
          {/* <section className="text-center">
            <h2 className="mb-6 font-semibold text-foreground text-2xl">What Our Customers Say</h2>
            <div className="gap-6 grid md:grid-cols-3">
              {[
                {
                  name: "Sarah Ahmed",
                  rating: 5,
                  comment: "Excellent customer service! They resolved my issue within minutes.",
                  location: "Dhaka"
                },
                {
                  name: "Mohammad Rahman",
                  rating: 5,
                  comment: "Very helpful support team. They guided me through the return process.",
                  location: "Chittagong"
                },
                {
                  name: "Fatima Khan",
                  rating: 5,
                  comment: "Quick response and professional service. Highly recommended!",
                  location: "Sylhet"
                }
              ].map((review, index) => (
                <div key={index} className="bg-muted/50 p-6 rounded-lg">
                  <div className="flex justify-center mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="fill-current w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 text-muted-foreground text-sm italic">"{review.comment}"</p>
                  <div className="text-center">
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-muted-foreground text-xs">{review.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </section> */}

          {/* Emergency Contact */}
          <section className="bg-red-50 dark:bg-red-950/20 p-6 border border-red-200 dark:border-red-800 rounded-lg text-center">
            <h2 className="mb-4 font-semibold text-red-800 dark:text-red-200 text-xl">Emergency Support</h2>
            <p className="mb-4 text-red-700 dark:text-red-300">
              For urgent issues related to payment problems or order disputes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:+8801534554311"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white transition-colors"
              >
                <Phone className="w-4 h-4" />
                Emergency Hotline
              </a>
              <a
                href="mailto:koreanskincareshopbd1@gmail.com"
                className="inline-flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 px-6 py-3 border border-red-600 rounded-lg text-red-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Priority Email
              </a>
            </div>
            <p className="mt-3 text-red-600 dark:text-red-400 text-sm">
              Available 24/7 for critical issues
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;
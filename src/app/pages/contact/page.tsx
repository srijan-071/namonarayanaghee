"use client";
import { toast } from "sonner";
import { useState } from "react";

import React from "react";
import { Mail, MessageCircle, MapPin, Send, AlertCircle, Loader2 } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="bg-[#FAF8F5] min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="nn-container max-w-6xl">
        
        {/* Header */}
        <section className="text-center mb-16">
          <div
          >
            <span className="nn-eyebrow mb-6 inline-block">Contact Us</span>
            <h1 className="nn-title text-5xl md:text-6xl mb-6 leading-tight">
              Get in Touch
            </h1>
            <p className="nn-sub text-xl max-w-2xl mx-auto text-[#4A5450]">
              We&apos;d love to hear from you! Whether you have a question about our products, need help with an order, or just want to say hello.
            </p>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Contact Information */}
          <div
            className="space-y-10"
          >
            <div>
              <h2 className="text-3xl font-serif text-[#03483F] mb-8">How can we help?</h2>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              
              {/* Customer Support */}
              <div className="flex items-start gap-6 bg-white p-6 rounded-2xl border border-[#EAE2D2] shadow-sm">
                <div className="bg-[#FCFAF5] p-4 rounded-xl text-[#C99A3D]">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C2B26] mb-1">Customer Support</h3>
                  <p className="text-[#4A5450] text-sm mb-2">We typically respond within 24 hours (Mon–Sat, 10 AM – 7 PM IST)</p>
                  <a href="mailto:support@namonarayanaghee.store" className="text-[#C99A3D] font-semibold hover:text-[#A87845]">support@namonarayanaghee.store</a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-6 bg-white p-6 rounded-2xl border border-[#EAE2D2] shadow-sm">
                <div className="bg-[#FCFAF5] p-4 rounded-xl text-[#25D366]">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C2B26] mb-1">WhatsApp Chat</h3>
                  <p className="text-[#4A5450] text-sm mb-2">For quick queries regarding your order or our products.</p>
                  <a href="https://api.whatsapp.com/send/?phone=919999993821&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-[#C99A3D] font-semibold hover:text-[#A87845]">+91 9999993821</a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-6 bg-white p-6 rounded-2xl border border-[#EAE2D2] shadow-sm">
                <div className="bg-[#FCFAF5] p-4 rounded-xl text-[#075B4F]">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1C2B26] mb-1">Registered Office</h3>
                  <p className="text-[#4A5450] text-sm leading-relaxed">
                    HIMANI FOODS PRIVATE LIMITED<br />
                    Rohat(215), Sampla Sonipat Road<br />
                    District Sonipat, 131403<br />
                    Sonipat HR, India
                  </p>
                </div>
              </div>

              {/* Grievance */}
              <div className="flex items-start gap-6 bg-[#FCFAF5] p-6 rounded-2xl border border-[#EAE2D2]">
                <div className="text-[#4A5450] mt-1">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-[#1C2B26] mb-1">Grievance Officer</h3>
                  <p className="text-[#4A5450] text-sm leading-relaxed">
                    All grievances will be acknowledged within 48 hours and resolved within 30 days.<br />
                    <strong>Email:</strong> <a href="mailto:support@namonarayanaghee.store" className="text-[#C99A3D]">support@namonarayanaghee.store</a>
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Form */}
          <div
          >
            <div className="bg-white rounded-2xl shadow-xl border border-[#EAE2D2] p-8 md:p-12">
              <h3 className="text-2xl font-serif text-[#03483F] mb-6">Send us a message</h3>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setTimeout(() => {
                  setIsSubmitting(false);
                  toast.success("Message sent successfully!");
                }, 600);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#4A5450] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#4A5450] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#4A5450] mb-2">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all text-[#1C2B26]"
                  >
                    <option value="order">Order Related Query</option>
                    <option value="product">Product Information</option>
                    <option value="business">Business & Partnerships (Bulk/Wholesale)</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="orderId" className="block text-sm font-medium text-[#4A5450] mb-2">Order ID (Optional)</label>
                  <input 
                    type="text" 
                    id="orderId" 
                    className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all"
                    placeholder="#NN-12345"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#4A5450] mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full bg-[#FCFAF5] border border-[#EAE2D2] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C99A3D] focus:border-transparent transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full nn-btn nn-btn-primary py-4 text-base shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

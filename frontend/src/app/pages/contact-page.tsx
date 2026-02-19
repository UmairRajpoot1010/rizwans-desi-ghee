import { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock } from 'lucide-react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/923287318269', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#5F6B3C] to-[#6B4A1E] py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-4xl md:text-5xl text-white text-center mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Get in Touch
          </h1>
          <p className="text-white/90 text-center text-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
            We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 -mt-16 mb-12">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="bg-white p-8 rounded-3xl shadow-2xl border border-[#E6B65C]/20 hover:shadow-xl transition-all text-left group"
            >
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                WhatsApp
              </h3>
              <p className="text-[#6B4A1E]/70 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Chat with us instantly
              </p>
              <p className="text-lg text-[#5F6B3C]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                +92-3287318269
              </p>
            </button>

            {/* Phone */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#E6B65C]/20">
              <div className="w-16 h-16 bg-[#E6B65C] rounded-2xl flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Phone
              </h3>
              <p className="text-[#6B4A1E]/70 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Call us directly
              </p>
              <p className="text-lg text-[#5F6B3C] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                +92-3287318269
              </p>
              <p className="text-sm text-[#6B4A1E]/60" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Mon-Sat: 9AM - 7PM
              </p>
            </div>

            {/* Email */}
            <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#E6B65C]/20">
              <div className="w-16 h-16 bg-[#5F6B3C] rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Email
              </h3>
              <p className="text-[#6B4A1E]/70 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Send us an email
              </p>
              <p className="text-lg text-[#5F6B3C]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                info@rizwansghee.com
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#E6B65C]/20">
              <h2 className="text-3xl text-[#6B4A1E] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E]"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-[#6B4A1E] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-6 py-4 bg-[#FAF7F2] border border-[#E6B65C]/20 rounded-2xl focus:outline-none focus:border-[#5F6B3C] text-[#6B4A1E] resize-none"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#5F6B3C] text-white rounded-full hover:bg-[#6B4A1E] transition-all shadow-lg"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Address & Map */}
            <div className="space-y-8">
              {/* Address Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E6B65C]/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Visit Our Farm
                    </h3>
                    <p className="text-[#6B4A1E]/70 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Adda bangla jalalpur road lodhran, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E6B65C]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#5F6B3C]" />
                  </div>
                  <div>
                    <h3 className="text-xl text-[#6B4A1E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      Business Hours
                    </h3>
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-[#E6B65C]/20">
                <div className="w-full h-[400px] bg-gradient-to-br from-[#E6B65C]/10 to-[#5F6B3C]/10 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-[#5F6B3C] mx-auto mb-4" />
                    <p className="text-[#6B4A1E]/70" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Map Location
                    </p>
                    <p className="text-sm text-[#6B4A1E]/60 mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Lahore, Punjab
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-center text-white">
                <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Need Quick Help?
                </h3>
                <p className="text-white/90 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Chat with us on WhatsApp for instant support
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="px-8 py-4 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Start WhatsApp Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

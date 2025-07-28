import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    
    // Check for free email domains
    const freeEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (emailDomain && freeEmailDomains.includes(emailDomain)) {
      newErrors.email = "Please use a business email address. Free email domains are not accepted.";
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // For now, simulate successful submission
      // TODO: Replace with actual API call to your backend or Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form submitted:", {
        ...formData,
        submission_type: "contact"
      });
      
      setSubmitStatus("success");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        phone: "",
        message: ""
      });
    } catch {
      setSubmitStatus("error");
    }
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-200 to-gray-250">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ready to transform your legal technology capabilities? Get in touch with our team 
            to discuss how we can level the playing field for your firm.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Contact Info */}
          <div>
            <div className="neumorphic rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Our Mission
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                We&apos;re here to level the playing field for firms of all sizes by leveraging 
                cutting-edge technology and offering transparent, flat-rate pricing. 
                No surprises, no hidden costs – just exceptional service and results.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="neumorphic-inset p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-gray-600">info@platinumids.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="neumorphic-inset p-3 rounded-xl">
                    <Phone className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="neumorphic-inset p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visit Us</h4>
                    <p className="text-gray-600">Legal Technology Center<br />Business District</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="neumorphic rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h3>

            {submitStatus === "success" && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Thank you for your message! We&apos;ll get back to you within 24 hours.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  There was an error sending your message. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-gray-700 font-medium">
                    First Name *
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    className={`neumorphic-inset border-0 focus:shadow-outline mt-2 ${
                      errors.first_name ? "shadow-red-200" : ""
                    }`}
                    placeholder="Your first name"
                  />
                  {errors.first_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="last_name" className="text-gray-700 font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    className={`neumorphic-inset border-0 focus:shadow-outline mt-2 ${
                      errors.last_name ? "shadow-red-200" : "" 
                    }`}
                    placeholder="Your last name"
                  />
                  {errors.last_name && (
                    <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`neumorphic-inset border-0 focus:shadow-outline mt-2 ${
                    errors.email ? "shadow-red-200" : ""
                  }`}
                  placeholder="your.email@company.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">
                  Please use a business email address
                </p>
              </div>

              <div>
                <Label htmlFor="company" className="text-gray-700 font-medium">
                  Company Name *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className={`neumorphic-inset border-0 focus:shadow-outline mt-2 ${
                    errors.company ? "shadow-red-200" : ""
                  }`}
                  placeholder="Your law firm or company"
                />
                {errors.company && (
                  <p className="text-red-600 text-sm mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="neumorphic-inset border-0 focus:shadow-outline mt-2"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  className="neumorphic-inset border-0 focus:shadow-outline mt-2 h-32 resize-none"
                  placeholder="Tell us about your needs and how we can help..."
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full neumorphic-button py-4 text-lg font-semibold text-gray-800 hover:text-gray-900"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

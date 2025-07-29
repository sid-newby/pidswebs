import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ExternalLink, Calendar, BookOpen, Video, Award, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import TeamsScheduler from "@/components/TeamsScheduler";

export default function Training() {
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
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const platforms = [
    {
      name: "Reveal",
      description: "Industry-leading eDiscovery platform with advanced analytics and review capabilities.",
      logo: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&h=120&fit=crop",
      color: "bg-blue-500"
    },
    {
      name: "Relativity",
      description: "Comprehensive legal technology platform for eDiscovery and compliance workflows.",
      logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=120&h=120&fit=crop", 
      color: "bg-green-500"
    },
    {
      name: "iConect",
      description: "Cloud-based eDiscovery platform designed for efficient document review and analysis.",
      logo: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=120&h=120&fit=crop",
      color: "bg-purple-500"
    }
  ];

  const resources = [
    {
      provider: "Reveal Discovery",
      description: "Official training and certification programs for Reveal platform users.",
      resources: [
        { name: "Training and Certification", url: "https://revealdata.com/training" },
        { name: "Webinar Series", url: "https://revealdata.com/webinars" },
        { name: "User Documentation", url: "https://revealdata.com/docs" },
        { name: "Best Practices Guide", url: "https://revealdata.com/best-practices" }
      ]
    },
    {
      provider: "Relativity",
      description: "Comprehensive learning resources for Relativity platform expertise.",
      resources: [
        { name: "Relativity Training", url: "https://www.relativity.com/training" },
        { name: "Certification Programs", url: "https://www.relativity.com/certification" },
        { name: "Community Forums", url: "https://community.relativity.com" },
        { name: "Knowledge Base", url: "https://help.relativity.com" }
      ]
    },
    {
      provider: "iConect",
      description: "Learning materials and support for iConect platform proficiency.",
      resources: [
        { name: "Training Courses", url: "https://www.iconect.com/training" },
        { name: "Video Tutorials", url: "https://www.iconect.com/tutorials" },
        { name: "Support Center", url: "https://support.iconect.com" },
        { name: "User Community", url: "https://community.iconect.com" }
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // For now, simulate successful submission
      // TODO: Replace with actual API call to your backend or Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Training inquiry submitted:", {
        ...formData,
        submission_type: "training_inquiry"
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

  const openScheduler = (platform) => {
    setSelectedPlatform(platform);
    setSchedulerOpen(true);
  };

  const closeScheduler = () => {
    setSchedulerOpen(false);
    setSelectedPlatform(null);
  };

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon" className="neumorphic-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Platform Training</h1>
            <p className="text-gray-600 mt-2">Master the tools that power your legal technology</p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="neumorphic mb-12">
          <CardContent className="p-8 lg:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <div className="neumorphic-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                Maximize Your Platform Investment
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Get the most out of your eDiscovery platforms with comprehensive training programs 
                designed by experts. Whether you&apos;re new to these tools or looking to advance your skills,
                our training will help you work more efficiently and effectively.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="neumorphic-inset rounded-xl p-4">
                  <Video className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800">Live Sessions</h4>
                  <p className="text-sm text-gray-600">Interactive training with experts</p>
                </div>
                <div className="neumorphic-inset rounded-xl p-4">
                  <Award className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800">Certification</h4>
                  <p className="text-sm text-gray-600">Earn recognized certifications</p>
                </div>
                <div className="neumorphic-inset rounded-xl p-4">
                  <Calendar className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-800">Flexible Scheduling</h4>
                  <p className="text-sm text-gray-600">Training that fits your schedule</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Platform Selection */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Platform Training</h3>
            <p className="text-gray-600 mb-8">
              Select your platform below to access specialized training calendars and book your session.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {platforms.map((platform, index) => (
                <Card key={index} className="neumorphic hover:shadow-inner transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className={`neumorphic w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${platform.color} bg-opacity-20`}>
                      <img
                        src={platform.logo}
                        alt={`${platform.name} logo`}
                        className="w-8 h-8 object-contain filter grayscale group-hover:grayscale-0 transition-all"
                      />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{platform.name}</h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{platform.description}</p>
                    <button
                      onClick={() => openScheduler(platform)}
                      className="neumorphic-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-800 font-semibold text-sm hover:scale-105 transition-transform"
                    >
                      Schedule via Teams
                      <Video className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="neumorphic">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-teal-600" />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Supplement your training with these additional learning resources from our platform partners.
                </p>
                <Accordion type="single" collapsible className="space-y-4">
                  {resources.map((resource, index) => (
                    <AccordionItem key={index} value={`resource-${index}`} className="border-none">
                      <AccordionTrigger className="neumorphic-button rounded-xl px-4 py-3 hover:no-underline">
                        <div className="text-left">
                          <h4 className="font-bold text-gray-900">{resource.provider}</h4>
                          <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-4">
                        <div className="grid md:grid-cols-2 gap-3">
                          {resource.resources.map((link, linkIndex) => (
                            <a
                              key={linkIndex}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="neumorphic-inset rounded-lg p-3 flex items-center justify-between hover:shadow-outline transition-all group"
                            >
                              <span className="text-gray-700 font-medium">{link.name}</span>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="neumorphic sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-teal-600" />
                  Quick Questions?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 text-sm">
                  Have questions about our training programs? Send us a message and we&apos;ll respond quickly.
                </p>

                {submitStatus === "success" && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Message sent! We&apos;ll get back to you soon.
                    </AlertDescription>
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Error sending message. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="first_name" className="text-gray-700 text-sm">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="neumorphic-inset border-0 mt-1 text-sm"
                        placeholder="First name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-gray-700 text-sm">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="neumorphic-inset border-0 mt-1 text-sm"
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-700 text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="neumorphic-inset border-0 mt-1 text-sm"
                      placeholder="your.email@company.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-gray-700 text-sm">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="neumorphic-inset border-0 mt-1 text-sm"
                      placeholder="Your company"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 text-sm">Question</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="neumorphic-inset border-0 mt-1 h-24 resize-none text-sm"
                      placeholder="What would you like to know about our training programs?"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full neumorphic-button py-3 text-gray-800 font-semibold"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Teams Scheduler Modal */}
        <TeamsScheduler
          platform={selectedPlatform}
          isOpen={schedulerOpen}
          onClose={closeScheduler}
        />
      </div>
    </div>
  );
}

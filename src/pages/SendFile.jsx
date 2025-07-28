import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Image, CheckCircle, AlertCircle, X, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SendFile() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sender_name: "",
    sender_email: "",
    sender_phone: "",
    subject: "",
    comments: ""
  });
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.sender_name.trim()) newErrors.sender_name = "Name is required";
    if (!formData.sender_email.trim()) newErrors.sender_email = "Email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.sender_email && !emailRegex.test(formData.sender_email)) {
      newErrors.sender_email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && files.length > 0) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      // For now, simulate file upload process
      // TODO: Replace with actual file upload to your backend or Supabase
      const fileNames = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 500));
        fileNames.push(file.name);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      console.log("File submission:", {
        ...formData,
        file_names: fileNames,
        file_count: files.length
      });

      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    }
    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
        <Card className="neumorphic max-w-2xl w-full">
          <CardContent className="p-12 text-center">
            <div className="neumorphic-inset w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Files Sent Successfully!</h2>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for your submission. A confirmation email will be sent to{" "}
              <span className="font-semibold">{formData.sender_email}</span> from robot@platinumids.com.
            </p>
            <p className="text-gray-600 mb-8">
              Our team will review your files and get back to you as soon as possible.
            </p>
            <Link to={createPageUrl("Home")}>
              <Button className="neumorphic-button px-8 py-4 text-lg font-semibold text-gray-800">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon" className="neumorphic-button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Send a File</h1>
            <p className="text-gray-600 mt-2">Securely transfer your files to Platinum IDS</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="neumorphic rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step 
                    ? "neumorphic-inset text-teal-600" 
                    : "bg-gray-300 text-gray-600"
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-4 ${
                    currentStep > step ? "bg-teal-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className={currentStep >= 1 ? "text-teal-600 font-semibold" : "text-gray-500"}>
              Contact Info
            </span>
            <span className={currentStep >= 2 ? "text-teal-600 font-semibold" : "text-gray-500"}>
              Upload Files
            </span>
            <span className={currentStep >= 3 ? "text-teal-600 font-semibold" : "text-gray-500"}>
              Review & Send
            </span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="neumorphic">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sender_name" className="text-gray-700 font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="sender_name"
                        value={formData.sender_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                        className={`neumorphic-inset border-0 mt-2 ${
                          errors.sender_name ? "shadow-red-200" : ""
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.sender_name && (
                        <p className="text-red-600 text-sm mt-1">{errors.sender_name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="sender_phone" className="text-gray-700 font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="sender_phone"
                        type="tel"
                        value={formData.sender_phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, sender_phone: e.target.value }))}
                        className="neumorphic-inset border-0 mt-2"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sender_email" className="text-gray-700 font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="sender_email"
                      type="email"
                      value={formData.sender_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender_email: e.target.value }))}
                      className={`neumorphic-inset border-0 mt-2 ${
                        errors.sender_email ? "shadow-red-200" : ""
                      }`}
                      placeholder="your.email@company.com"
                    />
                    {errors.sender_email && (
                      <p className="text-red-600 text-sm mt-1">{errors.sender_email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className={`neumorphic-inset border-0 mt-2 ${
                        errors.subject ? "shadow-red-200" : ""
                      }`}
                      placeholder="Brief description of your files"
                    />
                    {errors.subject && (
                      <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="comments" className="text-gray-700 font-medium">
                      Additional Comments
                    </Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                      className="neumorphic-inset border-0 mt-2 h-32 resize-none"
                      placeholder="Any additional information about your files..."
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={handleNextStep}
                    className="neumorphic-button px-8 py-3 text-lg font-semibold text-gray-800 flex items-center gap-2"
                  >
                    Next: Upload Files
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h3>

                {/* Upload Instructions */}
                <Alert className="mb-6 border-teal-200 bg-teal-50">
                  <AlertCircle className="h-4 w-4 text-teal-600" />
                  <AlertDescription className="text-teal-800">
                    <strong>Important:</strong> Please compress large files before uploading. 
                    Keep this window open during upload. For files larger than 1GB, 
                    please contact us for SFTP or hard drive delivery options.
                  </AlertDescription>
                </Alert>

                {/* Drag and Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`neumorphic-inset rounded-2xl p-12 text-center transition-all duration-200 ${
                    dragActive ? "border-teal-400 bg-teal-50" : ""
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  
                  <div className="neumorphic w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10 text-gray-600" />
                  </div>
                  
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Drag & Drop Files Here
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Or click below to select files from your computer
                  </p>
                  
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="neumorphic-button px-6 py-3 text-gray-800 font-semibold"
                  >
                    Select Files
                  </Button>
                  
                  <p className="text-sm text-gray-500 mt-4">
                    Maximum 10,000 files per upload. Consider zipping large collections.
                  </p>
                </div>

                {/* Selected Files */}
                {files.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Selected Files ({files.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {files.map((file, index) => (
                        <div key={index} className="neumorphic-inset rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {file.type.startsWith('image/') ? (
                              <Image className="w-6 h-6 text-blue-500" />
                            ) : (
                              <FileText className="w-6 h-6 text-gray-500" />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="neumorphic-button px-6 py-3 text-gray-700 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={files.length === 0}
                    className="neumorphic-button px-8 py-3 text-lg font-semibold text-gray-800 flex items-center gap-2"
                  >
                    Review & Send
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Review & Send</h3>

                {/* Contact Info Summary */}
                <div className="neumorphic-inset rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <span className="ml-2 font-medium">{formData.sender_name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium">{formData.sender_email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 font-medium">{formData.sender_phone || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Subject:</span>
                      <span className="ml-2 font-medium">{formData.subject}</span>
                    </div>
                  </div>
                  {formData.comments && (
                    <div className="mt-4">
                      <span className="text-gray-600">Comments:</span>
                      <p className="ml-2 text-sm text-gray-700 mt-1">{formData.comments}</p>
                    </div>
                  )}
                </div>

                {/* Files Summary */}
                <div className="neumorphic-inset rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Files to Upload ({files.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{file.name}</span>
                        <span className="text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {uploading && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Uploading files...</span>
                      <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                {submitStatus === "error" && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      There was an error uploading your files. Please try again.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    disabled={uploading}
                    className="neumorphic-button px-6 py-3 text-gray-700 flex items-center gap-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="neumorphic-button px-8 py-3 text-lg font-semibold text-gray-800 flex items-center gap-2"
                  >
                    {uploading ? "Uploading..." : "Send Files"}
                    <Upload className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SendFile() {
  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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

        {/* Upload Instructions */}
        <Alert className="mb-6 border-teal-200 bg-teal-50">
          <AlertCircle className="h-4 w-4 text-teal-600" />
          <AlertDescription className="text-teal-800">
            <strong>Important:</strong> Please compress large files before uploading. 
            Keep this window open during upload. For files larger than 1GB, 
            please contact us for SFTP or hard drive delivery options.
          </AlertDescription>
        </Alert>

        {/* File Upload Iframe */}
        <Card className="neumorphic">
          <CardContent className="p-4">
            <iframe 
              src="https://files.platinumids.com/#/project/guest" 
              width="100%" 
              height="1200"
              title="File Upload Tool"
              className="border-0 rounded-lg w-full"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

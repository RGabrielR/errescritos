import React, { useState, useEffect, useRef } from 'react';
declare global {
  interface Window {
    cloudinary: any;
  }
}
interface CloudinaryUploadWidgetProps {
  onUploadSuccess: (url: string) => void; // Callback function to return the uploaded image URL
}

const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({ onUploadSuccess }) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false); // Track if the Cloudinary script is loaded
  const widgetRef = useRef<any>(null); // Ref to hold the widget instance

  // Load the Cloudinary widget script
  useEffect(() => {
    if (document.getElementById('cloudinary-script')) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'cloudinary-script';
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error('Failed to load Cloudinary widget script');
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize the Cloudinary widget when the script is loaded
  useEffect(() => {
    if (isScriptLoaded && window.cloudinary && !widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, // Your cloud name from environment variables
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_FOR_FORM, // Your upload preset
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Upload error:', error);
          } else if (result.event === 'success') {
            const uploadedUrl = result.info.secure_url;
            onUploadSuccess(uploadedUrl); // Return the uploaded URL via the callback
          }
        }
      );
    }
  }, [isScriptLoaded, onUploadSuccess]);

  // Function to open the Cloudinary upload widget
  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  return (
    <div>
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={openWidget}
      >
        Upload Image
      </button>
    </div>
  );
};

export default CloudinaryUploadWidget;

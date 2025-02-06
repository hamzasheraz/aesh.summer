"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function WhatsAppPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000); // Show popup after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open("https://wa.me/923260968237", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-6 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 w-16 h-16 flex items-center justify-center"
        aria-label="Chat on WhatsApp"
      >
        <FontAwesomeIcon
          icon={faWhatsapp}
          style={{ color: "#ffffff", fontSize: "9.5px" }}
        />
      </Button>
    </div>
  );
}

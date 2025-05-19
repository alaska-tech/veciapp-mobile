import React, { useEffect, useState } from 'react';
import { Image, View, Dimensions } from 'react-native';
import { Card } from "~/components/ui/card";

// Import the local banner images
const banners = [
  require('../../assets/images/customerbanner1.png'),
  require('../../assets/images/customerbanner2.png'),
  require('../../assets/images/customerbanner3.png'),
];

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    // Set up an interval to change the image every 2 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 2000);
    
    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="overflow-hidden rounded-xl mb-4">
      <Image
        source={banners[currentIndex]}
        style={{ 
          width: '100%', 
          height: 180,
        }}
        resizeMode="cover"
      />
    </Card>
  );
} 
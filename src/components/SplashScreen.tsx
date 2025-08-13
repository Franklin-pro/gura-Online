// components/SplashScreen.jsx
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated logo container */}
      <div className="relative mb-8">
        {/* Main logo with pulse animation */}
        <img 
          src="https://cdn-icons-png.flaticon.com/128/3649/3649775.png" 
          alt="App Logo" 
          className="h-32 w-32 animate-[pulse_2s_ease-in-out_infinite]"
        />
        
        {/* Floating circles decoration */}
        <div className="absolute -top-2 -left-2 h-8 w-8 rounded-full bg-blue-200 animate-[float_4s_ease-in-out_infinite]" />
        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-indigo-200 animate-[float_5s_ease-in-out_infinite]" />
        <div className="absolute top-1/4 -right-4 h-5 w-5 rounded-full bg-purple-200 animate-[float_3s_ease-in-out_infinite]" />
      </div>
      
      {/* Loading text with fade animation */}
      <p className="text-lg font-medium text-gray-700 mb-4 animate-[fadeInOut_2s_ease-in-out_infinite]">
        Loading your experience...
      </p>
      
      {/* Animated progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${loadingProgress}%` }}
        />
      </div>
      
      {/* Percentage indicator */}
      <p className="mt-2 text-sm text-gray-500">
        {loadingProgress}%
      </p>
      
      {/* Subtle animated dots */}
      <div className="flex mt-6 space-x-2">
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            className="h-2 w-2 bg-gray-400 rounded-full"
            style={{
              animation: `bounce 1.4s infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplashScreen;
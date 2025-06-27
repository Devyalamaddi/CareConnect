import React, { useState } from 'react';

const MorphingCTAButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div 
        className="relative cursor-pointer group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: `morphIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
          opacity: 0,
          transform: 'scale(0.3) rotate(180deg)'
        }}
      >
        {/* Magnetic Field Effect */}
        <div className={`absolute -inset-12 rounded-full transition-all duration-700 ease-out ${
          isHovered ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-2xl scale-150' : ''
        }`} />
        
        {/* Orbiting Ring */}
        <div className={`absolute -inset-6 border-2 border-transparent rounded-full transition-all duration-500 ${
          isHovered 
            ? 'border-blue-400/40 animate-spin' 
            : 'group-hover:border-gray-300/30 group-hover:animate-pulse'
        }`} />
        
        {/* Secondary Ring */}
        <div className={`absolute -inset-8 border border-transparent rounded-full transition-all duration-700 ${
          isHovered 
            ? 'border-purple-400/30 animate-spin' 
            : ''
        }`} style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
        
        {/* Main Button */}
        <a href="/auth" className="relative block">
          <div className={`relative px-12 py-6 rounded-full shadow-lg transform transition-all duration-500 ease-out ${
            isHovered 
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 scale-110 shadow-2xl shadow-blue-500/40' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105 hover:shadow-xl'
          }`}>
            
            {/* Ripple Effect */}
            {isHovered && (
              <div className="absolute inset-0 rounded-full">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                <div className="absolute inset-2 bg-white/10 rounded-full animate-pulse" />
              </div>
            )}
            
            {/* Button Text */}
            <span className={`relative text-lg font-bold text-white transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}>
              Get Started / Login or Signup
            </span>
            
            {/* Particles */}
            {isHovered && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white/80 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      animation: `particleFloat 2.5s linear infinite`,
                      animationDelay: `${i * 0.3}s`,
                      transform: `rotate(${i * 45}deg) translateX(60px)`
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Holographic Overlay */}
            <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'group-hover:opacity-50'
            }`} />
            
            {/* Inner Glow */}
            <div className={`absolute inset-1 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : ''
            }`} />
          </div>
        </a>
        
        {/* Floating Elements */}
        {isHovered && (
          <>
            <div className="absolute -top-4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-4 right-1/4 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-bounce" 
                 style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 -left-6 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping" />
            <div className="absolute top-1/2 -right-6 w-1 h-1 bg-indigo-400/60 rounded-full animate-ping" 
                 style={{ animationDelay: '0.7s' }} />
          </>
        )}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes morphIn {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(180deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        @keyframes particleFloat {
          0% {
            opacity: 1;
            transform: rotate(var(--rotation, 0deg)) translateX(0px) scale(0);
          }
          50% {
            opacity: 0.8;
            transform: rotate(var(--rotation, 0deg)) translateX(40px) scale(1);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--rotation, 0deg)) translateX(60px) scale(0);
          }
        }
      `}</style>
    </div>
  );
};

export default MorphingCTAButton;
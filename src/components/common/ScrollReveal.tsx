'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'zoomIn';
  delay?: number;
  duration?: number;
  sx?: SxProps<Theme>;
}

export default function ScrollReveal({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  sx,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const getAnimationKeyframes = () => {
    switch (animation) {
      case 'fadeInLeft':
        return {
          from: { opacity: 0, transform: 'translateX(-30px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        };
      case 'fadeInRight':
        return {
          from: { opacity: 0, transform: 'translateX(30px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        };
      case 'zoomIn':
        return {
          from: { opacity: 0, transform: 'scale(0.93)' },
          to: { opacity: 1, transform: 'scale(1)' },
        };
      default:
        return {
          from: { opacity: 0, transform: 'translateY(28px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        };
    }
  };

  return (
    <Box
      ref={domRef}
      sx={{
        opacity: isVisible ? 1 : 0,
        animation: isVisible
          ? `scrollRevealAnim ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`
          : 'none',
        '@keyframes scrollRevealAnim': getAnimationKeyframes(),
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

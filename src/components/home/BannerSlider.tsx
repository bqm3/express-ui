'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import type { MediaItem } from '@/types';
import { brandColors } from '@/lib/theme';

interface BannerSliderProps {
  banners: MediaItem[];
}

const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = banners.length;
  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count <= 1 || dragging) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [count, dragging]);

  const onPointerDown = (clientX: number) => {
    if (count <= 1) return;
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = clientX;
    dragXRef.current = 0;
    setDragging(true);
    setDragX(0);
  };

  const onPointerMove = (clientX: number) => {
    if (!draggingRef.current) return;
    const delta = clientX - startXRef.current;
    if (Math.abs(delta) > 6) movedRef.current = true;
    dragXRef.current = delta;
    setDragX(delta);
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);

    const delta = dragXRef.current;
    dragXRef.current = 0;
    setDragX(0);

    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      if (delta < 0) {
        setIndex((prev) => (prev + 1) % count);
      } else {
        setIndex((prev) => (prev - 1 + count) % count);
      }
    }
  };

  const trackOffsetPercent = count > 0 ? -((index * 100) / count) : 0;
  const width = containerRef.current?.clientWidth || 1;
  const dragPercent = dragging ? (dragX / width) * (100 / count) : 0;

  return (
    <Box
      ref={containerRef}
      onMouseDown={(e) => {
        e.preventDefault();
        onPointerDown(e.clientX);
      }}
      onMouseMove={(e) => onPointerMove(e.clientX)}
      onMouseUp={onPointerUp}
      onMouseLeave={() => {
        if (draggingRef.current) onPointerUp();
      }}
      onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
      onTouchEnd={onPointerUp}
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: { xs: 220, sm: 320, md: 420 },
        bgcolor: brandColors.primary,
        overflow: 'hidden',
        cursor: count > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
        touchAction: 'pan-y',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          minHeight: { xs: 220, sm: 320, md: 420 },
          width: `${count * 100}%`,
          transform: `translateX(calc(${trackOffsetPercent}% + ${dragPercent}%))`,
          transition: dragging ? 'none' : 'transform 0.45s ease',
        }}
      >
        {banners.map((banner) => {
          const content = (
            <Box
              component="img"
              src={banner.url}
              alt={banner.altText || banner.title || 'Banner'}
              draggable={false}
              sx={{
                width: '100%',
                height: '100%',
                minHeight: { xs: 220, sm: 320, md: 420 },
                objectFit: 'cover',
                display: 'block',
                pointerEvents: 'none',
              }}
            />
          );

          return (
            <Box
              key={banner.id}
              sx={{
                position: 'relative',
                width: `${100 / count}%`,
                flexShrink: 0,
                height: '100%',
              }}
            >
              {banner.linkUrl ? (
                <Box
                  component={Link}
                  href={banner.linkUrl}
                  onClick={(e) => {
                    if (movedRef.current) e.preventDefault();
                  }}
                  sx={{ display: 'block', height: '100%' }}
                >
                  {content}
                </Box>
              ) : (
                content
              )}
            </Box>
          );
        })}
      </Box>

      {count > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            position: 'absolute',
            right: { xs: 12, md: 20 },
            bottom: { xs: 12, md: 16 },
            zIndex: 1,
          }}
        >
          {banners.map((b, i) => (
            <Box
              key={b.id}
              component="button"
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 24 : 10,
                height: 10,
                p: 0,
                border: 0,
                cursor: 'pointer',
                bgcolor: i === index ? brandColors.gold : 'rgba(255,255,255,0.55)',
                transition: 'width 0.2s, background-color 0.2s',
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

'use client';

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import type { TrackingEvent } from '@/types';
import { brandColors } from '@/lib/theme';

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

export default function TrackingTimeline({ events }: TrackingTimelineProps) {
  if (!events.length) {
    return (
      <Typography sx={{
        color: "text.secondary"
      }}>Chưa có sự kiện vận chuyển nào.
              </Typography>
    );
  }

  return (
    <Timeline position="right" sx={{ p: 0, m: 0 }}>
      {events.map((event, index) => (
        <TimelineItem key={`${event.timestamp}-${index}`}>
          <TimelineOppositeContent
            sx={{
              color: "text.secondary",
              flex: 0.35,
              py: 1.5,
              px: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' }
            }}>
            <Typography variant="body2">
              {dayjs(event.timestamp).format('DD/MM/YYYY')}
            </Typography>
            <Typography variant="caption">
              {dayjs(event.timestamp).format('HH:mm')}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot
              sx={{
                bgcolor: index === 0 ? brandColors.amber : brandColors.teal,
                boxShadow: 'none',
              }}
            />
            {index < events.length - 1 && (
              <TimelineConnector sx={{ bgcolor: brandColors.border }} />
            )}
          </TimelineSeparator>
          <TimelineContent sx={{ py: 1.5 }}>
            <Typography variant="subtitle2" sx={{
              fontWeight: 700
            }}>
              {event.description}
            </Typography>
            {event.location && (
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                {event.location}
              </Typography>
            )}
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                display: { xs: 'block', sm: 'none' }
              }}>
              {dayjs(event.timestamp).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

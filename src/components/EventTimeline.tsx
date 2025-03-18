
import React from 'react';
import { format } from 'date-fns';
import { Calendar, ChevronRight } from 'lucide-react';
import { Event } from '@/context/EventContext';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface EventTimelineProps {
  events: Event[];
  className?: string;
}

const EventTimeline: React.FC<EventTimelineProps> = ({ events, className }) => {
  // Group events by month/year
  const groupedEvents = events.reduce<Record<string, Event[]>>((acc, event) => {
    const monthYear = format(event.date, 'MMMM yyyy');
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(event);
    return acc;
  }, {});

  // Sort month/year keys chronologically
  const sortedMonthYears = Object.keys(groupedEvents).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  return (
    <div className={className}>
      {sortedMonthYears.map((monthYear) => (
        <div key={monthYear} className="mb-8">
          <h3 className="text-lg font-medium mb-4">{monthYear}</h3>
          <div className="space-y-3">
            {groupedEvents[monthYear]
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((event) => (
                <TimelineEventCard key={event.id} event={event} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

interface TimelineEventCardProps {
  event: Event;
}

const TimelineEventCard: React.FC<TimelineEventCardProps> = ({ event }) => {
  const formattedDate = format(event.date, 'EEE, MMM d');
  const formattedTime = format(event.date, 'h:mm a');
  const isPast = event.date < new Date();
  
  return (
    <Link 
      to={`/events/${event.id}`}
      className={cn(
        "block rounded-lg border shadow-sm p-4 transition-all duration-300",
        "hover:shadow-elevated hover:translate-y-[-2px]",
        isPast ? "bg-muted/50" : "bg-card"
      )}
    >
      <div className="flex items-center space-x-4">
        <div className={cn(
          "w-14 h-14 rounded-lg flex flex-col items-center justify-center text-center border",
          isPast ? "bg-muted" : "bg-primary/5"
        )}>
          <Calendar className={cn(
            "h-5 w-5 mb-0.5",
            isPast ? "text-muted-foreground" : "text-primary"
          )} />
          <span className={cn(
            "text-xs font-medium", 
            isPast ? "text-muted-foreground" : "text-foreground"
          )}>
            {formattedDate}
          </span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            "font-medium text-base truncate",
            isPast && "text-muted-foreground"
          )}>
            {event.title}
          </h4>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <span>{formattedTime}</span>
            <span className="mx-1.5">•</span>
            <span className="truncate">{event.location.name}</span>
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Link>
  );
};

export default EventTimeline;

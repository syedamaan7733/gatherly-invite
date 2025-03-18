
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface EventCardProps {
  event: Event;
  className?: string;
  featured?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, className, featured = false }) => {
  const { id, title, date, location, imageUrl, attendees } = event;
  
  const attendingCount = attendees.filter(a => a.status === 'attending').length;
  const formattedDate = format(date, 'EEE, MMM d, yyyy');
  const formattedTime = format(date, 'h:mm a');

  return (
    <Link 
      to={`/events/${id}`}
      className={cn(
        "group block overflow-hidden rounded-xl bg-card border transition-all duration-300",
        "hover:shadow-elevated hover:translate-y-[-5px]",
        featured ? "md:col-span-2" : "",
        className
      )}
    >
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-medium line-clamp-1">{title}</h3>
        
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <div>
              <span>{formattedDate}</span>
              <span className="mx-1">•</span>
              <span>{formattedTime}</span>
            </div>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{location.name}</span>
          </div>
          
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{attendingCount} attending</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {attendees.slice(0, 3).map((attendee, index) => (
              <div 
                key={attendee.id} 
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium bg-primary/10",
                  attendee.status === 'attending' ? 'bg-green-100 text-green-800' :
                  attendee.status === 'maybe' ? 'bg-yellow-100 text-yellow-800' :
                  attendee.status === 'not-attending' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                )}
              >
                {attendee.name.charAt(0)}
              </div>
            ))}
            {attendees.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center bg-muted text-xs font-medium">
                +{attendees.length - 3}
              </div>
            )}
          </div>
          
          <span className="chip bg-primary/10 text-primary">
            {event.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;

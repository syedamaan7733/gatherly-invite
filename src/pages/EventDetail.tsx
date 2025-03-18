
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Users,
  Share,
  ArrowLeft,
  Edit,
  Trash2,
  Check,
  X,
  HelpCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import { cn } from '@/lib/utils';
import RSVPDashboard from '@/components/RSVPDashboard';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEvent, deleteEvent } = useEvents();
  
  const event = getEvent(id || '');
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-medium mb-4">Event not found</h1>
        <p className="text-muted-foreground mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }
  
  const formattedDate = format(event.date, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(event.date, 'h:mm a');
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      navigate('/events');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Events
          </Link>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-medium">{event.title}</h1>
          
          <div className="flex flex-wrap gap-3">
            <button className="btn-ghost">
              <Share className="h-4 w-4 mr-2" />
              Share
            </button>
            <button className="btn-ghost">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            <button 
              className="btn-ghost text-destructive hover:bg-destructive/10" 
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Image */}
            <div className="rounded-xl overflow-hidden shadow-subtle bg-card">
              {event.imageUrl ? (
                <img 
                  src={event.imageUrl} 
                  alt={event.title} 
                  className="w-full aspect-video object-cover"
                />
              ) : (
                <div className="w-full aspect-video bg-muted flex items-center justify-center">
                  <Calendar className="h-16 w-16 text-muted-foreground/50" />
                </div>
              )}
            </div>
            
            {/* Event Description */}
            <div className="rounded-xl p-6 shadow-subtle bg-card">
              <h2 className="text-xl font-medium mb-3">About this event</h2>
              <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
            </div>
            
            {/* RSVP Dashboard */}
            <RSVPDashboard event={event} />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details Card */}
            <div className="rounded-xl p-6 shadow-subtle bg-card">
              <h2 className="text-xl font-medium mb-4">Event Details</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <Calendar className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <Clock className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <MapPin className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{event.location.name}</p>
                    <p className="text-muted-foreground text-sm">{event.location.address}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <User className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Organizer</p>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <Users className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Visibility</p>
                    <p className="text-muted-foreground">
                      {event.isPublic ? 'Public event' : 'Private event'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RSVP Status Summary */}
            <div className="rounded-xl p-6 shadow-subtle bg-card">
              <h2 className="text-xl font-medium mb-4">RSVP Summary</h2>
              
              <div className="space-y-3">
                <RSVPStatusBar
                  label="Attending"
                  icon={<Check className="h-4 w-4" />}
                  count={event.attendees.filter(a => a.status === 'attending').length}
                  total={event.attendees.length}
                  color="bg-green-500"
                />
                
                <RSVPStatusBar
                  label="Maybe"
                  icon={<HelpCircle className="h-4 w-4" />}
                  count={event.attendees.filter(a => a.status === 'maybe').length}
                  total={event.attendees.length}
                  color="bg-yellow-500"
                />
                
                <RSVPStatusBar
                  label="Not Attending"
                  icon={<X className="h-4 w-4" />}
                  count={event.attendees.filter(a => a.status === 'not-attending').length}
                  total={event.attendees.length}
                  color="bg-red-500"
                />
                
                <RSVPStatusBar
                  label="No Response"
                  icon={<Users className="h-4 w-4" />}
                  count={event.attendees.filter(a => a.status === 'no-response').length}
                  total={event.attendees.length}
                  color="bg-gray-500"
                />
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <button className="btn-primary w-full justify-center">
                Send Invitations
              </button>
              <button className="btn-ghost w-full justify-center">
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface RSVPStatusBarProps {
  label: string;
  icon: React.ReactNode;
  count: number;
  total: number;
  color: string;
}

const RSVPStatusBar: React.FC<RSVPStatusBarProps> = ({ label, icon, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center text-sm font-medium">
          <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mr-2", 
            color.replace('bg-', 'text-').replace('-500', '-700'), 
            'bg-opacity-20'
          )}>
            {icon}
          </div>
          {label}
        </div>
        <span className="text-sm text-muted-foreground">
          {count} / {total}
        </span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default EventDetail;

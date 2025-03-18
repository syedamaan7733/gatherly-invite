
import React, { useState } from 'react';
import { Check, X, HelpCircle, Mail, User, ChevronDown, ChevronUp } from 'lucide-react';
import { useEvents, Event, Attendee } from '@/context/EventContext';
import { cn } from '@/lib/utils';

interface RSVPDashboardProps {
  event: Event;
}

const RSVPDashboard: React.FC<RSVPDashboardProps> = ({ event }) => {
  const { updateAttendee } = useEvents();
  const [expandedAttendee, setExpandedAttendee] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Attendee['status'] | 'all'>('all');
  
  const filteredAttendees = event.attendees.filter(attendee => {
    if (statusFilter === 'all') return true;
    return attendee.status === statusFilter;
  });

  const handleStatusChange = (attendeeId: string, status: Attendee['status']) => {
    updateAttendee(event.id, attendeeId, status);
  };

  const handleNoteChange = (attendeeId: string, notes: string) => {
    const attendee = event.attendees.find(a => a.id === attendeeId);
    if (attendee) {
      updateAttendee(event.id, attendeeId, attendee.status, notes);
    }
  };

  return (
    <div className="rounded-xl shadow-subtle bg-card overflow-hidden">
      <div className="p-6 border-b">
        <h2 className="text-xl font-medium mb-3">RSVP Dashboard</h2>
        <p className="text-muted-foreground">Manage and track responses from your invitees.</p>
      </div>
      
      {/* Filters */}
      <div className="bg-muted/50 p-4 border-b flex items-center justify-between overflow-x-auto">
        <div className="flex space-x-2">
          <StatusFilterButton 
            active={statusFilter === 'all'} 
            onClick={() => setStatusFilter('all')}
          >
            All
          </StatusFilterButton>
          <StatusFilterButton 
            active={statusFilter === 'attending'} 
            onClick={() => setStatusFilter('attending')}
            icon={<Check className="h-3 w-3 mr-1" />}
            color="text-green-600"
          >
            Attending
          </StatusFilterButton>
          <StatusFilterButton 
            active={statusFilter === 'maybe'} 
            onClick={() => setStatusFilter('maybe')}
            icon={<HelpCircle className="h-3 w-3 mr-1" />}
            color="text-yellow-600"
          >
            Maybe
          </StatusFilterButton>
          <StatusFilterButton 
            active={statusFilter === 'not-attending'} 
            onClick={() => setStatusFilter('not-attending')}
            icon={<X className="h-3 w-3 mr-1" />}
            color="text-red-600"
          >
            Not Attending
          </StatusFilterButton>
          <StatusFilterButton 
            active={statusFilter === 'no-response'} 
            onClick={() => setStatusFilter('no-response')}
            icon={<Mail className="h-3 w-3 mr-1" />}
          >
            No Response
          </StatusFilterButton>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {filteredAttendees.length} {filteredAttendees.length === 1 ? 'person' : 'people'}
        </div>
      </div>
      
      {/* Attendee List */}
      <div className="divide-y">
        {filteredAttendees.length > 0 ? (
          filteredAttendees.map((attendee) => (
            <AttendeeItem 
              key={attendee.id}
              attendee={attendee}
              expanded={expandedAttendee === attendee.id}
              onToggleExpand={() => setExpandedAttendee(
                expandedAttendee === attendee.id ? null : attendee.id
              )}
              onStatusChange={(status) => handleStatusChange(attendee.id, status)}
              onNoteChange={(notes) => handleNoteChange(attendee.id, notes)}
            />
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No attendees match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatusFilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}

const StatusFilterButton: React.FC<StatusFilterButtonProps> = ({ 
  active, onClick, children, icon, color 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-xs px-3 py-1.5 rounded-md font-medium flex items-center transition-colors",
        active 
          ? "bg-primary text-primary-foreground" 
          : "bg-background hover:bg-secondary"
      )}
    >
      {icon && <span className={active ? "text-inherit" : color}>{icon}</span>}
      {children}
    </button>
  );
};

interface AttendeeItemProps {
  attendee: Attendee;
  expanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (status: Attendee['status']) => void;
  onNoteChange: (notes: string) => void;
}

const AttendeeItem: React.FC<AttendeeItemProps> = ({
  attendee,
  expanded,
  onToggleExpand,
  onStatusChange,
  onNoteChange,
}) => {
  return (
    <div className={cn(
      "transition-colors",
      expanded ? "bg-muted/30" : "hover:bg-muted/20"
    )}>
      {/* Attendee Summary Row */}
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="font-medium">{attendee.name}</div>
            <div className="text-sm text-muted-foreground">{attendee.email}</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <StatusBadge status={attendee.status} />
          <button className="ml-3 text-muted-foreground">
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-1 animate-fade-in">
          <div className="ml-12 space-y-4">
            {/* Status Controls */}
            <div>
              <label className="text-sm font-medium mb-2 block">Update Status</label>
              <div className="flex flex-wrap gap-2">
                <StatusButton 
                  status="attending"
                  active={attendee.status === 'attending'}
                  onClick={() => onStatusChange('attending')}
                />
                <StatusButton 
                  status="maybe"
                  active={attendee.status === 'maybe'}
                  onClick={() => onStatusChange('maybe')}
                />
                <StatusButton 
                  status="not-attending"
                  active={attendee.status === 'not-attending'}
                  onClick={() => onStatusChange('not-attending')}
                />
                <StatusButton 
                  status="no-response"
                  active={attendee.status === 'no-response'}
                  onClick={() => onStatusChange('no-response')}
                />
              </div>
            </div>
            
            {/* Notes */}
            <div>
              <label htmlFor={`notes-${attendee.id}`} className="text-sm font-medium mb-2 block">
                Notes
              </label>
              <textarea
                id={`notes-${attendee.id}`}
                className="w-full rounded-md border border-input px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder="Add notes about this attendee..."
                value={attendee.notes || ''}
                onChange={(e) => onNoteChange(e.target.value)}
              />
            </div>
            
            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost text-sm py-1.5">
                <Mail className="h-4 w-4 mr-1.5" />
                Send Reminder
              </button>
              <button className="btn-ghost text-sm py-1.5">
                Remove Invitee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: Attendee['status'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  let icon = <Mail className="h-3 w-3 mr-1" />;
  let label = 'No Response';
  
  if (status === 'attending') {
    bgColor = 'bg-green-100 text-green-800';
    icon = <Check className="h-3 w-3 mr-1" />;
    label = 'Attending';
  } else if (status === 'maybe') {
    bgColor = 'bg-yellow-100 text-yellow-800';
    icon = <HelpCircle className="h-3 w-3 mr-1" />;
    label = 'Maybe';
  } else if (status === 'not-attending') {
    bgColor = 'bg-red-100 text-red-800';
    icon = <X className="h-3 w-3 mr-1" />;
    label = 'Not Attending';
  }
  
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      bgColor
    )}>
      {icon}
      {label}
    </span>
  );
};

interface StatusButtonProps {
  status: Attendee['status'];
  active: boolean;
  onClick: () => void;
}

const StatusButton: React.FC<StatusButtonProps> = ({ status, active, onClick }) => {
  let baseClasses = "px-3 py-1.5 rounded-md text-sm font-medium flex items-center transition-all";
  let icon, label, activeClasses, inactiveClasses;
  
  if (status === 'attending') {
    icon = <Check className="h-4 w-4 mr-1.5" />;
    label = 'Attending';
    activeClasses = "bg-green-100 text-green-800 border-green-300";
    inactiveClasses = "bg-white border-gray-300 hover:bg-green-50 text-gray-700 hover:text-green-800";
  } else if (status === 'maybe') {
    icon = <HelpCircle className="h-4 w-4 mr-1.5" />;
    label = 'Maybe';
    activeClasses = "bg-yellow-100 text-yellow-800 border-yellow-300";
    inactiveClasses = "bg-white border-gray-300 hover:bg-yellow-50 text-gray-700 hover:text-yellow-800";
  } else if (status === 'not-attending') {
    icon = <X className="h-4 w-4 mr-1.5" />;
    label = 'Not attending';
    activeClasses = "bg-red-100 text-red-800 border-red-300";
    inactiveClasses = "bg-white border-gray-300 hover:bg-red-50 text-gray-700 hover:text-red-800";
  } else {
    icon = <Mail className="h-4 w-4 mr-1.5" />;
    label = 'No response';
    activeClasses = "bg-gray-100 text-gray-800 border-gray-300";
    inactiveClasses = "bg-white border-gray-300 hover:bg-gray-50 text-gray-700";
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        "border",
        active ? activeClasses : inactiveClasses
      )}
    >
      {icon}
      {label}
    </button>
  );
};

export default RSVPDashboard;

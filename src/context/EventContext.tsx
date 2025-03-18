
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Attendee = {
  id: string;
  name: string;
  email: string;
  status: 'attending' | 'not-attending' | 'maybe' | 'no-response';
  notes?: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate?: Date;
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  imageUrl?: string;
  organizer: string;
  isPublic: boolean;
  attendees: Attendee[];
  createdAt: Date;
};

interface EventContextProps {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
  updateAttendee: (eventId: string, attendeeId: string, status: Attendee['status'], notes?: string) => void;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

// Sample data
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Design Workshop',
    description: 'Join us for an interactive design workshop focused on UI/UX principles and practices.',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    location: {
      name: 'Creative Studio',
      address: '123 Design Boulevard, Artville, CA 94103',
      coordinates: {
        lat: 37.7749,
        lng: -122.4194,
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1529119513321-989c92a82849?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    organizer: 'Design Academy',
    isPublic: true,
    attendees: [
      { id: 'a1', name: 'Alex Johnson', email: 'alex@example.com', status: 'attending' },
      { id: 'a2', name: 'Morgan Smith', email: 'morgan@example.com', status: 'maybe' },
      { id: 'a3', name: 'Jordan Lee', email: 'jordan@example.com', status: 'no-response' },
    ],
    createdAt: new Date(new Date().setDate(new Date().getDate() - 14)),
  },
  {
    id: '2',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference featuring the latest innovations and industry leaders.',
    date: new Date(new Date().setDate(new Date().getDate() + 21)),
    location: {
      name: 'Convention Center',
      address: '456 Innovation Way, Techville, CA 95113',
      coordinates: {
        lat: 37.3382,
        lng: -121.8863,
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    organizer: 'Tech Institute',
    isPublic: true,
    attendees: [
      { id: 'b1', name: 'Taylor Brown', email: 'taylor@example.com', status: 'attending' },
      { id: 'b2', name: 'Jamie Wilson', email: 'jamie@example.com', status: 'attending' },
      { id: 'b3', name: 'Casey Miller', email: 'casey@example.com', status: 'not-attending' },
      { id: 'b4', name: 'Riley Garcia', email: 'riley@example.com', status: 'no-response' },
    ],
    createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
  },
  {
    id: '3',
    title: 'Product Launch Party',
    description: 'Join us for the exciting reveal of our newest product line and networking opportunities.',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    location: {
      name: 'Skyline Lounge',
      address: '789 Elevation Drive, Viewpoint, CA 90210',
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
    },
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    organizer: 'Innovate Inc.',
    isPublic: false,
    attendees: [
      { id: 'c1', name: 'Pat Davis', email: 'pat@example.com', status: 'attending' },
      { id: 'c2', name: 'Quinn Jones', email: 'quinn@example.com', status: 'maybe' },
      { id: 'c3', name: 'Reese Martin', email: 'reese@example.com', status: 'attending' },
    ],
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)),
  },
];

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(sampleEvents);

  const addEvent = (event: Omit<Event, 'id' | 'createdAt'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const updateEvent = (id: string, updatedEvent: Partial<Event>) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const updateAttendee = (eventId: string, attendeeId: string, status: Attendee['status'], notes?: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id !== eventId) return event;
        
        const updatedAttendees = event.attendees.map((attendee) => {
          if (attendee.id !== attendeeId) return attendee;
          return { ...attendee, status, notes: notes || attendee.notes };
        });
        
        return { ...event, attendees: updatedAttendees };
      })
    );
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEvent, updateAttendee }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

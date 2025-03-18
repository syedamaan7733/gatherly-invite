
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/EventCard';
import EventTimeline from '@/components/EventTimeline';
import { Plus, Calendar, List, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'timeline';
type FilterOption = 'all' | 'upcoming' | 'past' | 'public' | 'private';

const Events = () => {
  const { events } = useEvents();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredEvents = events.filter(event => {
    // Apply search filter
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filter === 'upcoming') {
      return event.date > new Date();
    } else if (filter === 'past') {
      return event.date <= new Date();
    } else if (filter === 'public') {
      return event.isPublic;
    } else if (filter === 'private') {
      return !event.isPublic;
    }
    
    return true;
  });
  
  // Sort events by date, newest first
  const sortedEvents = [...filteredEvents].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-medium">Your Events</h1>
          
          <Link to="/create" className="btn-primary inline-flex md:self-start">
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </div>
        
        {/* Filters and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:ring-1 focus:ring-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* View Toggles */}
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2 hidden sm:inline">View:</span>
              <div className="bg-muted rounded-md p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === 'grid' ? "bg-card shadow-sm" : "hover:bg-muted-foreground/10"
                  )}
                  aria-label="Grid view"
                >
                  <Calendar className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={cn(
                    "rounded-md p-2 transition-colors",
                    viewMode === 'timeline' ? "bg-card shadow-sm" : "hover:bg-muted-foreground/10"
                  )}
                  aria-label="Timeline view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <div className="text-sm text-muted-foreground flex items-center mr-1">
              <Filter className="h-4 w-4 mr-1.5" />
              Filter:
            </div>
            <FilterPill 
              active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All Events
            </FilterPill>
            <FilterPill 
              active={filter === 'upcoming'} 
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </FilterPill>
            <FilterPill 
              active={filter === 'past'} 
              onClick={() => setFilter('past')}
            >
              Past
            </FilterPill>
            <FilterPill 
              active={filter === 'public'} 
              onClick={() => setFilter('public')}
            >
              Public
            </FilterPill>
            <FilterPill 
              active={filter === 'private'} 
              onClick={() => setFilter('private')}
            >
              Private
            </FilterPill>
          </div>
        </div>
        
        {/* Events Display */}
        {sortedEvents.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EventTimeline events={sortedEvents} />
          )
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-xl border shadow-sm">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-medium">No events found</h3>
            <p className="mt-2 text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search terms or filters." 
                : "Create your first event to get started."}
            </p>
            <Link to="/create" className="btn-primary inline-flex mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const FilterPill: React.FC<FilterPillProps> = ({ active, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
        active 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      )}
    >
      {children}
    </button>
  );
};

export default Events;

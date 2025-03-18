
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, ArrowRight, Clock, User, Map } from 'lucide-react';
import { useEvents } from '@/context/EventContext';
import EventCard from '@/components/EventCard';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { events } = useEvents();
  
  // Get next 3 events
  const upcomingEvents = [...events]
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .filter(event => event.date > new Date())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="max-w-xl">
              <div className="chip bg-primary/10 text-primary mb-4">
                Simplified Event Management
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
                Create, Manage, and Share Events Effortlessly
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                An intuitive platform for organizing gatherings, tracking RSVPs, and connecting with attendees in one elegant space.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/create" className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create an Event
                </Link>
                <Link to="/events" className="btn-ghost">
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative">
            <div className="relative rounded-xl overflow-hidden shadow-prominent aspect-video">
              <img 
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3269&q=80" 
                alt="People at an event" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-transparent mix-blend-overlay" />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -bottom-6 -left-6 glassmorphism rounded-xl p-4 shadow-elevated animate-fade-in w-48">
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Event Details</span>
              </div>
              <p className="text-sm text-muted-foreground">Manage your events with ease</p>
            </div>
            
            <div className="absolute -top-6 -right-6 glassmorphism rounded-xl p-4 shadow-elevated animate-fade-in w-48">
              <div className="flex items-center mb-2">
                <User className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">RSVP Tracking</span>
              </div>
              <p className="text-sm text-muted-foreground">See who's attending at a glance</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium mb-4">Streamlined Event Management</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Our platform simplifies every aspect of event planning and organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Calendar className="h-6 w-6 text-primary" />}
              title="Event Creation Wizard" 
              description="Create beautiful events in minutes with our step-by-step wizard. Add details, location, and invite attendees seamlessly."
            />
            <FeatureCard 
              icon={<User className="h-6 w-6 text-primary" />}
              title="RSVP Tracking" 
              description="Easily manage attendees with visual indicators showing who's attending, maybe attending, or can't make it."
            />
            <FeatureCard 
              icon={<Clock className="h-6 w-6 text-primary" />}
              title="Event Timeline" 
              description="View your events chronologically with our intuitive timeline, making it easy to stay organized."
            />
            <FeatureCard 
              icon={<Map className="h-6 w-6 text-primary" />}
              title="Location Selection" 
              description="Find the perfect venue with integrated mapping, allowing you to search and select locations with precision."
            />
            <FeatureCard 
              icon={<Plus className="h-6 w-6 text-primary" />}
              title="Media Upload" 
              description="Add images and videos to your events with simple drag-and-drop functionality."
            />
            <FeatureCard 
              icon={<ArrowRight className="h-6 w-6 text-primary" />}
              title="Intuitive Interface" 
              description="Navigate through the platform with ease thanks to our clean, minimal interface designed for simplicity."
            />
          </div>
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-medium">Upcoming Events</h2>
            <Link to="/events" className="flex items-center text-primary hover:underline">
              View all
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
      
      {/* CTA Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 mask-linear-gradient-to-r" />
        <div className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Ready to create your first event?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Start organizing memorable gatherings with our intuitive event creation platform. It only takes a few minutes to get started.
          </p>
          <Link to="/create" className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create an Event
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-t">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="text-lg font-medium">Gatherly</span>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Gatherly. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card rounded-xl p-6 border shadow-subtle hover:shadow-elevated transition-all duration-300">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;

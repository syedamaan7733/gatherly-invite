
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CreateEventWizard from '@/components/CreateEventWizard';

const CreateEvent = () => {
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-medium">Create New Event</h1>
          <p className="mt-2 text-muted-foreground">
            Use the wizard below to set up your event details, location, and invitees.
          </p>
        </div>
        
        {/* Wizard */}
        <CreateEventWizard />
      </div>
    </div>
  );
};

export default CreateEvent;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Users,
  Image,
  Info,
  Upload,
  X,
  Clock,
} from 'lucide-react';
import { useEvents } from '@/context/EventContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Define the steps
type WizardStep = 'details' | 'location' | 'datetime' | 'media' | 'invitees' | 'review';

interface EventFormData {
  title: string;
  description: string;
  isPublic: boolean;
  location: {
    name: string;
    address: string;
  };
  date: Date;
  endDate?: Date;
  imageUrl?: string;
  organizer: string;
  attendees: Array<{
    id: string;
    name: string;
    email: string;
    status: 'no-response';
  }>;
}

const CreateEventWizard: React.FC = () => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    isPublic: true,
    location: {
      name: '',
      address: '',
    },
    date: new Date(),
    organizer: 'You',
    attendees: [],
  });
  
  // For storing invitee form input
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      }
    }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'date') {
      const [year, month, day] = value.split('-').map(Number);
      const newDate = new Date(formData.date);
      newDate.setFullYear(year, month - 1, day);
      
      setFormData(prev => ({
        ...prev,
        date: newDate,
      }));
    } else if (name === 'time') {
      const [hours, minutes] = value.split(':').map(Number);
      const newDate = new Date(formData.date);
      newDate.setHours(hours, minutes);
      
      setFormData(prev => ({
        ...prev,
        date: newDate,
      }));
    }
  };
  
  const addInvitee = () => {
    if (inviteeName.trim() && inviteeEmail.trim()) {
      setFormData(prev => ({
        ...prev,
        attendees: [
          ...prev.attendees,
          {
            id: crypto.randomUUID(),
            name: inviteeName.trim(),
            email: inviteeEmail.trim(),
            status: 'no-response',
          }
        ]
      }));
      setInviteeName('');
      setInviteeEmail('');
    }
  };
  
  const removeInvitee = (id: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee.id !== id)
    }));
  };
  
  const handlePublicToggle = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      isPublic: value
    }));
  };
  
  const handleSubmit = () => {
    addEvent(formData);
    navigate('/events');
  };
  
  const goToNextStep = () => {
    if (currentStep === 'details') setCurrentStep('datetime');
    else if (currentStep === 'datetime') setCurrentStep('location');
    else if (currentStep === 'location') setCurrentStep('media');
    else if (currentStep === 'media') setCurrentStep('invitees');
    else if (currentStep === 'invitees') setCurrentStep('review');
  };
  
  const goToPreviousStep = () => {
    if (currentStep === 'datetime') setCurrentStep('details');
    else if (currentStep === 'location') setCurrentStep('datetime');
    else if (currentStep === 'media') setCurrentStep('location');
    else if (currentStep === 'invitees') setCurrentStep('media');
    else if (currentStep === 'review') setCurrentStep('invitees');
  };
  
  const isStepComplete = () => {
    if (currentStep === 'details') {
      return !!formData.title && !!formData.description;
    } else if (currentStep === 'datetime') {
      return !!formData.date;
    } else if (currentStep === 'location') {
      return !!formData.location.name && !!formData.location.address;
    }
    // Other steps are optional
    return true;
  };
  
  // Example image URLs for the media step
  const sampleImageUrls = [
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3269&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80',
  ];
  
  return (
    <div className="bg-card rounded-xl border shadow-elevated">
      {/* Steps Progress Bar */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <StepIndicator
            isActive={currentStep === 'details'}
            isCompleted={currentStep !== 'details' && !!formData.title}
            icon={<Info className="h-4 w-4" />}
            label="Details"
          />
          <StepConnector isCompleted={currentStep !== 'details'} />
          
          <StepIndicator
            isActive={currentStep === 'datetime'}
            isCompleted={currentStep !== 'details' && currentStep !== 'datetime'}
            icon={<Clock className="h-4 w-4" />}
            label="Date & Time"
          />
          <StepConnector isCompleted={currentStep !== 'details' && currentStep !== 'datetime'} />
          
          <StepIndicator
            isActive={currentStep === 'location'}
            isCompleted={currentStep !== 'details' && currentStep !== 'datetime' && currentStep !== 'location'}
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
          />
          <StepConnector isCompleted={currentStep !== 'details' && currentStep !== 'datetime' && currentStep !== 'location'} />
          
          <StepIndicator
            isActive={currentStep === 'media'}
            isCompleted={currentStep !== 'details' && currentStep !== 'datetime' && currentStep !== 'location' && currentStep !== 'media'}
            icon={<Image className="h-4 w-4" />}
            label="Media"
          />
          <StepConnector isCompleted={currentStep !== 'details' && currentStep !== 'datetime' && currentStep !== 'location' && currentStep !== 'media'} />
          
          <StepIndicator
            isActive={currentStep === 'invitees'}
            isCompleted={currentStep === 'review'}
            icon={<Users className="h-4 w-4" />}
            label="Invitees"
          />
          <StepConnector isCompleted={currentStep === 'review'} />
          
          <StepIndicator
            isActive={currentStep === 'review'}
            isCompleted={false}
            icon={<Calendar className="h-4 w-4" />}
            label="Review"
          />
        </div>
      </div>
      
      {/* Form Content */}
      <div className="p-6">
        {/* Details Step */}
        {currentStep === 'details' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Event Details</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Event Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleDetailsChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Product Launch Party"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleDetailsChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary h-32"
                  placeholder="Describe your event..."
                />
              </div>
              
              <div>
                <label htmlFor="organizer" className="block text-sm font-medium mb-2">
                  Organizer
                </label>
                <input
                  type="text"
                  id="organizer"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleDetailsChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Your Name or Organization"
                />
              </div>
              
              <div>
                <span className="block text-sm font-medium mb-2">Visibility</span>
                <div className="flex space-x-4">
                  <div
                    onClick={() => handlePublicToggle(true)}
                    className={cn(
                      "relative flex-1 p-4 rounded-md border cursor-pointer transition-all",
                      formData.isPublic ? "border-primary bg-primary/5" : "border-input hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Public</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        formData.isPublic ? "bg-primary text-white" : "border border-input"
                      )}>
                        {formData.isPublic && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Anyone can discover and attend this event
                    </p>
                  </div>
                  
                  <div
                    onClick={() => handlePublicToggle(false)}
                    className={cn(
                      "relative flex-1 p-4 rounded-md border cursor-pointer transition-all",
                      !formData.isPublic ? "border-primary bg-primary/5" : "border-input hover:border-muted-foreground"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium">Private</span>
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center",
                        !formData.isPublic ? "bg-primary text-white" : "border border-input"
                      )}>
                        {!formData.isPublic && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Only invited people can see and attend
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Date & Time Step */}
        {currentStep === 'datetime' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Date & Time</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">
                  Event Date <span className="text-destructive">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={format(formData.date, 'yyyy-MM-dd')}
                  onChange={handleDateChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  Start Time <span className="text-destructive">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={format(formData.date, 'HH:mm')}
                  onChange={handleDateChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                />
              </div>
              
              <div className="p-4 bg-muted/30 rounded-md border">
                <h3 className="font-medium mb-2">Scheduling Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Weekends typically have higher attendance rates.
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Evening events (after 6 PM) work well for professional gatherings.
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    Consider time zones if you have attendees from different regions.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Location Step */}
        {currentStep === 'location' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Event Location</h2>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="locationName" className="block text-sm font-medium mb-2">
                  Venue Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="locationName"
                  name="name"
                  value={formData.location.name}
                  onChange={handleLocationChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                  placeholder="e.g., Conference Center"
                />
              </div>
              
              <div>
                <label htmlFor="locationAddress" className="block text-sm font-medium mb-2">
                  Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="locationAddress"
                  name="address"
                  value={formData.location.address}
                  onChange={handleLocationChange}
                  className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                  placeholder="Full address"
                />
              </div>
              
              {/* Map Placeholder */}
              <div className="border rounded-md h-64 bg-muted flex items-center justify-center">
                <div className="text-center p-4">
                  <MapPin className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    Interactive map will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Media Step */}
        {currentStep === 'media' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Event Media</h2>
            
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-muted rounded-md p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-muted-foreground mb-4">
                  Drag and drop an image here, or click to select a file
                </p>
                <button className="btn-ghost text-sm inline-flex">
                  Select Image
                </button>
              </div>
              
              {/* Image Gallery */}
              <div>
                <h3 className="text-sm font-medium mb-3">Or choose from gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {sampleImageUrls.map((url, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "aspect-video rounded-md overflow-hidden cursor-pointer border-2 transition-all",
                        formData.imageUrl === url ? "border-primary" : "border-transparent hover:border-muted-foreground/30"
                      )}
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    >
                      <img 
                        src={url} 
                        alt={`Gallery image ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              
              </div>
              
              {/* Selected Image Preview */}
              {formData.imageUrl && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Selected Image</h3>
                  <div className="relative aspect-video rounded-md overflow-hidden">
                    <img 
                      src={formData.imageUrl} 
                      alt="Selected event image"
                      className="w-full h-full object-cover"
                    />
                    <button 
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: undefined }))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Invitees Step */}
        {currentStep === 'invitees' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Invite People</h2>
            
            <div className="space-y-6">
              {/* Add Invitee Form */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="inviteeName" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="inviteeName"
                    value={inviteeName}
                    onChange={(e) => setInviteeName(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="flex-1">
                  <label htmlFor="inviteeEmail" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="inviteeEmail"
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                    className="w-full rounded-md border border-input px-3 py-2 focus:ring-1 focus:ring-primary"
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="self-end">
                  <button 
                    className="btn-primary w-full md:w-auto py-2"
                    onClick={addInvitee}
                    disabled={!inviteeName.trim() || !inviteeEmail.trim()}
                  >
                    Add Invitee
                  </button>
                </div>
              </div>
              
              {/* Invitee List */}
              <div>
                <h3 className="text-sm font-medium mb-3">
                  Invitees ({formData.attendees.length})
                </h3>
                
                {formData.attendees.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {formData.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center justify-between p-3">
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-sm text-muted-foreground">{attendee.email}</div>
                        </div>
                        <button 
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => removeInvitee(attendee.id)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md bg-muted/30">
                    <Users className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">No invitees added yet</p>
                    <p className="text-sm text-muted-foreground">
                      Add people to your event using the form above
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-muted/30 rounded-md border">
                <h3 className="font-medium mb-2">Invitation Options</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You'll be able to customize and send invitations after creating the event.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Step */}
        {currentStep === 'review' && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-medium mb-6">Review Event</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Details Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Event Details</h3>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Title</div>
                    <div>{formData.title}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Description</div>
                    <div className="line-clamp-3">{formData.description}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Organizer</div>
                    <div>{formData.organizer}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Visibility</div>
                    <div>{formData.isPublic ? 'Public' : 'Private'}</div>
                  </div>
                </div>
                
                {/* Date, Time, Location */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Date, Time & Location</h3>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Date</div>
                    <div>{format(formData.date, 'EEEE, MMMM d, yyyy')}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Time</div>
                    <div>{format(formData.date, 'h:mm a')}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Venue</div>
                    <div>{formData.location.name}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Address</div>
                    <div>{formData.location.address}</div>
                  </div>
                </div>
              </div>
              
              {/* Preview Image */}
              {formData.imageUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Event Image</h3>
                  <div className="aspect-video rounded-md overflow-hidden w-full max-w-md">
                    <img 
                      src={formData.imageUrl} 
                      alt="Event preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Invitees Summary */}
              <div>
                <h3 className="text-lg font-medium mb-3">Invitees</h3>
                
                {formData.attendees.length > 0 ? (
                  <div className="border rounded-md divide-y max-h-48 overflow-y-auto">
                    {formData.attendees.map((attendee) => (
                      <div key={attendee.id} className="flex items-center p-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary mr-2">
                          {attendee.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{attendee.name}</div>
                          <div className="text-xs text-muted-foreground">{attendee.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No invitees added yet. You can add them later.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Buttons */}
      <div className="p-6 border-t flex justify-between">
        {currentStep !== 'details' ? (
          <button
            className="btn-ghost"
            onClick={goToPreviousStep}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain flex layout
        )}
        
        {currentStep !== 'review' ? (
          <button
            className="btn-primary"
            onClick={goToNextStep}
            disabled={!isStepComplete()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            Create Event
            <Check className="h-4 w-4 ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

interface StepIndicatorProps {
  isActive: boolean;
  isCompleted: boolean;
  icon: React.ReactNode;
  label: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ isActive, isCompleted, icon, label }) => {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors relative",
        isActive ? "bg-primary text-primary-foreground" :
          isCompleted ? "bg-primary/20 text-primary" :
            "bg-muted text-muted-foreground"
      )}>
        {isCompleted ? <Check className="h-5 w-5" /> : icon}
      </div>
      <span className={cn(
        "text-xs mt-1.5 font-medium",
        isActive ? "text-foreground" : "text-muted-foreground"
      )}>
        {label}
      </span>
    </div>
  );
};

interface StepConnectorProps {
  isCompleted: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ isCompleted }) => {
  return (
    <div className="relative flex-1 mx-1">
      <div className="absolute top-5 inset-x-0">
        <div className={cn(
          "h-[2px] w-full",
          isCompleted ? "bg-primary" : "bg-muted"
        )} />
      </div>
    </div>
  );
};

export default CreateEventWizard;

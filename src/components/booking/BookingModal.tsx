import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Clock, Calendar as CalendarIcon, User } from 'lucide-react';

type Service = {
  id: string;
  title: string;
  description?: string;
  price_per_hour: number;
  duration_minutes: number;
};

type Helpanion = {
  id: string;
  display_name: string;
  avatar_url?: string;
  services: Service[];
};

type BookingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  helpanion: Helpanion;
};

type BookingStep = 'service' | 'availability' | 'details' | 'confirm';

export function BookingModal({ open, onOpenChange, helpanion }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [seekerName, setSeekerName] = useState('');
  const [seekerEmail, setSeekerEmail] = useState('');
  const [notes, setNotes] = useState('');

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when closing
    setStep('service');
    setSelectedService(null);
    setSelectedDate(undefined);
    setSelectedTime('');
    setSeekerName('');
    setSeekerEmail('');
    setNotes('');
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep('availability');
  };

  const handleAvailabilitySelect = () => {
    if (selectedDate && selectedTime) {
      setStep('details');
    }
  };

  const handleBookingSubmit = () => {
    // TODO: Submit booking to backend
    console.log('Booking submitted:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      seeker: { name: seekerName, email: seekerEmail },
      notes
    });
    setStep('confirm');
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {['service', 'availability', 'details', 'confirm'].map((stepName, index) => (
        <div key={stepName} className="flex items-center">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName 
                ? 'bg-[#01796F] text-white' 
                : index < ['service', 'availability', 'details', 'confirm'].indexOf(step)
                  ? 'text-white'
                  : 'bg-gray-200 text-gray-500'
            }`}
            style={index < ['service', 'availability', 'details', 'confirm'].indexOf(step) ? { backgroundColor: '#193232' } : {}}
          >
            {index + 1}
          </div>
          {index < 3 && (
            <div 
              className={`w-8 h-0.5 ${
                index < ['service', 'availability', 'details', 'confirm'].indexOf(step)
                  ? ''
                  : 'bg-gray-200'
              }`}
              style={index < ['service', 'availability', 'details', 'confirm'].indexOf(step) ? { backgroundColor: '#193232' } : {}}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-heading">
            Book a Session with {helpanion.display_name}
          </DialogTitle>
        </DialogHeader>

        {renderStepIndicator()}

        {step === 'service' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select a Service</h3>
            <div className="grid gap-3">
              {helpanion.services.map((service) => (
                <Card 
                  key={service.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleServiceSelect(service)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{service.title}</h4>
                        {service.description && (
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {service.duration_minutes} mins
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{service.price_per_hour}</div>
                        <div className="text-sm text-gray-500">per hour</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'availability' && selectedService && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Choose Date</h4>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Available Times</h4>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className="h-10"
                      onClick={() => setSelectedTime(time)}
                      style={selectedTime === time ? { backgroundColor: '#01796F' } : {}}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Button 
              onClick={handleAvailabilitySelect}
              disabled={!selectedDate || !selectedTime}
              className="w-full mt-4"
              style={{ backgroundColor: '#01796F' }}
            >
              Continue to Details
            </Button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <Input
                  value={seekerName}
                  onChange={(e) => setSeekerName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <Input
                  type="email"
                  value={seekerEmail}
                  onChange={(e) => setSeekerEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Additional Notes (Optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything you'd like the helpanion to know before the session?"
                  rows={3}
                />
              </div>
            </div>
            <Button 
              onClick={handleBookingSubmit}
              disabled={!seekerName || !seekerEmail}
              className="w-full mt-4"
              style={{ backgroundColor: '#01796F' }}
            >
              Confirm Booking
            </Button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: 'rgba(25, 50, 50, 0.1)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#193232' }}>
                <span className="text-white text-lg">✓</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h4 className="font-medium mb-2">Session Details:</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Service:</strong> {selectedService?.title}</p>
                <p><strong>Date:</strong> {selectedDate?.toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTime}</p>
                <p><strong>Duration:</strong> {selectedService?.duration_minutes} minutes</p>
                <p><strong>Price:</strong> ₹{selectedService?.price_per_hour}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You'll receive a confirmation email shortly. The helpanion will contact you before the session.
            </p>
            <Button 
              onClick={handleClose}
              className="w-full"
              style={{ backgroundColor: '#01796F' }}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
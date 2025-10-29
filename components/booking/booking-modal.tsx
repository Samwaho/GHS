'use client';

import { useEffect, useMemo, useState } from 'react';

import { useTRPC } from '@/trpc/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, DollarSign, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';
import { UploadcareUploader } from '@/components/ui/uploadcare-uploader';
import { formatKES } from '@/lib/currency';
import {
  BOOKING_LOOKAHEAD_DAYS,
  BOOKING_MIN_LEAD_TIME_MINUTES,
} from '@/lib/booking-config';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceTitle: string;
  serviceDuration: number;
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  serviceId, 
  serviceTitle, 
  serviceDuration 
}: BookingModalProps) {
  const { data: session } = useSession();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentUuid, setAttachmentUuid] = useState('');
  const [giftVoucherCode, setGiftVoucherCode] = useState('');

  const t = useTRPC();
  const { data: branches } = useQuery(t.public.getBranches.queryOptions());
  const { data: branchServices, isFetching: branchServicesLoading } = useQuery({
    ...t.public.getBranchServices.queryOptions({ branchId: selectedBranch }),
    enabled: !!selectedBranch,
  });
  const { data: availabilityData, isFetching: availabilityLoading } = useQuery({
    ...t.public.getAvailableBookingSlots.queryOptions({
      branchId: selectedBranch,
      serviceId,
      date: selectedDate,
    }),
    enabled: Boolean(selectedBranch && selectedDate),
    staleTime: 60 * 1000,
  });

  const createBookingMutation = useMutation(t.user.createBooking.mutationOptions());
  
  type Branch = NonNullable<typeof branches>[number];
  type BranchService = NonNullable<typeof branchServices>[number];

  const branchesList = branches ?? [];
  const branchServicesList = branchServices ?? [];
  const currentService = branchServicesList.find((branchService: BranchService) => branchService.service.id === serviceId);
  const displayedDuration = currentService?.service?.duration ?? serviceDuration;
  const showServiceUnavailable = selectedBranch && !branchServicesLoading && !currentService;
  const availableSlots = useMemo(
    () => availabilityData?.availableSlots ?? [],
    [availabilityData]
  );
  const fullyBooked = availabilityData?.isFullyBooked && !availabilityLoading;
  const canSubmit =
    !!currentService &&
    !!selectedBranch &&
    !!selectedDate &&
    !!selectedTime;
  
  // Generate next set of days for date selection
  const availableDates = useMemo(() => Array.from({ length: BOOKING_LOOKAHEAD_DAYS }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      value: format(date, 'yyyy-MM-dd'),
      label: format(date, 'EEEE, MMMM d')
    };
  }), []);

  useEffect(() => {
    setSelectedTime('');
  }, [selectedBranch, selectedDate]);

  useEffect(() => {
    if (selectedTime && !availableSlots.includes(selectedTime)) {
      setSelectedTime('');
    }
  }, [availableSlots, selectedTime]);

  const handleFileUpload = (result: { cdnUrl: string; uuid: string }) => {
    setAttachmentUrl(result.cdnUrl);
    setAttachmentUuid(result.uuid);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) {
      toast.error('Please sign in to book an appointment');
      return;
    }
    
    if (!selectedBranch || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!currentService) {
      toast.error('This treatment is not available at the selected branch.');
      return;
    }
    
    try {
      // Combine date and time into a single DateTime
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

      await createBookingMutation.mutateAsync({
        serviceId,
        branchId: selectedBranch,
        scheduledAt,
        notes: notes || undefined,
        attachmentUrl: attachmentUrl || undefined,
        attachmentUuid: attachmentUuid || undefined,
        giftVoucherCode: giftVoucherCode || undefined
      });
      
      toast.success('Booking created successfully!');
      onClose();
      
      // Reset form
      setSelectedBranch('');
      setSelectedDate('');
      setSelectedTime('');
      setNotes('');
      setAttachmentUrl('');
      setAttachmentUuid('');
      setGiftVoucherCode('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create booking';
      toast.error(message);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setSelectedBranch('');
    setSelectedDate('');
    setSelectedTime('');
    setNotes('');
    setAttachmentUrl('');
    setAttachmentUuid('');
    setGiftVoucherCode('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Book {serviceTitle}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 py-2">
          <div className="space-y-2">
            <Label htmlFor="branch">Select Branch *</Label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a location" />
              </SelectTrigger>
              <SelectContent>
                {branchesList.map((branch: Branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {branch.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showServiceUnavailable && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              This treatment is not currently offered at the selected branch. Please choose a different branch.
            </div>
          )}

          {currentService && (
            <div className="bg-amber-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-800">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="font-semibold">{formatKES(currentService.price)}</span>
                </div>
                <div className="flex items-center text-amber-700">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{displayedDuration} minutes</span>
                </div>
              </div>
            </div>
          )}

          {/* Gift Voucher Section */}
          <div className="space-y-2">
            <Label htmlFor="giftVoucher" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Gift Voucher Code (Optional)
            </Label>
            <Input
              id="giftVoucher"
              type="text"
              value={giftVoucherCode}
              onChange={(e) => setGiftVoucherCode(e.target.value)}
              placeholder="Enter gift voucher code"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Select Date *</Label>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {date.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Select Time *</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger disabled={!selectedBranch || !selectedDate}>
                <SelectValue placeholder={!selectedBranch || !selectedDate ? 'Select branch & date first' : 'Choose a time'} />
              </SelectTrigger>
              <SelectContent>
                {!selectedBranch || !selectedDate ? (
                  <SelectItem value="placeholder" disabled>
                    Select a branch and date to view availability
                  </SelectItem>
                ) : availabilityLoading ? (
                  <SelectItem value="loading" disabled>
                    Checking availability...
                  </SelectItem>
                ) : availableSlots.length === 0 ? (
                  <SelectItem value="unavailable" disabled>
                    {fullyBooked ? 'All appointments are booked for this day' : 'No available slots found'}
                  </SelectItem>
                ) : (
                  availableSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Appointments must be booked at least {BOOKING_MIN_LEAD_TIME_MINUTES / 60} hours in advance.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Reference Image/Document (Optional)</Label>
            <p className="text-xs text-gray-500">
              Upload a reference image or document to help us understand your requirements better.
            </p>
            <UploadcareUploader
              onUpload={handleFileUpload}
              preview={attachmentUrl}
              maxSize={5}
              compact={true}
            />
          </div>

          <div className="flex space-x-3 pt-3 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBookingMutation.isPending || !canSubmit}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-60"
            >
              {createBookingMutation.isPending ? 'Booking...' : 'Book Now'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { lazy, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Lazy load dashboard components for better performance
export const LazyHelpanionProfile = lazy(() => import('@/components/helpanion/HelpanionProfile').then(module => ({ default: module.HelpanionProfile })));
export const LazyHelpanionServices = lazy(() => import('@/components/helpanion/HelpanionServices').then(module => ({ default: module.HelpanionServices })));
export const LazyHelpanionAvailability = lazy(() => import('@/components/helpanion/HelpanionAvailability').then(module => ({ default: module.HelpanionAvailability })));
export const LazyHelpanionBookings = lazy(() => import('@/components/helpanion/HelpanionBookings').then(module => ({ default: module.HelpanionBookings })));
export const LazyHelpanionReviews = lazy(() => import('@/components/helpanion/HelpanionReviews').then(module => ({ default: module.HelpanionReviews })));
export const LazyHelpanionSettings = lazy(() => import('@/components/helpanion/HelpanionSettings').then(module => ({ default: module.HelpanionSettings })));

// Loading component for suspense fallback
export const ComponentLoader = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-center h-32">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Wrapper components with suspense
export const HelpanionProfileWrapper = (props: any) => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionProfile {...props} />
  </Suspense>
);

export const HelpanionServicesWrapper = (props: any) => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionServices {...props} />
  </Suspense>
);

export const HelpanionAvailabilityWrapper = (props: any) => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionAvailability {...props} />
  </Suspense>
);

export const HelpanionBookingsWrapper = () => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionBookings />
  </Suspense>
);

export const HelpanionReviewsWrapper = () => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionReviews />
  </Suspense>
);

export const HelpanionSettingsWrapper = (props: any) => (
  <Suspense fallback={<ComponentLoader />}>
    <LazyHelpanionSettings {...props} />
  </Suspense>
);
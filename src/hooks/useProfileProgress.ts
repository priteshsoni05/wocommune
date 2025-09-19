import { useMemo } from 'react';
import { Profile } from '@/hooks/useOptimizedProfile';

export interface ProfileProgress {
  completion: number;
  isComplete: boolean;
  missingFields: string[];
  completedFields: string[];
}

const REQUIRED_PROFILE_FIELDS = [
  { key: 'display_name', label: 'Display Name' },
  { key: 'username', label: 'Username' },
  { key: 'bio', label: 'Bio' },
  { key: 'avatar_url', label: 'Profile Photo' },
  { key: 'skills', label: 'Skills' },
] as const;

const OPTIONAL_PROFILE_FIELDS = [
  { key: 'email', label: 'Email' },
  { key: 'school', label: 'School' },
  { key: 'role', label: 'Role' },
  { key: 'use_case', label: 'Use Case' },
] as const;

export const useProfileProgress = (profile: Profile | null): ProfileProgress => {
  return useMemo(() => {
    if (!profile) {
      return {
        completion: 0,
        isComplete: false,
        missingFields: REQUIRED_PROFILE_FIELDS.map(field => field.label),
        completedFields: []
      };
    }

    const completedRequired = REQUIRED_PROFILE_FIELDS.filter(field => {
      const value = profile[field.key as keyof Profile];
      return value && String(value).trim() !== '';
    });

    const completedOptional = OPTIONAL_PROFILE_FIELDS.filter(field => {
      const value = profile[field.key as keyof Profile];
      return value && String(value).trim() !== '';
    });

    const totalRequiredFields = REQUIRED_PROFILE_FIELDS.length;
    const totalOptionalFields = OPTIONAL_PROFILE_FIELDS.length;
    const completedRequiredCount = completedRequired.length;
    const completedOptionalCount = completedOptional.length;

    // Calculate completion percentage: Required fields count as 80%, optional as 20%
    const requiredWeight = 80;
    const optionalWeight = 20;
    
    const requiredCompletion = (completedRequiredCount / totalRequiredFields) * requiredWeight;
    const optionalCompletion = (completedOptionalCount / totalOptionalFields) * optionalWeight;
    
    const completion = Math.round(requiredCompletion + optionalCompletion);
    
    // Profile is considered complete when all required fields are filled
    const isComplete = completedRequiredCount === totalRequiredFields;

    const missingFields = REQUIRED_PROFILE_FIELDS
      .filter(field => {
        const value = profile[field.key as keyof Profile];
        return !value || String(value).trim() === '';
      })
      .map(field => field.label);

    const completedFields = [
      ...completedRequired.map(field => field.label),
      ...completedOptional.map(field => field.label)
    ];

    return {
      completion,
      isComplete,
      missingFields,
      completedFields
    };
  }, [profile]);
};
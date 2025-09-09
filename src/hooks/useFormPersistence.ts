import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UseFormPersistenceOptions<T> {
  key: string;
  initialValues: T;
  clearOnLogout?: boolean;
}

export function useFormPersistence<T extends Record<string, any>>({
  key,
  initialValues,
  clearOnLogout = true
}: UseFormPersistenceOptions<T>) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<T>(initialValues);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create a unique storage key for the user
  const storageKey = user ? `form_${key}_${user.id}` : `form_${key}`;

  // Load persisted data on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData({ ...initialValues, ...parsedData });
      }
    } catch (error) {
      console.warn('Failed to load form data from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [storageKey]);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    if (!isLoaded) return; // Don't save during initial load
    
    try {
      // Only save non-empty values to avoid storing default empty state
      const dataToSave = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          if (typeof value === 'string') return value.trim() !== '';
          if (typeof value === 'number') return value !== 0;
          if (typeof value === 'boolean') return true; // Always save boolean values
          return value != null;
        })
      );

      if (Object.keys(dataToSave).length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch (error) {
      console.warn('Failed to save form data to localStorage:', error);
    }
  }, [formData, storageKey, isLoaded]);

  // Clear data when user logs out
  useEffect(() => {
    if (clearOnLogout && !user) {
      clearPersistedData();
    }
  }, [user, clearOnLogout]);

  const updateFormData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    if (typeof updates === 'function') {
      setFormData(updates);
    } else {
      setFormData(prev => ({ ...prev, ...updates }));
    }
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initialValues);
    localStorage.removeItem(storageKey);
  }, [initialValues, storageKey]);

  const clearPersistedData = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const clearAllUserFormData = useCallback(() => {
    if (!user) return;
    
    // Clear all form data for the current user
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`form_`) && key.endsWith(`_${user.id}`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, [user]);

  return {
    formData,
    updateFormData,
    resetFormData,
    clearPersistedData,
    clearAllUserFormData,
    isLoaded
  };
}
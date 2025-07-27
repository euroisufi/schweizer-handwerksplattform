import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { CreditPackage, Subscription, Project } from '@/types';
import { CREDIT_PACKAGES, SUBSCRIPTIONS } from '@/mocks/credits';
import { useAuth } from './auth-store';
import { useBusiness } from './auth-store';
import { calculateCreditsForProject } from '@/utils/credits';
import { PROJECTS, PROJECT_CONTACTS } from '@/mocks/projects';
import { CUSTOMERS } from '@/mocks/users';
import { useProjects } from './projects-store';

interface UnlockedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectTitle: string;
  projectId: string;
  unlockedAt: string;
  address: string;
  budget: string;
  project: Project;
  profileImage?: string;
}

export const [CreditsContext, useCredits] = createContextHook(() => {
  const { user, userType } = useAuth();
  const business = useBusiness();
  const queryClient = useQueryClient();
  const { projects } = useProjects();
  const [credits, setCredits] = useState<number>(0);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [unlockedContacts, setUnlockedContacts] = useState<UnlockedContact[]>([]);
  
  // Load credits from storage on mount
  const creditsQuery = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: async () => {
      if (!user || userType !== 'business') return 0;
      
      const storedCredits = await AsyncStorage.getItem(`credits-${user.id}`);
      return storedCredits ? parseInt(storedCredits, 10) : business?.credits || 0;
    },
    enabled: !!user && userType === 'business',
  });
  
  // Load subscription from storage
  const subscriptionQuery = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user || userType !== 'business') return null;
      
      const storedSubscription = await AsyncStorage.getItem(`subscription-${user.id}`);
      return storedSubscription ? JSON.parse(storedSubscription) : null;
    },
    enabled: !!user && userType === 'business',
  });
  
  // Load unlocked contacts from storage
  const unlockedContactsQuery = useQuery({
    queryKey: ['unlockedContacts', user?.id],
    queryFn: async () => {
      if (!user || userType !== 'business') return [];
      
      const storedContacts = await AsyncStorage.getItem(`unlockedContacts-${user.id}`);
      return storedContacts ? JSON.parse(storedContacts) : [];
    },
    enabled: !!user && userType === 'business',
  });
  
  useEffect(() => {
    if (creditsQuery.data !== undefined) {
      setCredits(creditsQuery.data);
    }
  }, [creditsQuery.data]);
  
  useEffect(() => {
    if (subscriptionQuery.data) {
      setSubscription(subscriptionQuery.data);
    }
  }, [subscriptionQuery.data]);
  
  useEffect(() => {
    if (unlockedContactsQuery.data) {
      setUnlockedContacts(unlockedContactsQuery.data);
    }
  }, [unlockedContactsQuery.data]);
  
  // Purchase credits (discount applies only to credit purchases)
  const purchaseCreditsMutation = useMutation({
    mutationFn: async (pkg: CreditPackage) => {
      if (!user || userType !== 'business') throw new Error('User not authenticated or not a business');
      
      // Apply discount if user has a premium subscription (only for credit purchases)
      let creditsToAdd = pkg.credits;
      if (subscription) {
        creditsToAdd = Math.floor(creditsToAdd * (1 + subscription.creditDiscount / 100));
      }
      
      const newCredits = credits + creditsToAdd;
      await AsyncStorage.setItem(`credits-${user.id}`, newCredits.toString());
      
      return newCredits;
    },
    onSuccess: (newCredits) => {
      setCredits(newCredits);
    },
  });
  
  // Use credits to unlock contact (no discount applied here)
  const useCreditsForContactMutation = useMutation({
    mutationFn: async (params: { projectId: string; projectBudget?: { min: number; max: number } }) => {
      if (!user || userType !== 'business') throw new Error('User not authenticated or not a business');
      
      const { projectId, projectBudget } = params;
      const requiredCredits = calculateCreditsForProject(projectBudget);
      if (credits < requiredCredits) throw new Error('Not enough credits');
      
      // Find the project (check both mock data and dynamic projects)
      let project = PROJECTS.find(p => p.id === projectId);
      if (!project) {
        project = projects.find(p => p.id === projectId);
      }
      if (!project) throw new Error('Project not found');
      
      // Check if contact is already unlocked for this specific project
      const alreadyUnlocked = unlockedContacts.some(contact => contact.projectId === projectId);
      if (alreadyUnlocked) {
        console.log('Contact already unlocked for project:', projectId);
        throw new Error('Sie haben diesen Kontakt bereits freigeschaltet. Sie können nur einmal pro Inserat bezahlen.');
      }
      
      const newCredits = credits - requiredCredits;
      await AsyncStorage.setItem(`credits-${user.id}`, newCredits.toString());
      
      // Create unlocked contact entry
      // First try to get contact from mock data
      let contact = PROJECT_CONTACTS[project.customerId as keyof typeof PROJECT_CONTACTS];
      let customerData = CUSTOMERS.find(c => c.id === project.customerId);
      
      // If not found in mock data, use project's contact information
      if (!contact && !customerData) {
        // For dynamically created projects, use the contact info from the project itself
        contact = {
          name: project.contactName || 'Unbekannt',
          email: project.contactEmail || '',
          phone: project.contactPhone || ''
        };
      }
      
      // For dynamically created projects, try to get profile image from customer data
      let profileImage = customerData?.profileImage;
      
      // If no profile image found in customer data, check if the customer data was updated in the CUSTOMERS array
      if (!profileImage) {
        const updatedCustomerData = CUSTOMERS.find(c => c.id === project.customerId);
        profileImage = updatedCustomerData?.profileImage;
      }
      
      const unlockedContact: UnlockedContact = {
        id: `${projectId}-${Date.now()}`,
        name: contact?.name || project.contactName || customerData?.name || 'Unbekannt',
        email: contact?.email || project.contactEmail || '',
        phone: contact?.phone || project.contactPhone || '',
        projectTitle: project.title,
        projectId: project.id,
        unlockedAt: new Date().toISOString(),
        address: `${project.location.address}, ${project.location.postalCode} ${project.location.city}`,
        budget: project.budget ? `CHF ${project.budget.min.toLocaleString()} - ${project.budget.max.toLocaleString()}` : 'Budget nicht angegeben',
        project,
        profileImage
      };
      
      console.log('Creating unlocked contact with profile image:', {
        projectId,
        customerId: project.customerId,
        profileImage,
        customerDataExists: !!customerData,
        currentUserIsCustomer: user?.id === project.customerId
      });
      
      const updatedContacts = [...unlockedContacts, unlockedContact];
      await AsyncStorage.setItem(`unlockedContacts-${user.id}`, JSON.stringify(updatedContacts));
      
      console.log('Contact unlocked successfully:', {
        projectId,
        contactName: unlockedContact.name,
        totalUnlockedContacts: updatedContacts.length
      });
      
      return { newCredits, usedCredits: requiredCredits, unlockedContact };
    },
    onSuccess: ({ newCredits, unlockedContact }) => {
      console.log('Credits updated and contact added to state:', {
        newCredits,
        contactName: unlockedContact.name,
        projectId: unlockedContact.projectId
      });
      setCredits(newCredits);
      setUnlockedContacts(prev => {
        const updated = [...prev, unlockedContact];
        console.log('Updated unlocked contacts state:', updated.length, 'contacts');
        return updated;
      });
      
      // Invalidate queries to ensure data consistency
      queryClient.invalidateQueries({ queryKey: ['unlockedContacts', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['credits', user?.id] });
    },
  });
  
  // Subscribe to premium
  const subscribeMutation = useMutation({
    mutationFn: async (sub: Subscription) => {
      if (!user || userType !== 'business') throw new Error('User not authenticated or not a business');
      
      await AsyncStorage.setItem(`subscription-${user.id}`, JSON.stringify(sub));
      
      return sub;
    },
    onSuccess: (sub) => {
      setSubscription(sub);
    },
  });
  
  // Cancel subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      if (!user || userType !== 'business') throw new Error('User not authenticated or not a business');
      
      await AsyncStorage.removeItem(`subscription-${user.id}`);
      
      return null;
    },
    onSuccess: () => {
      setSubscription(null);
    },
  });
  
  // Function to refresh unlocked contacts data
  const refreshUnlockedContacts = () => {
    queryClient.invalidateQueries({ queryKey: ['unlockedContacts', user?.id] });
  };

  return {
    credits,
    subscription,
    creditPackages: CREDIT_PACKAGES,
    subscriptionOptions: SUBSCRIPTIONS,
    unlockedContacts,
    isLoading: creditsQuery.isLoading || purchaseCreditsMutation.isPending || 
               useCreditsForContactMutation.isPending || subscribeMutation.isPending || 
               cancelSubscriptionMutation.isPending,
    purchaseCredits: (pkg: CreditPackage) => purchaseCreditsMutation.mutate(pkg),
    useCreditsForContact: (params: { projectId: string; projectBudget?: { min: number; max: number } }) => useCreditsForContactMutation.mutate(params),
    subscribe: (sub: Subscription) => subscribeMutation.mutate(sub),
    cancelSubscription: () => cancelSubscriptionMutation.mutate(),
    hasPremium: !!subscription,
    hasEnoughCredits: (projectBudget?: { min: number; max: number }) => credits >= calculateCreditsForProject(projectBudget),
    isContactUnlocked: (projectId: string) => unlockedContacts.some(contact => contact.projectId === projectId),
    calculateCreditsForProject,
    refreshUnlockedContacts,
  };
});
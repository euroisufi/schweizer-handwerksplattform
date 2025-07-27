import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Business, Customer, User, UserType } from '@/types';
import { BUSINESSES, CUSTOMERS } from '@/mocks/users';



// In a real app, this would be an API call
const mockLogin = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user in mock data
  const customer = CUSTOMERS.find(c => c.email === email);
  if (customer) return customer;
  
  const business = BUSINESSES.find(b => b.email === email);
  if (business) return business;
  
  return null;
};

// Mock registration function
const mockRegister = async (userData: any): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if user already exists
  const existingCustomer = CUSTOMERS.find(c => c.email === userData.email);
  const existingBusiness = BUSINESSES.find(b => b.email === userData.email);
  
  if (existingCustomer || existingBusiness) {
    throw new Error('Ein Benutzer mit dieser E-Mail-Adresse existiert bereits.');
  }
  
  // Create new user object
  const newUser: User = {
    id: Date.now().toString(),
    email: userData.email,
    name: `${userData.firstName} ${userData.lastName}`,
    userType: userData.userType,
    createdAt: new Date().toISOString(),
    ...(userData.userType === 'customer' ? {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      gender: userData.gender,
    } : {
      name: userData.companyName,
      address: userData.address,
      city: userData.city,
      postalCode: userData.postalCode,
      phone: userData.phone,
      description: userData.description,
      services: [],
      categories: [],
      rating: 0,
      reviewCount: 0,
      verified: false,
    }),
  };
  
  // Add new user to the appropriate mock data array
  if (userData.userType === 'customer') {
    CUSTOMERS.push(newUser as Customer);
  } else {
    BUSINESSES.push(newUser as Business);
  }
  
  return newUser;
};

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  
  // Load user from storage on mount
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        console.log('Loading user from AsyncStorage...');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          console.log('User loaded from storage:', parsedUser.email);
          return parsedUser;
        }
        console.log('No user found in storage');
        return null;
      } catch (error) {
        console.error('Error loading user from storage:', error);
        return null;
      }
    },
  });
  
  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
      setUserType(userQuery.data?.userType || null);
    }
  }, [userQuery.data]);
  

  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const loggedInUser = await mockLogin(email, password);
      if (!loggedInUser) throw new Error('Invalid credentials');
      return loggedInUser;
    },
    onSuccess: async (loggedInUser) => {
      console.log('Login successful, saving user to storage:', loggedInUser.email);
      setUser(loggedInUser);
      setUserType(loggedInUser.userType);
      try {
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser));
        console.log('User saved to AsyncStorage successfully');
      } catch (error) {
        console.error('Error saving user to AsyncStorage:', error);
      }
    },
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const newUser = await mockRegister(userData);
      return newUser;
    },
    onSuccess: async (newUser) => {
      console.log('Registration successful, saving user to storage:', newUser.email);
      setUser(newUser);
      setUserType(newUser.userType);
      try {
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        console.log('New user saved to AsyncStorage successfully');
      } catch (error) {
        console.error('Error saving new user to AsyncStorage:', error);
      }
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem('user');
      return true;
    },
    onSuccess: () => {
      console.log('Logout successful, user data cleared from storage');
      setUser(null);
      setUserType(null);
    },
  });
  
  // Update user profile
  const updateUserMutation = useMutation({
    mutationFn: async (updatedData: Partial<User>) => {
      if (!user) throw new Error('No user logged in');
      
      const updatedUser = { ...user, ...updatedData };
      
      // Update in mock data arrays as well
      if (user.userType === 'customer') {
        const customerIndex = CUSTOMERS.findIndex(c => c.id === user.id);
        if (customerIndex !== -1) {
          CUSTOMERS[customerIndex] = updatedUser as Customer;
        }
      } else {
        const businessIndex = BUSINESSES.findIndex(b => b.id === user.id);
        if (businessIndex !== -1) {
          BUSINESSES[businessIndex] = updatedUser as Business;
        }
      }
      
      try {
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User profile updated in storage');
      } catch (error) {
        console.error('Error updating user in AsyncStorage:', error);
      }
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });

  // Switch user type (for demo purposes)
  const switchUserType = (type: UserType) => {
    setUserType(type);
    
    // Find a mock user of the selected type
    let newUser: User | null = null;
    
    if (type === 'customer') {
      newUser = CUSTOMERS[0];
    } else {
      newUser = BUSINESSES[0];
    }
    
    if (newUser) {
      setUser(newUser);
      try {
        AsyncStorage.setItem('user', JSON.stringify(newUser));
        console.log('Demo user saved to storage:', newUser.email);
      } catch (error) {
        console.error('Error saving demo user to AsyncStorage:', error);
      }
    }
  };




  
  return {
    user,
    userType,
    isLoading: userQuery.isLoading || loginMutation.isPending || logoutMutation.isPending || updateUserMutation.isPending || registerMutation.isPending,
    isLoggedIn: !!user,
    login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    register: (userData: any) => registerMutation.mutateAsync(userData),
    logout: () => logoutMutation.mutate(),
    updateUser: (data: Partial<User>) => updateUserMutation.mutate(data),
    loginError: loginMutation.error ? (loginMutation.error as Error).message : null,
    registerError: registerMutation.error ? (registerMutation.error as Error).message : null,
    switchUserType,
  };
});

// Helper hooks
export const useCustomer = () => {
  const { user, userType } = useAuth();
  
  if (!user || userType !== 'customer') {
    return null;
  }
  
  return user as Customer;
};

export const useBusiness = () => {
  const { user, userType } = useAuth();
  
  if (!user || userType !== 'business') {
    return null;
  }
  
  return user as Business;
};
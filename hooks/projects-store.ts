import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect } from 'react';
import { Project, Service } from '@/types';
import { PROJECTS } from '@/mocks/projects';
import { CUSTOMERS } from '@/mocks/users';
import { useAuth } from './auth-store';

export const [ProjectsContext, useProjects] = createContextHook(() => {
  const { user, userType } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Load projects from storage on mount
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const storedProjects = await AsyncStorage.getItem('projects');
      return storedProjects ? JSON.parse(storedProjects) : PROJECTS;
    },
  });
  
  useEffect(() => {
    if (projectsQuery.data) {
      setProjects(projectsQuery.data);
    }
  }, [projectsQuery.data]);
  
  // Sync projects to storage
  const syncMutation = useMutation({
    mutationFn: async (updatedProjects: Project[]) => {
      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      return updatedProjects;
    },
  });
  
  // Create a new project
  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const newProject: Project = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
    };
    
    // If the user is a customer creating their own project, update their profile image in mock data
    if (userType === 'customer' && user.id === project.customerId) {
      const customerIndex = CUSTOMERS.findIndex(c => c.id === user.id);
      if (customerIndex !== -1) {
        // Update the customer's profile image if the user has one
        if (user.profileImage || user.logo) {
          CUSTOMERS[customerIndex] = {
            ...CUSTOMERS[customerIndex],
            profileImage: user.profileImage || user.logo,
            name: user.name,
            firstName: user.firstName || CUSTOMERS[customerIndex].firstName,
            lastName: user.lastName || CUSTOMERS[customerIndex].lastName,
            phone: user.phone || CUSTOMERS[customerIndex].phone,
            email: user.email,
          };
          console.log('Updated customer profile in mock data:', CUSTOMERS[customerIndex]);
        }
      } else {
        // Add new customer to mock data if not exists
        const newCustomer = {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName || user.name.split(' ')[0] || '',
          lastName: user.lastName || user.name.split(' ').slice(1).join(' ') || '',
          phone: user.phone || '',
          userType: 'customer' as const,
          createdAt: user.createdAt,
          projects: [newProject.id],
          profileImage: user.profileImage || user.logo,
          location: user.location || {
            address: '',
            city: '',
            canton: '',
            postalCode: '',
          },
          gender: (user as any).gender,
        };
        CUSTOMERS.push(newCustomer);
        console.log('Added new customer to mock data:', newCustomer);
      }
    }
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    syncMutation.mutate(updatedProjects);
    
    return newProject;
  };
  
  // Get projects for the current user
  const getUserProjects = () => {
    if (!user) return [];
    
    if (userType === 'customer') {
      return projects.filter(project => project.customerId === user.id);
    }
    
    // For business users, return projects they've been assigned to
    return projects.filter(project => project.businessId === user.id);
  };
  
  // Get projects by service
  const getProjectsByService = (serviceId: string) => {
    return projects.filter(project => project.service.id === serviceId);
  };
  
  // Get projects by location (canton)
  const getProjectsByCanton = (canton: string) => {
    return projects.filter(project => project.location.canton === canton);
  };
  
  // Get a single project by ID
  const getProjectById = (id: string) => {
    return projects.find(project => project.id === id) || null;
  };
  
  // Update a project
  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!user) throw new Error('User not authenticated');
    
    const updatedProjects = projects.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    );
    
    setProjects(updatedProjects);
    syncMutation.mutate(updatedProjects);
    
    return updatedProjects.find(p => p.id === projectId);
  };
  
  // Mark project as completed
  const completeProject = async (projectId: string) => {
    return updateProject(projectId, { status: 'completed' });
  };
  
  // Check if user owns project
  const isProjectOwner = (projectId: string) => {
    if (!user) return false;
    const project = getProjectById(projectId);
    return project?.customerId === user.id;
  };
  
  // Sort projects by creation date (newest first)
  const sortedProjects = [...projects].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return {
    projects: sortedProjects,
    isLoading: projectsQuery.isLoading || syncMutation.isPending,
    createProject,
    updateProject,
    completeProject,
    getUserProjects,
    getProjectsByService,
    getProjectsByCanton,
    getProjectById,
    isProjectOwner,
  };
});
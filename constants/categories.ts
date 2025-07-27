export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  { id: 'maler', name: 'Maler', icon: '🎨', color: '#FF6B6B' },
  { id: 'elektriker', name: 'Elektriker', icon: '⚡', color: '#4ECDC4' },
  { id: 'sanitaer', name: 'Sanitäter', icon: '🚿', color: '#45B7D1' },
  { id: 'garten', name: 'Gärtner', icon: '🌱', color: '#96CEB4' },
  { id: 'schreiner', name: 'Schreiner', icon: '🔨', color: '#FFEAA7' },
  { id: 'fliesenleger', name: 'Fliesenleger', icon: '⬜', color: '#DDA0DD' },
  { id: 'dachdecker', name: 'Dachdecker', icon: '🏠', color: '#98D8C8' },
  { id: 'heizung', name: 'Heizungsinstallateur', icon: '🔥', color: '#F7DC6F' },
  { id: 'reinigung', name: 'Reinigungsservice', icon: '🧽', color: '#BB8FCE' },
  { id: 'umzug', name: 'Umzugshelfer', icon: '📦', color: '#85C1E9' },
  { id: 'parkett', name: 'Parkettleger', icon: '🪵', color: '#D2B48C' },
  { id: 'fenster', name: 'Fenster- und Türeninstallateur', icon: '🪟', color: '#87CEEB' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(category => category.name === name);
};
// src/services/dataService.js
const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`/data/${endpoint}.json`);
      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors du chargement des données (${endpoint}):`, error);
      throw error;
    }
  };
  
  export const fetchSkills = () => fetchData('skills');
  export const fetchColors = () => fetchData('colors');
  export const fetchExperiences = () => fetchData('experiences');
  // etc.
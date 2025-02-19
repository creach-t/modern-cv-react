import React from 'react';
import { useColor } from '../contexts/ColorContext';
import { Calendar, MapPin } from 'lucide-react';

const Experience = () => {
  const { secondaryColor, isDark } = useColor();

  const experiences = [
    {
      title: 'Senior Developer',
      company: 'Tech Corp',
      location: 'Paris, France',
      period: '2020 - Present',
      description: [
        'Lead developer on multiple projects',
        'Managed team of 5 developers',
        'Implemented CI/CD pipelines',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'StartUp Inc',
      location: 'Lyon, France',
      period: '2018 - 2020',
      description: [
        'Developed main product features',
        'Improved performance by 40%',
        'Implemented responsive design',
      ],
    },
  ];

  return (
    <section className="mb-8">
      <h2 
        className="text-2xl font-bold mb-6 pb-2 transition-colors duration-200"
        style={{ 
          borderBottom: `2px solid ${secondaryColor}`,
          color: isDark ? 'white' : 'black'
        }}
      >
        Expérience Professionnelle
      </h2>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg transition-colors duration-200"
            style={{ 
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: isDark ? 'white' : 'black' }}
                >
                  {exp.title}
                </h3>
                <p 
                  className="font-medium"
                  style={{ color: secondaryColor }}
                >
                  {exp.company}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mb-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{exp.period}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{exp.location}</span>
              </div>
            </div>

            <ul className="list-disc list-inside space-y-1 transition-colors duration-200"
                style={{ color: isDark ? 'rgb(209 213 219)' : 'rgb(55 65 81)' }}>
              {exp.description.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Experience;
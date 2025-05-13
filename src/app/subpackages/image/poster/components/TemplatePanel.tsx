import { PosterData } from '../types';
import { POSTER_TEMPLATES } from '../constants';

interface TemplatePanelProps {
  posterData: PosterData;
  updatePosterData: (field: keyof PosterData, value: string | number) => void;
}

export function TemplatePanel({ posterData, updatePosterData }: TemplatePanelProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
      {POSTER_TEMPLATES.map((template) => (
        <div
          key={template.id}
          className={`${
            template.bgColor
          } h-24 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
            posterData.template === template.id
              ? 'ring-2 ring-blue-500 scale-105'
              : 'hover:scale-105'
          }`}
          onClick={() => updatePosterData('template', template.id)}
        >
          <span className='text-white font-medium'>{template.name}</span>
        </div>
      ))}
    </div>
  );
}
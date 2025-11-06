"use client";

interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Array<{ id: string; name: string; description: string; link: string }>;
  certifications: Array<{ id: string; name: string; issuer: string; date: string }>;
}

interface ResumePreviewProps {
  data: ResumeData;
  template: string;
}

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const { personalInfo, experience, education, skills } = data;

  // Helper function to make URLs clickable
  const makeLink = (url: string) => {
    if (!url) return null;
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    return fullUrl;
  };

  // Modern Template
  if (template === "modern") {
    return (
      <div className="w-full aspect-[8.5/11] bg-white text-black p-8 overflow-auto text-xs">
        {/* Header */}
        <div className="border-b-2 border-purple-600 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{personalInfo.fullName}</h1>
          <p className="text-base text-purple-600 font-medium mt-1">{personalInfo.title}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-600">
            {personalInfo.linkedin && (
              <a 
                href={makeLink(personalInfo.linkedin) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {personalInfo.linkedin}
              </a>
            )}
            {personalInfo.website && (
              <a 
                href={makeLink(personalInfo.website) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Work Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-gray-600">{edu.school}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.grade && <p className="text-xs text-gray-600 mt-1">{edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classic Template
  if (template === "classic") {
    return (
      <div className="w-full aspect-[8.5/11] bg-white text-black p-8 overflow-auto text-xs">
        {/* Header */}
        <div className="text-center border-b border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{personalInfo.fullName}</h1>
          <p className="text-sm text-gray-700 mt-1">{personalInfo.title}</p>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>•</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-xs">
            {personalInfo.linkedin && (
              <>
                <a 
                  href={makeLink(personalInfo.linkedin) || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {personalInfo.linkedin}
                </a>
              </>
            )}
            {personalInfo.website && personalInfo.linkedin && <span className="text-gray-600">•</span>}
            {personalInfo.website && (
              <a 
                href={makeLink(personalInfo.website) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              SUMMARY
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              EXPERIENCE
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-gray-600 italic">{exp.company}</p>
                <p className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              EDUCATION
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <span className="text-xs text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-gray-600">{edu.school}</p>
                {edu.grade && <p className="text-xs text-gray-600">{edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2 border-b border-gray-300 pb-1">
              SKILLS
            </h2>
            <p className="text-xs text-gray-700">{skills.join(" • ")}</p>
          </div>
        )}
      </div>
    );
  }

  // Minimal Template
  if (template === "minimal") {
    return (
      <div className="w-full aspect-[8.5/11] bg-white text-black p-10 overflow-auto text-xs">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900">{personalInfo.fullName}</h1>
          <p className="text-sm text-gray-600 mt-1">{personalInfo.title}</p>
          <div className="flex gap-3 mt-3 text-xs text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
          <div className="flex gap-3 mt-1 text-xs">
            {personalInfo.linkedin && (
              <a 
                href={makeLink(personalInfo.linkedin) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                {personalInfo.linkedin}
              </a>
            )}
            {personalInfo.website && (
              <a 
                href={makeLink(personalInfo.website) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 hover:underline"
              >
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-900 mb-3 tracking-wider uppercase">
              Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-400">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{exp.company}</p>
                <p className="text-xs text-gray-700 mt-2 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-900 mb-3 tracking-wider uppercase">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                  <span className="text-xs text-gray-400">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{edu.school}</p>
                {edu.grade && <p className="text-xs text-gray-500 mt-0.5">{edu.grade}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-gray-900 mb-3 tracking-wider uppercase">
              Skills
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed">{skills.join(", ")}</p>
          </div>
        )}
      </div>
    );
  }

  // Creative Template (colorful sidebar)
  return (
    <div className="w-full aspect-[8.5/11] bg-white text-black flex overflow-auto text-xs">
      {/* Sidebar */}
      <div className="w-1/3 bg-gradient-to-b from-blue-600 to-purple-600 text-white p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold">{personalInfo.fullName}</h1>
          <p className="text-sm mt-1 opacity-90">{personalInfo.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="text-xs font-bold mb-2 uppercase tracking-wide">Contact</h2>
          <div className="space-y-1 text-xs opacity-90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.location && <p>{personalInfo.location}</p>}
            {personalInfo.linkedin && (
              <a 
                href={makeLink(personalInfo.linkedin) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-100 underline"
              >
                {personalInfo.linkedin}
              </a>
            )}
            {personalInfo.website && (
              <a 
                href={makeLink(personalInfo.website) || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:opacity-100 underline"
              >
                {personalInfo.website}
              </a>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold mb-2 uppercase tracking-wide">Skills</h2>
            <div className="space-y-1">
              {skills.map((skill) => (
                <div key={skill} className="text-xs opacity-90">
                  • {skill}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2">About Me</h2>
            <p className="text-xs text-gray-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-xs text-purple-600">{exp.company}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
                <p className="text-xs text-gray-700 mt-1 whitespace-pre-line leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                <p className="text-xs text-gray-600">{edu.school}</p>
                <p className="text-xs text-gray-500">
                  {edu.startDate} - {edu.endDate} {edu.grade && `• ${edu.grade}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
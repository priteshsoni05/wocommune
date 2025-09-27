export interface ProfileTags {
  alumni: string[];
  people: string[];
  helpAreas: string[];
}

export interface TaggedHelpanionProfile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'pending' | 'active' | 'in_review';
  created_at: string;
  updated_at: string;
  skills: string[] | null;
  school: string | null;
  profession: string | null;
  use_case: string | null;
  services: Array<{
    id: string;
    title: string;
    description: string | null;
    price_per_hour: number | null;
    duration_minutes: number | null;
    category: string | null;
    is_active: boolean;
  }>;
  tags: ProfileTags;
}

// Mapping for auto-tagging
const ALUMNI_KEYWORDS = {
  'IIM': ['iim', 'indian institute of management'],
  'ISB': ['isb', 'indian school of business'],
  'XLRI': ['xlri'],
  'IIT': ['iit', 'indian institute of technology'],
  'NIT': ['nit', 'national institute of technology'],
  'NIFT': ['nift', 'national institute of fashion technology'],
  'NID': ['nid', 'national institute of design'],
  'ICAI': ['icai', 'chartered accountant', 'ca'],
  'London School of Fashion': ['london school of fashion', 'lsf']
};

const PEOPLE_KEYWORDS = {
  'Founders': ['founder', 'co-founder', 'entrepreneur', 'startup', 'ceo', 'entrepreneur'],
  'Consultants': ['consultant', 'consulting', 'advisor', 'advisory'],
  'Chartered Accountants': ['chartered accountant', 'ca', 'cpa', 'accountant'],
  'Engineers': ['engineer', 'engineering', 'software engineer', 'developer', 'programmer'],
  'Designers': ['designer', 'design', 'ui/ux', 'graphic designer', 'product designer'],
  'Marketers': ['marketer', 'marketing', 'digital marketing', 'growth', 'seo', 'sem'],
  'Writers': ['writer', 'writing', 'content writer', 'copywriter', 'journalist'],
  'Storytellers': ['storyteller', 'storytelling', 'narrative', 'brand story'],
  'Merchandisers': ['merchandiser', 'merchandising', 'retail'],
  'Buyers': ['buyer', 'buying', 'procurement', 'sourcing']
};

const HELP_AREAS_KEYWORDS = {
  'Finance': ['finance', 'financial', 'investment', 'banking', 'accounting', 'fintech'],
  'Fashion': ['fashion', 'style', 'apparel', 'clothing', 'textile', 'retail fashion'],
  'Marketing': ['marketing', 'digital marketing', 'brand', 'advertising', 'promotion'],
  'Writing': ['writing', 'content', 'copywriting', 'technical writing', 'creative writing']
};

function containsKeyword(text: string | null, keywords: string[]): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

export function generateProfileTags(profile: {
  school?: string | null;
  profession?: string | null;
  skills?: string[] | null;
  use_case?: string | null;
  bio?: string | null;
  services?: Array<{
    category?: string | null;
    title?: string;
    description?: string | null;
  }>;
}): ProfileTags {
  const tags: ProfileTags = {
    alumni: [],
    people: [],
    helpAreas: []
  };

  // Combine all text for analysis
  const allText = [
    profile.school,
    profile.profession,
    profile.use_case,
    profile.bio,
    ...(profile.skills || []),
    ...(profile.services?.map(s => s.category) || []),
    ...(profile.services?.map(s => s.title) || []),
    ...(profile.services?.map(s => s.description) || [])
  ].filter(Boolean).join(' ');

  // Alumni tagging
  Object.entries(ALUMNI_KEYWORDS).forEach(([tag, keywords]) => {
    if (containsKeyword(profile.school, keywords) || containsKeyword(allText, keywords)) {
      if (!tags.alumni.includes(tag)) {
        tags.alumni.push(tag);
      }
    }
  });

  // People tagging
  Object.entries(PEOPLE_KEYWORDS).forEach(([tag, keywords]) => {
    if (containsKeyword(profile.profession, keywords) || 
        containsKeyword(profile.use_case, keywords) ||
        containsKeyword(allText, keywords)) {
      if (!tags.people.includes(tag)) {
        tags.people.push(tag);
      }
    }
  });

  // Help Areas tagging
  Object.entries(HELP_AREAS_KEYWORDS).forEach(([tag, keywords]) => {
    if (profile.skills?.some(skill => containsKeyword(skill, keywords)) ||
        profile.services?.some(service => 
          containsKeyword(service.category, keywords) ||
          containsKeyword(service.title, keywords) ||
          containsKeyword(service.description, keywords)
        ) ||
        containsKeyword(allText, keywords)) {
      if (!tags.helpAreas.includes(tag)) {
        tags.helpAreas.push(tag);
      }
    }
  });

  return tags;
}

export function tagHelpanionProfile(profile: any): TaggedHelpanionProfile {
  const tags = generateProfileTags(profile);
  
  return {
    ...profile,
    tags
  };
}
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

// Mapping for auto-tagging - Expanded to match real user data
const ALUMNI_KEYWORDS = {
  'IIM': ['iim', 'indian institute of management', 'iim ahmedabad', 'iim bangalore', 'iim calcutta', 'iim lucknow', 'iim indore', 'iim kozhikode'],
  'ISB': ['isb', 'indian school of business', 'isb hyderabad'],
  'XLRI': ['xlri', 'xlri jamshedpur'],
  'IIT': ['iit', 'indian institute of technology', 'iit delhi', 'iit bombay', 'iit madras', 'iit kanpur', 'iit kharagpur', 'iit roorkee', 'iit guwahati', 'iit bhu'],
  'NIT': ['nit', 'national institute of technology', 'nit trichy', 'nit warangal', 'nit surathkal', 'nit calicut', 'nit durgapur', 'nit rourkela'],
  'NIFT': ['nift', 'national institute of fashion technology', 'nift delhi', 'nift mumbai', 'nift bangalore', 'nift chennai', 'nift kolkata', 'nift gandhinagar'],
  'NID': ['nid', 'national institute of design', 'nid ahmedabad', 'nid gandhinagar'],
  'ICAI': ['icai', 'chartered accountant', 'ca', 'institute of chartered accountants'],
  'London School of Fashion': ['london school of fashion', 'lsf', 'university of the arts london'],
  'Fashion Design': ['fashion design', 'fashion technology', 'textile design', 'apparel design'],
  'Business Schools': ['business school', 'mba', 'pgdm', 'management', 'commerce'],
  'Engineering': ['engineering', 'btech', 'be', 'b.tech', 'b.e', 'technology'],
  'Design Schools': ['design', 'fine arts', 'visual arts', 'applied arts', 'graphic design', 'interior design'],
  'Liberal Arts': ['liberal arts', 'humanities', 'social sciences', 'arts', 'literature'],
  'International': ['international', 'abroad', 'overseas', 'foreign', 'university', 'college']
};

const PEOPLE_KEYWORDS = {
  'Founders': ['founder', 'co-founder', 'entrepreneur', 'startup', 'ceo', 'chief executive officer', 'business owner', 'entrepreneur'],
  'Consultants': ['consultant', 'consulting', 'advisor', 'advisory', 'business consultant', 'strategy consultant', 'management consultant'],
  'Chartered Accountants': ['chartered accountant', 'ca', 'cpa', 'accountant', 'finance professional', 'financial analyst'],
  'Engineers': ['engineer', 'engineering', 'software engineer', 'developer', 'programmer', 'tech lead', 'technical architect', 'data engineer'],
  'Designers': ['designer', 'design', 'ui/ux', 'graphic designer', 'product designer', 'visual designer', 'creative director', 'art director'],
  'Marketers': ['marketer', 'marketing', 'digital marketing', 'growth', 'seo', 'sem', 'brand manager', 'marketing manager', 'growth hacker'],
  'Writers': ['writer', 'writing', 'content writer', 'copywriter', 'journalist', 'editor', 'content creator', 'blogger'],
  'Storytellers': ['storyteller', 'storytelling', 'narrative', 'brand story', 'content strategist', 'communications'],
  'Merchandisers': ['merchandiser', 'merchandising', 'retail', 'fashion merchandiser', 'retail merchandiser', 'visual merchandiser'],
  'Buyers': ['buyer', 'buying', 'procurement', 'sourcing', 'purchasing', 'vendor management'],
  'Product Managers': ['product manager', 'product management', 'product owner', 'product strategy', 'pm'],
  'Sales Professionals': ['sales', 'sales manager', 'business development', 'sales executive', 'account manager'],
  'HR Professionals': ['hr', 'human resources', 'talent acquisition', 'recruiter', 'people operations'],
  'Operations': ['operations', 'operations manager', 'business operations', 'process improvement'],
  'Customer Success': ['customer success', 'customer experience', 'client relations', 'customer support'],
  'Data Professionals': ['data scientist', 'data analyst', 'business analyst', 'research analyst'],
  'Finance Professionals': ['finance', 'financial analyst', 'investment', 'banking', 'fintech'],
  'Fashion Professionals': ['fashion', 'fashion designer', 'stylist', 'fashion buyer', 'fashion marketing'],
  'Students': ['student', 'fresher', 'graduate', 'recent graduate', 'final year', 'internship']
};

const HELP_AREAS_KEYWORDS = {
  'Finance': ['finance', 'financial', 'investment', 'banking', 'accounting', 'fintech', 'financial planning', 'wealth management', 'trading', 'equity research'],
  'Fashion': ['fashion', 'style', 'apparel', 'clothing', 'textile', 'retail fashion', 'fashion design', 'fashion merchandising', 'fashion business', 'fashion marketing', 'fashion retail'],
  'Marketing': ['marketing', 'digital marketing', 'brand', 'advertising', 'promotion', 'social media marketing', 'content marketing', 'growth marketing', 'performance marketing'],
  'Writing': ['writing', 'content', 'copywriting', 'technical writing', 'creative writing', 'content creation', 'blogging', 'journalism'],
  'Technology': ['technology', 'software', 'programming', 'development', 'coding', 'tech', 'IT', 'software development', 'web development', 'mobile development'],
  'Design': ['design', 'ui/ux', 'graphic design', 'product design', 'visual design', 'user experience', 'user interface', 'creative design'],
  'Business': ['business', 'entrepreneurship', 'strategy', 'management', 'leadership', 'business development', 'startup', 'business planning'],
  'Career': ['career', 'career guidance', 'career transition', 'job search', 'interview preparation', 'career coaching', 'professional development'],
  'Product': ['product', 'product management', 'product strategy', 'product development', 'product marketing', 'user research'],
  'Sales': ['sales', 'business development', 'sales strategy', 'lead generation', 'customer acquisition', 'revenue growth'],
  'Consulting': ['consulting', 'strategy consulting', 'management consulting', 'business consulting', 'advisory'],
  'Data': ['data', 'data science', 'analytics', 'data analysis', 'business intelligence', 'research'],
  'Operations': ['operations', 'process improvement', 'project management', 'supply chain', 'logistics'],
  'Education': ['education', 'teaching', 'training', 'learning', 'academic', 'mentoring', 'coaching']
};

function containsKeyword(text: string | null, keywords: string[]): boolean {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => {
    const keywordLower = keyword.toLowerCase();
    // For specific institutions like ICAI, use exact matching to avoid false positives
    if (keywordLower === 'icai' || keywordLower === 'ca') {
      return lowerText.includes(keywordLower);
    }
    // For other keywords, use enhanced fuzzy matching
    return lowerText.includes(keywordLower) || 
           lowerText.split(' ').some(word => word.startsWith(keywordLower.substring(0, 3))) ||
           keywordLower.split(' ').some(keywordWord => lowerText.includes(keywordWord));
  });
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
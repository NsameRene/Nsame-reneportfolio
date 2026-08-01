import { useEffect } from 'react';
import { useLocation } from 'react-router';

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article';
  robots?: string;
};

const SITE_URL = 'https://nsamerenetamjong.com';
const DEFAULT_TITLE = 'Nsame Rene Tamjong | Founder & CEO of ELIGNITE';
const DEFAULT_DESCRIPTION = 'Nsame Rene Tamjong is the Founder & CEO of ELIGNITE, Project Manager for EduIgnite and JuniorIgnite, and a coder, entrepreneur, educator, and mentor building educational technology solutions.';
const DEFAULT_KEYWORDS = 'Nsame Rene Tamjong, Nsame Rene, Nsame Rene portfolio, ELIGNITE, EduIgnite, JuniorIgnite, founder, project manager, coder, entrepreneur, educator, mathematics teacher, mentor, educational technology, web development, full stack development, React, TypeScript, Node.js, PostgreSQL, AI solutions';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';
const PERSON_NAME = 'Nsame Rene Tamjong';
const ORGANIZATION_NAME = 'ELIGNITE';

function setMetaTag(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setLinkRel(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const resolvedTitle = title ? `${title} | ${PERSON_NAME}` : DEFAULT_TITLE;
    document.title = resolvedTitle;

    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', robots);
    setMetaTag('author', PERSON_NAME);
    setMetaTag('application-name', 'Nsame Rene Portfolio');
    setMetaTag('theme-color', '#4f46e5');
    setMetaTag('google-site-verification', 'your-google-site-verification-code');
    setMetaTag('msapplication-TileColor', '#4f46e5');

    const pathname = location.pathname || '/';
    const canonicalUrl = canonical || `${SITE_URL}${pathname}`;
    setLinkRel('canonical', canonicalUrl);
    setMetaTag('og:title', resolvedTitle, 'property');
    setMetaTag('og:description', description, 'property');
    setMetaTag('og:type', type, 'property');
    setMetaTag('og:url', canonicalUrl, 'property');
    setMetaTag('og:image', image, 'property');
    setMetaTag('og:site_name', PERSON_NAME, 'property');
    setMetaTag('og:locale', 'en_US', 'property');

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', resolvedTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
    setMetaTag('twitter:site', '@nsamerenetamjong');

    const existingScript = document.getElementById('seo-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          name: PERSON_NAME,
          alternateName: ['Nsame Rene', 'Nsame Rene Tamjong'],
          jobTitle: ['Founder & CEO', 'Project Manager', 'Coder', 'Entrepreneur', 'Educator', 'Mathematics Teacher', 'Mentor'],
          description: 'Founder & CEO of ELIGNITE, Project Manager for EduIgnite and JuniorIgnite, educator, entrepreneur, and technology innovator.',
          url: SITE_URL,
          sameAs: []
        },
        {
          '@type': 'Organization',
          name: ORGANIZATION_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.svg`,
          description: 'ELIGNITE builds educational technology products and digital learning solutions for schools, educators, and learners across Africa.',
          founder: {
            '@type': 'Person',
            name: PERSON_NAME
          }
        }
      ]
    };

    const script = document.createElement('script');
    script.id = 'seo-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
  }, [canonical, description, image, keywords, location.pathname, robots, title, type]);

  return null;
}

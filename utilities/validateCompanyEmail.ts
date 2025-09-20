export const isCompanyEmail = (email: string): boolean => {
  const PUBLIC_DOMAINS = [
    'gmail.com',
    'yahoo.com',
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return typeof domain === 'string' && !PUBLIC_DOMAINS.includes(domain);
};
export function generateMockProfile() {
  return {
    id: crypto.randomUUID(),
    name: 'Abdul',
    email: 'abdul@example.com',
    bio: 'Full-stack developer in training. Passionate about building great software and continuous learning.',
    avatar: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

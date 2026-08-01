const fs = require('fs');
let code = fs.readFileSync('src/pages/CV.tsx', 'utf8');

code = code.replace(
  /const personalInfo = \{[\s\S]*?\};/,
  `const personalInfo = {
    name: data.settings?.name || "Nsame Reneta Mjong",
    role: "Full Stack Developer",
    email: data.settings?.email || "nsamerenetamjong@gmail.com",
    phone: data.settings?.phone || "+1234567890",
    location: data.settings?.location || "Douala, CMR",
    website: data.settings?.website || "www.example.com",
    image: data.settings?.profileImageUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: data.settings?.bio || "A passionate educator and software engineer..."
  };`
);

fs.writeFileSync('src/pages/CV.tsx', code);

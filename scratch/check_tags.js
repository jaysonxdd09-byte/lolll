import fs from 'fs';

const content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
const tags = content.match(/<div|<\/div/g);

let stack = 0;
tags.forEach((tag, index) => {
    if (tag === '<div') stack++;
    else stack--;
    console.log(`${index}: ${tag} -> ${stack}`);
});

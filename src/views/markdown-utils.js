export const getAliasesFromMd = (text) => {
  const aliases = [];
  const full = [];
  const arrayMatch = [...text.matchAll(/\[\[(.*?)\]\]/g)];

  arrayMatch.forEach((match) => {
    aliases.push(match[1]);
    full.push(match[0]);
  });
  return {aliases, full};
};

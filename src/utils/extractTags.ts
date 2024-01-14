function extractTags(text: string): { tag: string; content: string }[] {
  const tagPattern = /<([^>]+)>(.*?)<\/\1>/g;
  const matches: { tag: string; content: string }[] = [];
  let match;

  while ((match = tagPattern.exec(text)) !== null) {
    const [, tag, content] = match;
    matches.push({ tag, content });
  }

  return matches;
}

export default extractTags;

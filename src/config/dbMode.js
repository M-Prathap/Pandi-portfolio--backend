export function useFileDb() {
  const uri = process.env.MONGODB_URI || '';
  return (
    process.env.USE_FILE_DB === 'true' ||
    uri === 'file' ||
    uri === 'memory' ||
    !uri.startsWith('mongodb') ||
    uri.includes('<PASSWORD>') ||
    uri.includes('YOUR_DB_PASSWORD')
  );
}

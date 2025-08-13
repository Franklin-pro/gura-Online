// lib/api.ts
export const checkApiStatus = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}/health`);
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'healthy' || data.status === 'ok';
  } catch (error) {
    return false;
  }
};
'use server';

const SESSION_COOKIE_NAME = "enh_cart_sid";
const INITIAL_SESSION_EXPIRES = 15; // minutes - for initial cart session
const CHECKOUT_SESSION_EXPIRES = 30; // minutes - for checkout session

export async function setSessionIdCookie(
  sessionId: string, 
  isCheckout: boolean = false
): Promise<void> {
  // Use different expiration times based on context
  const expirationMinutes = isCheckout ? CHECKOUT_SESSION_EXPIRES : INITIAL_SESSION_EXPIRES;
  const expires = new Date(Date.now() + expirationMinutes * 60 * 1000); // Fixed calculation
  
  const cookie = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : ''
  ].filter(Boolean).join('; ');
  
  // For server components
  if (typeof document === 'undefined') {
    const { cookies } = await import('next/headers');
    (await cookies()).set({
      name: SESSION_COOKIE_NAME,
      value: sessionId,
      expires,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  } else {
    // For client components
    document.cookie = cookie;
  }
}

export async function getSessionIdCookie(): Promise<string | undefined> {
  // Server component handling
  if (typeof document === 'undefined') {
    const { cookies } = await import('next/headers');
    return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  }
  
  // Client component handling
  const name = SESSION_COOKIE_NAME + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  return decodedCookie.split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name))
    ?.substring(name.length);
}

export async function removeSessionIdCookie(): Promise<void> {
  if (typeof document === 'undefined') {
    const { cookies } = await import('next/headers');
    (await cookies()).delete(SESSION_COOKIE_NAME);
  } else {
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
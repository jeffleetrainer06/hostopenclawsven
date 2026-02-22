export interface CustomerPortal {
  customerId: number;
  portalToken: string;
  expiresAt: number; // Unix timestamp
  createdAt: number;
  accessCount: number;
  lastAccessedAt?: number;
  isActive: boolean;
}

/**
 * Generate a unique portal token for a customer
 */
export function generatePortalToken(customerId: number): string {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now().toString(36);
  return `${customerId}-${timestamp}-${randomPart}`;
}

/**
 * Generate a portal invite link for a customer
 */
export function generatePortalLink(customerName: string, customerId: number, baseUrl: string = ''): {
  token: string;
  url: string;
  expiresAt: number;
  message: string;
} {
  const token = generatePortalToken(customerId);
  const expiresAt = Date.now() + (90 * 24 * 60 * 60 * 1000); // 90 days from now
  const url = `${baseUrl}/portal/${token}`;

  const message = `Hi ${customerName}! 👋

I've set up a personalized portal for you to:

✅ Browse our inventory
✅ Schedule test drives
✅ Get instant trade-in values
✅ Apply for financing
✅ Message me directly

Your secure link (valid for 90 days):
🔗 ${url}

Let me know if you have any questions!

- Jeff Lee
Pedersen Toyota
(970) 223-2804`;

  return {
    token,
    url,
    expiresAt,
    message,
  };
}

/**
 * Get a shareable text message with the portal link
 */
export function getPortalInviteSMS(customerName: string, portalUrl: string): string {
  return `Hi ${customerName}! Jeff from Pedersen Toyota here. I've set up your personal shopping portal: ${portalUrl} (valid 90 days). Questions? Text me back! 🚗`;
}

/**
 * Get an email-formatted invite
 */
export function getPortalInviteEmail(customerName: string, portalUrl: string): {
  subject: string;
  body: string;
} {
  return {
    subject: `Your Personal Shopping Portal - Pedersen Toyota`,
    body: `Hi ${customerName},

Thank you for your interest in Pedersen Toyota! I've created a personalized portal just for you.

With your portal, you can:
• Browse our current inventory
• Schedule test drives at your convenience
• Get instant trade-in valuations
• Apply for pre-approved financing
• Message me directly with questions

Your secure access link (valid for 90 days):
${portalUrl}

I'm here to help make your car shopping experience as smooth as possible!

Best regards,
Jeff Lee
Sales Consultant
Pedersen Toyota
(970) 223-2804
jlee@pedersentoyota.com`,
  };
}

/**
 * Check if a portal is still valid
 */
export function isPortalValid(portal: CustomerPortal): boolean {
  return portal.isActive && Date.now() < portal.expiresAt;
}

/**
 * Calculate days remaining for a portal
 */
export function getDaysRemaining(expiresAt: number): number {
  const msRemaining = expiresAt - Date.now();
  return Math.max(0, Math.floor(msRemaining / (24 * 60 * 60 * 1000)));
}

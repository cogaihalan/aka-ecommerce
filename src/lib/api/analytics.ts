import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Initialize and return the Google Analytics Data API client
 * @returns Object containing the client instance and property ID
 * @throws Error if required credentials are missing
 */
export function getAnalyticsClient() {
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const propertyId = process.env.GA_PROPERTY_ID;

  if (!privateKey || !clientEmail || !propertyId) {
    throw new Error("Missing Google Analytics credentials");
  }

  return {
    client: new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
    }),
    propertyId,
  };
}

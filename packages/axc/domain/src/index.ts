/**
 * Domain extension point.
 * Add aggregates and domain services here.
 * This package must not import REST, Hono, Azure Functions, Mongoose,
 * persistence implementations, or composition code.
 */
export const domainLayer = 'axc-domain' as const;

/**
 * Persistence extension point.
 * Future repository ports belong here and depend on the domain, not on Mongoose.
 */
export const persistenceLayer = 'axc-persistence' as const;

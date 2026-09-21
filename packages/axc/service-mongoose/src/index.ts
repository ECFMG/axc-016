import type { ServiceBase } from '@cellix/api-services-spec';
import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import mongoose from 'mongoose';

/**
 * Extension point for Mongoose infrastructure services.
 * Register future ServiceBase implementations from @apps/api through @cellix/api-core.
 * Persistence adapters should be built with @cellix/mongoose-seedwork.
 */
export interface MongooseInfrastructureReference {
	readonly mongooseVersion: string;
	readonly seedwork: typeof MongooseSeedwork;
}

export function mongooseInfrastructureReference(): MongooseInfrastructureReference {
	return {
		mongooseVersion: mongoose.version,
		seedwork: MongooseSeedwork,
	};
}

export type { ServiceBase };

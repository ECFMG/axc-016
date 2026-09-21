import { describeDependencyRulesTests } from './test-suites/dependency-rules.js';

describeDependencyRulesTests({
	packagesGlob: '../../axc/**',
	domainFolder: '../../axc/domain',
	persistenceFolder: '../../axc/persistence',
	applicationServicesFolder: '../../axc/application-services',
	restFolder: '../../axc/rest',
	infrastructurePattern: '../../axc/service-mongoose/**',
	restInfrastructurePattern: '../../axc/service-mongoose/**',
});

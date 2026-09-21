import { Then, When } from '@cucumber/cucumber';
import { Ensure, equals } from '@serenity-js/assertions';
import { actorCalled, Interaction, Question } from '@serenity-js/core';
import { infrastructure } from '../infrastructure.ts';

interface HealthBody {
	status: string;
	service: string;
	projectCode: string;
	environment: string;
	timestamp: string;
}

let lastStatus = 0;
let lastBody: HealthBody = {
	status: '',
	service: '',
	projectCode: '',
	environment: '',
	timestamp: '',
};

const requestHealth = () =>
	Interaction.where('#actor requests GET /health', async () => {
		const response = await fetch(new URL('/health', infrastructure.getState().baseUrl));
		lastStatus = response.status;
		lastBody = (await response.json()) as HealthBody;
	});

const responseStatus = () => Question.about('HTTP status', () => lastStatus);
const healthField = (field: keyof HealthBody) => Question.about(`health ${field}`, () => lastBody[field]);
const timestampIsIso = () =>
	Question.about('ISO-8601 health timestamp', () => {
		const timestamp = lastBody.timestamp;
		return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(timestamp) && !Number.isNaN(Date.parse(timestamp));
	});

When('the client requests the health endpoint', async () => {
	await actorCalled('API client').attemptsTo(requestHealth());
});

Then('the response status is 200', async () => {
	await actorCalled('API client').attemptsTo(Ensure.that(responseStatus(), equals(200)));
});

Then('the health payload reports status {string}', async (status: string) => {
	await actorCalled('API client').attemptsTo(Ensure.that(healthField('status'), equals(status)));
});

Then('the health payload reports service {string}', async (service: string) => {
	await actorCalled('API client').attemptsTo(Ensure.that(healthField('service'), equals(service)));
});

Then('the health payload reports projectCode {string}', async (projectCode: string) => {
	await actorCalled('API client').attemptsTo(Ensure.that(healthField('projectCode'), equals(projectCode)));
});

Then('the health payload reports environment {string}', async (environment: string) => {
	await actorCalled('API client').attemptsTo(Ensure.that(healthField('environment'), equals(environment)));
});

Then('the health payload reports an ISO-8601 timestamp', async () => {
	await actorCalled('API client').attemptsTo(Ensure.that(timestampIsIso(), equals(true)));
});

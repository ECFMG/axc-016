'use strict';

const { mkdirSync } = require('node:fs');
const { configure, ArtifactArchiver } = require('@serenity-js/core');
const { SerenityBDDReporter } = require('@serenity-js/serenity-bdd');

// Cucumber loads this file as CommonJS. Configuring the crew here keeps it on the
// same @serenity-js/core instance as the Cucumber listener. An ESM configure() call
// attaches the crew to a different instance and no scenario JSON is written.
const outputDirectory = 'target/site/serenity';
mkdirSync(outputDirectory, { recursive: true });
configure({
	crew: [ArtifactArchiver.fromJSON({ outputDirectory }), SerenityBDDReporter.fromJSON({ specDirectory: 'features' })],
});

module.exports = require('@serenity-js/cucumber').default;

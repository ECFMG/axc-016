import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = join(packageDir, 'target/site/serenity');
const scenarioTitle = 'GET /health returns the agentCourses health contract';
const indexPath = join(reportDir, 'index.html');

const outcomes = successOutcomes(reportDir);
if (outcomes.length === 0) {
	console.error('Serenity report failed: index.html is not enough. A scenario outcome JSON with result SUCCESS for "' + scenarioTitle + '" is required.');
	process.exit(1);
}

const result = spawnSync('pnpm', ['exec', 'serenity-bdd', 'run', '--source', reportDir, '--destination', reportDir], {
	cwd: packageDir,
	encoding: 'utf8',
});
process.stdout.write(result.stdout ?? '');
process.stderr.write(result.stderr ?? '');
if ((result.status ?? 1) !== 0) {
	console.error('serenity-bdd run failed');
	process.exit(result.status ?? 1);
}

const html = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
if (!passedScenarioReport(html)) {
	console.error('Serenity HTML report does not include the passed GET /health scenario');
	process.exit(1);
}
console.log(outcomes.length + ' Serenity scenario' + (outcomes.length === 1 ? '' : 's') + ' passed, including ' + scenarioTitle);
console.log('Serenity HTML report: ' + indexPath);

function successOutcomes(dir) {
	return listJson(dir).filter((file) => {
		if (!basename(file).startsWith('scenario-')) {
			return false;
		}
		let report;
		try {
			report = JSON.parse(readFileSync(file, 'utf8'));
		} catch {
			return false;
		}
		const title = report.title || report.name;
		return title === scenarioTitle && report.result === 'SUCCESS';
	});
}

function passedScenarioReport(html) {
	const zeroTests = /test-count-title[\s\S]{0,200}0 tests/.test(html);
	return html.includes(scenarioTitle) && !zeroTests;
}

function listJson(dir, files = []) {
	if (!existsSync(dir)) {
		return files;
	}
	for (const name of readdirSync(dir)) {
		const path = join(dir, name);
		if (statSync(path).isDirectory()) {
			listJson(path, files);
		} else if (name.endsWith('.json')) {
			files.push(path);
		}
	}
	return files;
}

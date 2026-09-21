const execPath = process.env.npm_execpath ?? '';
if (!execPath.includes('pnpm')) {
	console.error('Install dependencies with pnpm. npm and yarn are not allowed.');
	process.exit(1);
}

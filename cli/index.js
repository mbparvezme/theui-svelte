#!/usr/bin/env node

/**
 * `npx theui ai`
 *
 * Points the project's coding agent at the library's own instructions.
 *
 * Agents read their rules from the project root, not from inside `node_modules`, so a
 * package can ship an `AGENTS.md` and still never be seen. This writes a short block
 * into whichever instruction files the project already has, each one naming the path to
 * the installed rules.
 *
 * A pointer rather than a copy, for two reasons: it cannot overwrite rules the project
 * already wrote, and it cannot go stale - upgrading the package upgrades what the agent
 * reads. `--copy` covers the case where the rules need to be committed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = resolve(HERE, '..');
const VERSION = JSON.parse(readFileSync(join(PKG_ROOT, 'package.json'), 'utf8')).version;

const RULES = 'AGENTS.md';
const COPY_DIR = '.theui-svelte';
const DOCS = 'https://www.theui.dev/svelte/llms.txt';

const argv = process.argv.slice(2);
const flag = (...names) => names.some((n) => argv.includes(n));

const COPY = flag('--copy');
const DRY = flag('--dry', '--dry-run');

/* -------------------------------------------------------------------- terminal --- */

const COLOR = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR && process.env.TERM !== 'dumb';
const paint = (code) => (s) => (COLOR ? `\u001b[${code}m${s}\u001b[0m` : String(s));
const bold = paint(1);
const dim = paint(2);
const green = paint(32);
const cyan = paint(36);
const yellow = paint(33);
const red = paint(31);

// A legacy Windows console renders these as mojibake; Windows Terminal and every POSIX
// terminal are fine.
const UNICODE = process.platform !== 'win32' || Boolean(process.env.WT_SESSION);
const TICK = UNICODE ? '\u2713' : '+';
const DOT = UNICODE ? '\u00b7' : '-';

const say = (line = '') => console.log(line);

/* ---------------------------------------------------------------- the targets --- */

const START = '<!-- theui-svelte:start -->';
const END = '<!-- theui-svelte:end -->';

/**
 * Where the rules can be pointed from.
 *
 * An `always` file is created when missing, because a run has to leave at least one file
 * carrying the pointer. The rest are only touched when the project shows it uses that
 * tool - either the file is already there, or `needs` names a directory the tool owns.
 * Writing a `CLAUDE.md` into a project that does not use Claude Code would be noise.
 *
 * `own` marks a file this command writes whole rather than appending to, and holds the
 * frontmatter that file format needs.
 */
const TARGETS = [
	{
		// The cross-tool standard: Codex, Cursor, Copilot, Zed, Aider, Jules and the
		// Gemini CLI all read it, and Claude Code falls back to it when a project has no
		// CLAUDE.md. One file, most of the ecosystem.
		file: 'AGENTS.md',
		label: 'the AGENTS.md standard',
		always: true
	},
	{
		// Claude Code reads CLAUDE.md and stops there - the AGENTS.md fallback applies
		// only when no CLAUDE.md sits above the file being edited. A project with one
		// needs its own pointer, and `@path` pulls the rules in as a real import.
		file: 'CLAUDE.md',
		label: 'Claude Code',
		claudeImport: true
	},
	{
		file: '.github/copilot-instructions.md',
		label: 'GitHub Copilot'
	},
	{
		// Cursor reads the frontmatter to decide when a rule applies; `alwaysApply` keeps
		// it in context rather than waiting to be matched.
		file: '.cursor/rules/theui-svelte.mdc',
		label: 'Cursor',
		needs: '.cursor',
		own: '---\ndescription: theui-svelte component library\nalwaysApply: true\n---\n\n'
	},
	{
		file: '.windsurf/rules/theui-svelte.md',
		label: 'Windsurf',
		needs: '.windsurf',
		own: '---\ntrigger: always_on\n---\n\n'
	},
	{
		file: 'GEMINI.md',
		label: 'Gemini CLI',
		needs: '.gemini'
	}
];

/* ------------------------------------------------------------------ the block --- */

/** The pointer block, as it goes into an instruction file. */
const block = (pointer, claudeImport) => {
	const lines = [
		START,
		'',
		`## theui-svelte v${VERSION}`,
		'',
		'This project builds its UI with **theui-svelte**, a Svelte 5 component library on',
		'Tailwind CSS v4.',
		'',
		'Before writing or changing any code that uses one of its components, read:',
		'',
		`\`${pointer}\``,
		'',
		'That file carries what the type definitions cannot - which component to reach for,',
		'how the compound families compose, which children throw without their parent, and',
		'the gotchas that fail silently rather than erroring.',
		'',
		'Prop names and types are in the bundled `.d.ts` files, so trust those for the shape',
		'of a component and the file above for the intent behind it.',
		'',
		`Documentation as Markdown: ${DOCS}`,
		''
	];
	if (claudeImport) lines.push(`@${pointer}`, '');
	lines.push(END);
	return lines.join('\n');
};

/* ------------------------------------------------------------------ the write --- */

/**
 * Writes the block into one file without disturbing what is already in it.
 *
 * Re-running replaces the old block in place, so the pointer tracks the installed
 * version instead of copies stacking up. An existing file keeps its own line endings - a
 * CRLF file handed LF content reads as modified on every line.
 */
function upsert(abs, text, own) {
	const before = existsSync(abs) ? readFileSync(abs, 'utf8') : null;
	const eol = before && before.includes('\r\n') ? '\r\n' : '\n';
	const body = eol === '\n' ? text : text.replace(/\n/g, eol);

	let after;
	if (own || before === null || before.trim() === '') {
		// A file this command owns, one that does not exist, or one with nothing in it
		// worth keeping above the block.
		after = (own ? own.replace(/\n/g, eol) : '') + body + eol;
	} else {
		const from = before.indexOf(START);
		const to = before.indexOf(END);
		after =
			from !== -1 && to > from
				? before.slice(0, from) + body + before.slice(to + END.length)
				: // Appended, never prepended: the top of one of these files is where the
					// person put what they most wanted their agent to read first.
					before.replace(/\s*$/, '') + eol + eol + body + eol;
	}

	if (after === before) return 'unchanged';
	if (!DRY) {
		mkdirSync(dirname(abs), { recursive: true });
		writeFileSync(abs, after);
	}
	return before === null ? 'created' : 'updated';
}

/* -------------------------------------------------------------------- lookups --- */

/**
 * The installed rules file, searched for from the project upwards.
 *
 * npm hoists to a workspace root and pnpm symlinks into one, so the file is often a
 * level or more above the package that depends on it.
 */
function findInstalled(from) {
	let dir = from;
	for (;;) {
		const hit = join(dir, 'node_modules', 'theui-svelte', RULES);
		if (existsSync(hit)) return hit;
		const up = dirname(dir);
		if (up === dir) return null;
		dir = up;
	}
}

const posix = (p) => p.split('\\').join('/');

/* ------------------------------------------------------------------- commands --- */

const HELP = `
  ${bold('theui')} ${dim(`${DOT} theui-svelte v${VERSION}`)}

  ${bold('theui ai')}            Point this project's coding agent at the library's rules.

  ${dim('Options')}
    --copy           Copy the rules into ${COPY_DIR}/ and point there, so they can be
                     committed and work before anyone has run an install.
    --dry            Show what would change. Writes nothing.
    -h, --help       This.
    -v, --version    Print the installed version.

  ${dim('What it writes')}
    A short block naming the path to the rules, into the instruction files this
    project already has - ${cyan('AGENTS.md')}, ${cyan('CLAUDE.md')}, Copilot, Cursor, Windsurf,
    Gemini. The block sits between markers, so a re-run replaces it and deleting
    it removes every trace.
`;

function ai() {
	const project = process.cwd();

	if (!existsSync(join(project, 'package.json'))) {
		say();
		say(`  ${red('No package.json here.')} Run this from the root of your project.`);
		say();
		process.exitCode = 1;
		return;
	}

	// Where the block will tell the agent to look.
	let pointer;
	if (COPY) {
		const dest = join(project, COPY_DIR, RULES);
		if (!DRY) {
			mkdirSync(dirname(dest), { recursive: true });
			writeFileSync(dest, readFileSync(join(PKG_ROOT, RULES)));
		}
		pointer = `${COPY_DIR}/${RULES}`;
	} else {
		const installed = findInstalled(project);
		if (!installed) {
			say();
			say(`  ${red('theui-svelte is not installed here.')}`);
			say();
			say(`  Run ${cyan('npm i theui-svelte')} first.`);
			say(`  Or pass ${cyan('--copy')} to write the rules into the project rather than`);
			say('  pointing at the installed package.');
			say();
			process.exitCode = 1;
			return;
		}
		pointer = posix(relative(project, installed));
	}

	// Only the tools this project shows a sign of.
	const chosen = TARGETS.filter(
		(t) =>
			t.always ||
			existsSync(join(project, t.file)) ||
			(t.needs && existsSync(join(project, t.needs)))
	);

	const results = chosen.map((t) => ({
		target: t,
		state: upsert(join(project, t.file), block(pointer, t.claudeImport), t.own)
	}));

	const width = Math.max(...results.map((r) => r.target.file.length));

	say();
	say(`  ${bold('theui-svelte')} ${DOT} AI rules${DRY ? ` ${yellow('(dry run)')}` : ''}`);
	say();
	for (const { target, state } of results) {
		const tick = state === 'unchanged' ? dim(DOT) : green(TICK);
		const name = state === 'unchanged' ? dim(target.file.padEnd(width)) : target.file.padEnd(width);
		say(`  ${tick} ${name}  ${dim(state.padEnd(9))}  ${dim(target.label)}`);
	}
	say();

	const changed = results.filter((r) => r.state !== 'unchanged').length;
	if (DRY) {
		say(`  ${changed} file${changed === 1 ? '' : 's'} would change. Nothing was written.`);
	} else if (changed) {
		say(`  Your agent now reads ${cyan(pointer)}.`);
		say(`  ${dim('Start a new agent session to pick it up.')}`);
	} else {
		say(`  Everything was already current for v${VERSION}.`);
	}
	say();
}

/* ---------------------------------------------------------------------- entry --- */

const command = argv.find((a) => !a.startsWith('-'));

if (flag('-v', '--version')) {
	say(VERSION);
} else if (flag('-h', '--help') || !command) {
	say(HELP);
} else if (command === 'ai') {
	ai();
} else {
	say();
	say(`  ${red(`Unknown command: ${command}`)}`);
	say(HELP);
	process.exitCode = 1;
}

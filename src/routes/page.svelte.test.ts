import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

// The dev harness renders a slice of the library, so this doubles as a smoke test:
// if a component throws while mounting, the page never gets as far as its heading.
describe('/+page.svelte', () => {
	test('renders the harness heading', () => {
		render(Page);
		expect(screen.getByRole('heading', { level: 1, name: 'theui-svelte' })).toBeInTheDocument();
	});
});

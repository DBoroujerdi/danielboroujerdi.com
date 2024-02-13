import { render } from 'preact';
import { LocationProvider, Router, Route, hydrate, prerender as ssr } from 'preact-iso';

import { Home } from './pages/home/index.js';
import { RampTrainer, Privacy } from './pages/ramptrainer/index.js';
import { NotFound } from './pages/_404.jsx';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/ramptrainer" component={RampTrainer} />
					<Route path="/ramptrainer/privacy" component={Privacy} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

if (typeof window !== 'undefined') {
	hydrate(<App />, document.getElementById('app'));
}

export async function prerender(data) {
	return await ssr(<App {...data} />);
}


import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Home } from './pages/Home/index.jsx';
import { RampTrainer, Privacy } from './pages/RampTrainer/index.jsx';
import { NotFound } from './pages/_404.jsx';

export function App() {
	return (
		<LocationProvider>
			<main>
				<Router>
					<Route path="/" component={Home} />
					<Route path="/RampTrainer" component={RampTrainer} />
					<Route path="/RampTrainer/privacy" component={Privacy} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));

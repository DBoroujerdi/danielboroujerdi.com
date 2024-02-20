import me from '../../assets/me.jpeg';
import github from '../../assets/github.svg';
import linkedin from '../../assets/linkedin.svg';
import './style.css';

export function Home() {
	return (
		<div class="home">
			<div id="profile" class="center">
				<div id="avatar">
					<img id="avatar" src={me} alt="Daniel Boroujerdi" height="160" width="160" />
					<div>Full Stack Engineer<span></span></div>
				</div>

				<div class="margin-top">
					<a href="mailto:contact@boroujerdi.co.uk">
						contact@boroujerdi.co.uk
					</a>
				</div>

				<div class="margin-top">
					<ul>
						<li>
							<a href={"https://ramptrainer.com"}>RampTrainer Web</a>
						</li>
						<li>
							<a href="/ramptrainer">RampTrainer iOS</a>
						</li>
						<li>
							<a href="https://ergtrainer.com">ErgTrainer (coming soon)</a>
						</li>
					</ul>
				</div>
			</div>

			<div id="social-container">
				<div id="social">
					<a href="https://github.com/DBoroujerdi">
						<img src={github} alt="Github" />
					</a>
					<a href="https://www.linkedin.com/in/daniel-boroujerdi-30961a49/">
						<img src={linkedin} alt="LinkedIn" />
					</a>
				</div>
			</div>
		</div>
	);
}

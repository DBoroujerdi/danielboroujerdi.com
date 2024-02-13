import { Privacy } from './privacy';
import apple from '../../assets/apple.svg'
import './style.css';

export function RampTrainer() {
  return (
    <div class="ramp-trainer">
      <h1>RampTrainer</h1>

      <div id="ramptrainer-logo">
        RT
      </div>

      <p>
        RampTrainer simplifies your cycling training with easy FTP testing and tracking. Connect effortlessly to your BLE FTMS compatible trainers and monitor your progress over time. Whether you're training for a race or improving your fitness, RampTrainer supports cyclists at any level. It's privacy-focused, free, and does not collect personal data. Get started with RampTrainer today and see your performance improve, one ride at a time.
      </p>

      <div id="apple-logo">
        <img src={apple} onClick={() => alert("Coming soon!")} />
      </div>

      <div class="margin-top">
        <a href="/RampTrainer/privacy">
          Privacy Policy
        </a>
      </div>

      <div class="margin-top">
        <a href="mailto:contact@boroujerdi.co.uk">
          contact@boroujerdi.co.uk
        </a>
      </div>
    </div>
  );
}

export { Privacy } 

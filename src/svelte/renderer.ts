declare const window: WindowAPI;

import App from './App.svelte';
import '@fortawesome/fontawesome-free/js/all.min';
import './styles/index.scss';
import '../../res/anima_icon.png';

window.app.init();

const app = new App({ target: document.body });

export default app;
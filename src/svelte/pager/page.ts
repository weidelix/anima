let started = false;
let routes: any[] = [];
let recent: string = '';

function go(path: string) {
	if (started) {
		routes[path]();
		
		if (path !== '/details')
			recent = path;
	}
}

function back() {
	go(recent);
}

function add(path: string, last: (any) => void) {
	routes[path] = last;
}

function start(path: string) {
	started = true;
	go(path);
}

function stop() {
	started = false;
}

function prev() {
	return recent;
}

export default {
	prev,
	go,
	back,
	add,
	start,
	stop
}
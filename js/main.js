if (!Number.prototype.toRadians) {
	Number.prototype.toRadians = function() {
		return this * Math.PI / 180;
	}
}
if (!Number.prototype.toDegrees) {
	Number.prototype.toDegrees = function() {
		return this * 180 / Math.PI;
	}
}

var watchID;

const arrow = document.querySelector('.arrow');
const heading = document.querySelector('.heading-value');

class LatLon {
	constructor(lat, lon) {
		this.latitude = Number(lat);
		this.longitude = Number(lon);
	}
}

const loc = {
	origin: new LatLon(null, null),
	destination: new LatLon(null, null)
};

const calculateBearing = () => {
	const ϕ1 = (loc.origin.latitude).toRadians(); // origin lat
	const λ1 = loc.origin.longitude; // origin lon
	const ϕ2 = (loc.destination.latitude).toRadians(); // destination lat
	const λ2 = loc.destination.longitude; // destination lon
	const Δλ = (λ2 - λ1).toRadians(); // diff between longitudes
	const y = Math.sin(Δλ) * Math.cos(ϕ2);
	const x = Math.cos(ϕ1) * Math.sin(ϕ2) - Math.sin(ϕ1) * Math.cos(ϕ2) * Math.cos(Δλ);
	const θ = Math.atan2(y, x).toDegrees();
	const β = (θ + 360) % 360;
	arrow.style.transform = `rotate(-${β}deg)`;
	heading.textContent = `${Math.floor(β)}`;
	return β;
};

const setCoords = data => {
	loc.origin.latitude = loc.destination.latitude;
	loc.origin.longitude = loc.destination.longitude;
	loc.destination.latitude = data.coords.latitude;
	loc.destination.longitude = data.coords.longitude;
	!!loc.origin.latitude && calculateBearing();
};

const startIt = () => {
	watchID = navigator.geolocation.watchPosition(setCoords, stopIt);
};

const stopIt = err => {
	navigator.geolocation.clearWatch(watchID);
	if (err) {console.error(err);}
	return;
};

startIt();
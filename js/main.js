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

var watchID,
	arrow = document.getElementsByClassName('.arrow')[0],
	heading = document.getElementsByClassName('.heading-value')[0],
	LatLon = function(lat, lon) {
		this.latitude = Number(lat);
		this.longitude = Number(lon);
	},
	loc = {
		origin: new LatLon(null, null),
		destination: new LatLon(null, null)
	},
	calculateBearing = function() {
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
		heading.innerHTML = `${Math.floor(β)}`;
		return β;
	},
	setCoords = function(data) {
		loc.origin.latitude = loc.destination.latitude;
		loc.origin.longitude = loc.destination.longitude;
		loc.destination.latitude = data.coords.latitude;
		loc.destination.longitude = data.coords.longitude;
		!!loc.origin.latitude && calculateBearing();
	},
	startIt = function() {
		watchID = navigator.geolocation.watchPosition(setCoords, stopIt);
	},
	stopIt = function(err) {
		navigator.geolocation.clearWatch(watchID);
		if (err) {console.error(err);}
		return;
	};

// startIt();
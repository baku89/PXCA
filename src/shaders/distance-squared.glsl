float distanceSquared(vec2 p1, vec2 p2) {
	return pow(p1.x - p2.x, 2.0) + pow(p1.y - p2.y, 2.0);
}

#pragma glslify: export(distanceSquared)
float distanceSquared(vec2 p1, vec2 p2) {
	return pow(p1.x - p2.x, 2.0) + pow(p1.y - p2.y, 2.0);
}

float segmentDistanceSquared(vec2 p, vec2 l1, vec2 l2) {
	float a2 = distanceSquared(l1, p);
	float b2 = distanceSquared(l2, p);
	float c  = abs(distance(l1, l2));
	float c2 = c * c;

	if (a2 + c2 < b2 || b2 + c2 < a2) {
		return 10000.0;
	}

	float x = (a2 - b2 + c2) / (2.0 * c);
	return a2 - x*x;
}

bool innerSegment2(vec2 p, vec2 l1, vec2 l2, float size2) {

	if (distanceSquared(l1, l2) < 0.01) {
		return distanceSquared(p, l1) <= size2;
	} else {
		return segmentDistanceSquared(p, l1, l2) <= size2
			|| distanceSquared(p, l1) <= size2
			|| distanceSquared(p, l2) <= size2;
		}
}

#pragma glslify: export(innerSegment2)
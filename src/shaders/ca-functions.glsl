float segmentDistance( vec2 p, vec2 l1, vec2 l2) {
	float a2 = pow( distance(l1, p), 2.0 );
	float b2 = pow( distance(l2, p), 2.0 );
	float c  = abs( distance(l1, l2) );
	float c2 = c * c;

	if (a2 + c2 < b2 || b2 + c2 < a2) {
		return 10000000.0;
	}

	float x = (a2 - b2 + c2) / ( 2.0 * c);

	return sqrt(a2 - x*x);
}


bool innerSegment(vec2 p, vec2 l1, vec2 l2, float weight) {
	return segmentDistance(p, l1, l2) <= weight + 0.5
		|| distance(p, l1) <= weight + 0.5
		|| distance(p, l2) <= weight + 0.5;
}


#pragma glslify: export(innerSegment)
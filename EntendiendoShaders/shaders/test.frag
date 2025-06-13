#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
	// varying highp vec2 vPos;

float cJulia(vec2   uv){
    const int maxIteraciones = 200;
	float zr = uv.x;
	float zi = uv.y;
	float cr = sin(u_time*0.1);
	float ci = cos(u_time*.2);
	float iteraciones = 0.;

	float R = 256.;
	float RR = R*R;
	for(int i=0;i < maxIteraciones ;i++){
		float zrzrzizi = zr*zr-zi*zi;
		if( zr*zr+zi*zi > RR){
			break;
		}
		zi = 2.*zr*zi+ci;
		zr = zrzrzizi+cr;
		iteraciones++;
	}

    vec2 z = vec2(zr,zi);
	// return iteraciones/float(maxIteraciones);	
   return (iteraciones - log2(log2(dot(z,z))) + 4.0)*0.025 ;//iteracion/float(maxIteraciones);

}


void main(){
	vec2 uv = gl_FragCoord.xy/u_resolution;
    uv *= 2.;
    uv -= 1.;
    uv *= 2.;

    float brillo = cJulia(uv);
    gl_FragColor=vec4(vec3(brillo),1.);
}
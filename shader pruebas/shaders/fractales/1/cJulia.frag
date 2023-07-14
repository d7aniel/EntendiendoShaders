#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;


vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;  
	float escala = sin(u_time*0.5)+1.;
	vec2 uv = st*escala-escala;

	//formula f(z) = pow(z,2) + c donde c y z son numeros imaginarios entonces
	// f(zr+zi) = pow((zr+zi),2) + (cr + ci) 
	// f(zr+zi) = (zr*zr+2*zr*zi+zi*zi) + (cr + ci) 
	// f(zr) = zr*zr+zi+zi+cr;
	// f(zi) = 2*zr*zi+ci;

	const int maxIteraciones = 256;
	float zr = uv.x;
	float zi = uv.y;
	float cr = -0.74543;
	float ci = 0.11301;
	int iteracion = 0;

	float R = 2.;
	float RR = R*R;
	for(int i=0;i < maxIteraciones ;i++){
		float zrzrzizi = zr*zr-zi*zi;
		if( zr*zr+zi*zi > RR){
			break;
		}
		zi = 2.*zr*zi+ci;
		zr = zrzrzizi+cr;
		iteracion++;
	}

 	vec3 col = palette( float(iteracion)/float(maxIteraciones), vec3(0.405,0.31,0.22), vec3(0.465,0.305,0.715), vec3(1.0,1.0,0.5), vec3(0.74,0.865,0.125) );
   
    gl_FragColor=vec4(col,1.);
	
}
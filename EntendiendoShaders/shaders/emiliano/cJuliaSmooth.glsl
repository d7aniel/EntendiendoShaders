#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415927

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

varying vec4 vertTexCoord;

float cJuliaSmooth(vec2   uv){
    const int maxIteraciones = 50;
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


void main(  )
{
    float time = u_time*6.283185/6.0;
  
    vec4 t = time*vec4( 1.0, -1.0, 1.0, -1.0 ) + vec4(.1,.01,.03,100.01);
    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    p *= 2.5;
    float s = cJuliaSmooth(p);

   gl_FragColor=vec4( vec3(s), 1. );
}
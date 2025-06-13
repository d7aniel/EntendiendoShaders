/* Main function, uniforms & utils */
#ifdef GL_ES
    precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586



float pointTraping( vec2 uv, vec2 p )
{
    float dist = 1000000000000000000000.0;
    const int maxIteraciones = 20;
	float zr = uv.x;
	float zi = uv.y;
	// float cr = sin(450.);
	// float ci = cos(450.*.2);
	float cr = sin(10.+8.*0.264);
	float ci = cos(7.+3.*0.3714);

	float R = 2.;
	float RR = R*R;
    for( int i=0; i<maxIteraciones; i++ ){
        float zrzrzizi = zr*zr-zi*zi;
		if( zr*zr+zi*zi > RR){
			return 0.0;
		}
		zi = 2.*zr*zi+ci;
		zr = zrzrzizi+cr;
        vec2 z = vec2(zr,zi);
        float dc = length(z-p);
        dist = min( dist, dc*dc);
    }
    return sqrt( dist );
}

vec3 lineTraping( vec2 uv,float p1, float p2, vec2 p3 )
{
    float dist = 1000000000000000000.0;
    float dist2 = 1000000000000000000.0;
    float dist3 = 1000000000000000000.0;
    const int maxIteraciones =50;
	float zr = uv.x;
	float zi = uv.y;
	// float cr = sin(450.);
	// float ci = cos(450.*.2);
	float cr = sin(10.+sin(1.*0.5)*0.264);
	float ci = cos(7.+cos(7.*0.2)+3.*0.3714);

	float R = 2.;
	float RR = R*R;
    vec2 m = (u_mouse.xy/u_resolution.xy)*2.-1.; 
    for( int i=0; i<maxIteraciones; i++ ){
        float zrzrzizi = zr*zr-zi*zi;
		if( zr*zr+zi*zi > RR){
			return vec3(0.,0.,0.);
		}
		zi = 2.*zr*zi+ci;
		zr = zrzrzizi+cr;
        vec2 z = vec2(zr,zi);
        float dc = z.x-m.x;
        float dc3 = z.y-m.y;
        float dc2 = length(z-m);
        dist = min( dist, dc*dc);
        dist3 = min( dist3, dc3*dc3);
        dist2 = min( dist2, dc2*dc2);
    }
    return sqrt( vec3(dist,dist2,dist3));
}

float cJulia(vec2   uv){
    const int maxIteraciones = 50;
	float zr = uv.x;
	float zi = uv.y;
	float cr = sin(10.+sin(1.*0.5)*0.264);
	float ci = cos(7.+cos(7.*0.2)+3.*0.3714);
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

    return float(iteracion)/float(maxIteraciones);
}

mat2 rot(float ang){
    return mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
}

void main() {
    float tam = 2.002;
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy)*tam-tam/2.+vec2(-0.1205,0.0);
    uv*=rot(5.+sin(.5*.5)*7.*length(uv));
   vec3 c = vec3(0.);
   if(gl_FragCoord.x / u_resolution.x < 0.5){    
        float cf = cJulia(uv);
        c = vec3(cf*0.9);
   }else{
        vec2 p = vec2(0.2,0.3);
        c = lineTraping(uv,sin(u_time),2.,p);
   }

   
    //vec3 c = lineTraping(uv,0.5,2.,p);//pointTraping(uv,p);//cJulia(uv);
    //vec3 color = vec3(c,c,c );



    gl_FragColor = vec4(c, 1.0);
}
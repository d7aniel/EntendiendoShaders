#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592
// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;



void main(){
  	float o = sin(u_time*0.5)*.5+0.5;//0.01;//desviacion estandar
	vec2 uv =gl_FragCoord.xy;
	uv/=u_resolution;
	uv-=1.;
	float g = 1./sqrt(2.*PI*pow(o,2.)) * exp(-((pow(uv.x,2.)+pow(uv.y,2.))/(2.*pow(o,2.))));
    gl_FragColor=vec4(vec3(g),1.);
}
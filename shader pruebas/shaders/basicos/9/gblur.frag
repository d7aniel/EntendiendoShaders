#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592
// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
	// varying highp vec2 vPos;


void main(){
  	vec3 pix = vec3(0.); 
	const int apertura = 2;
	float o = sin(u_time*2.5)*.5+0.5;//0.01;//desviacion estandar
	o = max(o,.0000001);
	o *= float(apertura);
	float gSum = 0.;
	for(int i=-apertura;i<=apertura;i++)
	for(int j=-apertura;j<=apertura;j++){
		vec2 uv =gl_FragCoord.xy+vec2(float(i)*4.,float(j)*4.);
		uv/=u_resolution;
		uv*=0.5;
		uv.y=1.-uv.y;
		float x = float(i);
		float y = float(j);
		float g = 1./sqrt(2.*PI*pow(o,2.)) * exp(-((pow(x,2.)+pow(y,2.))/(2.*pow(o,2.))));
		pix += texture2D(in_graf, uv).rgb*g;
		gSum+=g;
	}
	
    gl_FragColor=vec4(pix/gSum,1.);
}
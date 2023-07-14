#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
	// varying highp vec2 vPos;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
  	vec3 pix = vec3(0.);  
	float cont = 1.;
	for(int i=-1;i<=1;i++){
		for(int j=-1;j<=1;j++){
			cont++;
			vec2 uv =gl_FragCoord.xy+vec2(float(i)*4.,float(j)*4.);
			uv/=u_resolution;
			uv*=0.5;
			uv.y=1.-uv.y;
			pix += texture2D(in_graf, uv).rgb;
		}
	}

	pix/=cont;

    gl_FragColor=vec4(pix,1.);
}
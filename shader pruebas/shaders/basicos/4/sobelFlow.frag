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

mat3 kX = mat3(
	1,0,-1,
	2,0,-2,
	1,0,-1
);
mat3 kY = mat3(
	1,2,1,
	0,0,0,
	-1,-2,-1
);


vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(){
  	float x = 0.; 
  	float y = 0.; 
	for(int i=-1;i<=1;i++){
		for(int j=-1;j<=1;j++){
			vec2 uv =gl_FragCoord.xy+vec2(float(i)*4.,float(j)*4.);
			uv/=u_resolution;
			uv*=0.5;
			uv.y=1.-uv.y;
			float pix = texture2D(in_graf, uv).r;
			x += pix*kX[i+1][j+1];
			y += pix*kY[i+1][j+1];
		}
	}
	float b = (abs(x)+abs(y))*0.5;
	float a = atan(y,x)/3.141592;
	a*=0.5;
	a+=0.5;
	vec3 col = hsv2rgb(vec3(a,1.0,b));
    gl_FragColor=vec4(col,1.);
}
#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform vec3 a;
uniform vec3 b;
uniform vec3 c;
uniform float u_time;
uniform sampler2D in_graf;
	// varying highp vec2 vPos;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
  	vec2 st = gl_FragCoord.xy/u_resolution.xy;  
	vec2 uv = st*0.5;
	uv.y = 1.-uv.y;
	st = st-vec2(1.);
  	vec3 pix = texture2D(in_graf, uv).rgb;   
	vec3 col = palette(pix.r, 
	a, 
	b, 
	vec3(1.0,1.0,0.5), 
	c );   
    gl_FragColor=vec4(col,1.);
}
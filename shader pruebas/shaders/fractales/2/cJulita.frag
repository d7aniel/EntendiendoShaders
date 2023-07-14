#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

	// varying highp vec2 vPos;
void main() {
	// vec2 uv = vTexCoord;
	vec2 st = gl_FragCoord.xy/u_resolution.xy;  
	vec2 uv = st*0.5;
	uv.y = 1.-uv.y;
	st = st-vec2(1.);
	vec3 pix = texture2D(in_graf, uv).rgb;    
    gl_FragColor=vec4(pix,1.);
	
}
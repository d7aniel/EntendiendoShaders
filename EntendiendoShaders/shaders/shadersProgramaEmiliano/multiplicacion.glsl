#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform sampler2D in_graf_1;
uniform sampler2D in_graf_2;

void main(){
  	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
	vec3 pix1 = texture2D(in_graf_1, uv).rgb;   
	vec3 pix2 = texture2D(in_graf_2, uv).rgb;   
	   
    gl_FragColor=vec4(pix1*pix2,1.);
}
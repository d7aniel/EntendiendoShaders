#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

void main(){
  	vec2 uv = gl_FragCoord.xy/u_resolution;
  	vec3 pix = texture2D(in_graf, uv).rgb;    
    gl_FragColor=vec4(pix,1.);
}
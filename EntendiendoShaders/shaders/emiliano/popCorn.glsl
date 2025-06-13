#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415927

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

varying vec4 vertTexCoord;


float a(vec2 p,float t0, float t1){
    return sin( t0 + p.x*p.y + cos(t1+.01*PI*p.y)+(p.y*p.y)*.02);
}
float b(vec2 p,float t2, float t3){
    return sin( t2 + p.y*p.x +p.x*p.x)*cos(t3+.7315*PI*p.x);
}

float c(vec2 p,float t0, float t1){
    return sin( t0 + p.x*p.y + sin(t1+13.5*PI*p.y)+p.y*p.y);
}
float d(vec2 p,float t2, float t3){
    return cos(p.y*t2*0.1+p.x*t3*0.1)*sin( t2 + p.y*p.x + sin(t3+.012345*PI*p.x)+(p.x*p.x)*.2);
}

float g(vec2 p,float t0, float t1){
    return cos( t0 + p.x*p.y + cos(t1+1.5*PI*p.y)+p.y*p.y);
}
float f(vec2 p,float t2, float t3){
    return cos( t2 + p.y*p.x + cos(t3+1.5*PI*p.x)+p.x*p.x);
}

vec2 iterate( in vec2 p, in vec4 t ){
    return p-0.05*vec2(g(p.xy,t.x,t.y),d(p.xy,t.z,t.w));
}

float popCorn(vec2 uv, vec4 t){
    vec2 z = uv;
    float s = 0.0;
    const int rep = 50;
    for( int i=0; i<rep; i++ ) {
        z = iterate( z, t );
        float d = dot( z-uv, z-uv ); 
        s += d;
    }
    return s / float(rep);
}


float random1f(float co) {
  return fract(sin(dot(vec2(co,co),vec2(12.9898, 8.573))) * 43758.5453);
}

vec3 palette2( float f, vec3 c_rand ){
    return 0.5 + 0.5*sin( random1f(f)*2.5 + 3.5 + c_rand);
}

vec3 palette( float t, vec3 a, vec3 b, vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(  )
{
    float time = u_time*6.283185/6.0;
  
    vec4 t = time*vec4( 1.0, -1.0, 1.0, -1.0 ) + vec4(.1,.01,.03,100.01);
    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    p *= 1.5;
    float s = popCorn(p+vec2(1.,3.),t);

   vec3 col = palette( s*3., vec3(0.65,0.44,0.53), vec3(0.52,0.27,0.1), vec3(1.0,0.5,0.5), vec3(1.5,0.085,0.275) );

    vec3 col2 = palette2(2.,vec3(.1,.2,.8));

   gl_FragColor=vec4( col, 1. );
}
// #version 300 es 
/*
The so called "Pop Corn"" images where created by Cliff Pickover quite some time ago. 
The idea behind them is to plot the evolution of a dynamical system like

p'(t) = v(p)

where p is a point and v is a stationary velocity field. To make such simulation in a computer, 
the simplest way is to code some simple Euler integrator which will simulate the derivative with 
some differences and a small delta time. In two dimensions, that would look like this:

xn+1 = xn + λ·f(x,y)
yn+1 = yn + λ·g(x,y)

por ejemplo:
f(x,y) = cos( t0 + y + cos(t1+ πx))
g(x,y) = cos( t2 + x + cos(t3+ πy))
*/


// #extension EXT_gpu_shader4 : require
/* Main function, uniforms & utils */

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.1415927
#define lambda 0.03

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

varying vec4 vertTexCoord;

float f(vec2 p,float t0, float t1){
    return sin( t0 + p.y * sin(t1+ PI*p.x));
}
float g(vec2 p,float t2, float t3){
    return sin( t2 + p.x * sin(t3+ PI*p.y));
}
vec2 iterate( in vec2 p, in vec2 t ){
     return p+lambda*vec2(g(p.xy,t.x,t.y),f(p.xy,t.x,t.y));
}
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(  )
{
    float time = u_time*0.4;
    
    vec2 t = time*vec2( 1.5, 1.789);
 
    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    p *= 3.5;

    float a = u_time*0.5;
    // p*=mat2(cos(a),sin(a),-sin(a),cos(a));

    float dp = length(p);
    p *= pow(dp,0.1);
    // float ap = atan(sin(u_time*0.1)*p.y,-p.x);
    // p += vec2(-ap);
    // p = vec2(dp,(p.x*p.y)/2.);

    vec2 z = p;
    float s = 0.0;
    const int rep = 50;
    for( int i=0; i<rep; i++ ) {
        z = iterate( z, t );
        float d = dot( z-p, z-p ); 
         s += d;
    }
    // s = sqrt(s);
    s /= float(rep);
    vec3 col = palette(s, 
	vec3(sin(u_time*0.5)*0.5, sin(u_time*0.0)*0.1, sin(u_time*0.05)*0.1), 
	vec3(sin(u_time*0.1)*0.1, cos(u_time*0.6235)*0.5, sin(u_time*0.2235)*0.9),
	vec3(1., 0.5, 2.), 
	vec3(sin(u_time*0.1882)*0.1, sin(u_time*0.1255)*0.1, sin(u_time*0.6471)*0.1) );   

 float s2 = 1.-0.04/sqrt(s);
   gl_FragColor=vec4( col*s2*s, 1. );
}
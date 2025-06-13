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

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

varying vec4 vertTexCoord;

float f(vec2 p,float t0, float t1){
    return cos( t0 + p.x*p.y + cos(t1+ 1.5*PI*p.y)+p.y*p.y);
}
float g(vec2 p,float t2, float t3){
    return cos( t2 + p.y*p.x + cos(t3+ 1.5*PI*p.x)+p.x*p.x);
}

vec2 iterate( in vec2 p, in vec4 t ){
     return p-0.05*vec2(g(p.xy,t.x,t.y),f(p.xy,t.z,t.w));
}

vec2 iterate2( in vec2 p, in vec4 t ){
    // return p - 0.05*sin(p.yx+tan(t.zy * p.yx));//cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
    return p - 0.05*
    cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
}

void main(  )
{
    float time = u_time*6.283185/6.0;
    
    vec4 t = time*vec4( 1.5, 1.789, -.147, -.14795 ) + vec4(1.789,.8,.50,.15);
 
    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    p *= 3.5;

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

   gl_FragColor=vec4( vec3(s), 1. );
}
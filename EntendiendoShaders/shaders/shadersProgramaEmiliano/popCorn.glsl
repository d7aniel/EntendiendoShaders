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
*/


// #extension EXT_gpu_shader4 : require
/* Main function, uniforms & utils */

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

varying vec4 vertTexCoord;

vec2 iterate( in vec2 p, in vec4 t ){
    // return p - 0.05*sin(p.yx+tan(t.zy * p.yx));//cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
    return p - 0.05*cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
}

void main(  )
{
    float time = u_time*6.283185/60.0;
    
    vec4 t = time*vec4( 1.0, -1.0, 1.0, -1.0 ) + vec4(0.0,2.0,3.0,1.0);
    vec2 e = vec2(1.0 / u_resolution.x,0.);//1 pixels normalizado hacia la derecha

    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    vec2 px = p+e.xy;
    vec2 py = p+e.yx;
    p *= 5.;
    px *= 5.;
    py *= 5.;

    

    vec2 z = p;
    vec2 zx = px;
    vec2 zy = py;
    vec3 s = vec3(0.0);
    vec3 sx = vec3(0.0);
    vec3 sy = vec3(0.0);
    const int rep = 50;
    float dd = 0.;
    for( int i=0; i<rep; i++ ) {
        z = iterate( z, t );
        float d = dot( z-p, z-p ); 
        s.x += 1.0/(0.1+d);
        s.y += sin(atan( p.x-z.x, p.y-z.y ));
        s.z += exp(-0.2*d );

        zx = iterate( zx, t );
        float dx = dot( zx-px, zx-px ); 
        sx.x += 1.0/(0.1+dx);
        sx.y += sin(atan( px.x-zx.x, px.y-zx.y ));
        sx.z += exp(-0.2*dx );
    
        zy = iterate( zy, t );
        float dy = dot( zy-py, zy-py ); 
        sy.x += 1.0/(0.1+dy);
        sy.y += sin(atan( py.x-zy.x, py.y-zy.y ));
        sy.z += exp(-0.2*dy );

        dd+=d;
    }
    dd /= float(rep);
    s /= float(rep);
    sx /= float(rep);
    sy /= float(rep);

    // vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    
    // vec4 pix = texture( in_graf, uv );
    // vec4 pixDifX = texture( in_graf, uv+e.xy );
    // vec4 pixDifY = texture( in_graf, uv+e.yx );
    // float d = (pix.x+pix.y+pix.z)/3.;
    // float dX = (pixDifX.x+pixDifX.y+pixDifX.z)/3.;
    // float dY = (pixDifY.x+pixDifY.y+pixDifY.z)/3.;

float d = 1./(s.x*s.x);
float dX = 1./(sx.x*sx.x);
float dY = 1./(sy.x*sy.x);
    vec3 nor = normalize( vec3( dX - d, e.x, dY - d ) );

    vec3 col = 0.5 + 0.5*cos( vec3(0.0,0.4,0.8) + 2.5 + s.z*6.2831 );

    // col *= 0.5 + 0.5*s.y;
    // col *= s.x;
    // col *= 0.94+0.06*sin(10.0*length(z));
    

    // vec3 nor = normalize( vec3( dFdx(s.x), 0.02, dFdy(s.x) ) );
    // float dif = dot( nor, vec3(0.7,0.1,0.7) );
    // col -= 0.05*vec3(dif);

    // col *= 3.2/(3.0+col);
    
   gl_FragColor=vec4( vec3(dd), 1. );
}






//         vec2 p = (-iResolution.xy + 2.0*fragCoord)/iResolution.y;
//         p *= 1.5;	

//         vec2 z = p;
//         vec3 s = vec3(0.0);
//         for( int i=0; i<100; i++ ) 
//         {
//             z = iterate( z, t );

//             float d = dot( z-p, z-p ); 
//             s.x += 1.0/(0.1+d);
//             s.y += sin(atan( p.x-z.x, p.y-z.y ));
//             s.z += exp(-0.2*d );
//         }
//         s /= 100.0;

//         vec3 col = 0.5 + 0.5*cos( vec3(0.0,0.4,0.8) + 2.5 + s.z*6.2831 );

//         col *= 0.5 + 0.5*s.y;
//         col *= s.x;
//         col *= 0.94+0.06*sin(10.0*length(z));

//         vec3 nor = normalize( vec3( dFdx(s.x), 0.02, dFdy(s.x) ) );
//         float dif = dot( nor, vec3(0.7,0.1,0.7) );
//         col -= 0.05*vec3(dif);

//         col *= 3.2/(3.0+col);
        
	

// 	vec2 q = fragCoord / iResolution.xy;
// 	col *= 0.3 + 0.7*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.2 );
	
// 	fragColor = vec4( tot, 1.0 );
// }






// void mainImage( out vec4 fragColor, in vec2 fragCoord )
// {
    // float time = iTime*6.283185/60.0;
    
    // vec4 t = time*vec4( 1.0, -1.0, 1.0, -1.0 ) + vec4(0.0,2.0,3.0,1.0);

    // vec3 tot = vec3(0.0);
    
    // #if AA>1
    // for( int m=0; m<AA; m++ )
    // for( int n=0; n<AA; n++ )
    // {
        // // pixel coordinates
        // vec2 o = vec2(float(m),float(n)) / float(AA) - 0.5;
        // vec2 p = (-iResolution.xy + 2.0*(fragCoord+o))/iResolution.y;
        // #else    
        // #endif

            // tot += col;
    // #if AA>1
    // }
    // tot /= float(AA*AA);
    // #endif


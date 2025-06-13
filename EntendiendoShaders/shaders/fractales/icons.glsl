#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

float lambda ;
float alpha ;
float beta ;
float gamma ;
float omega ;


varying vec4 vertTexCoord;


vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}


vec2 iterate( in vec2 v, in vec4 z ){
    // lambda = -2.8;//*z.x;
    // alpha = 2.8;//*z.y;
    // beta = .50;//*z.z;
    // gamma = .1;//*z.w;
    // omega = 0.;//*z.y;
    lambda = z.x;
    alpha = z.y;
    beta = z.z;
    gamma = z.w;
    omega = 0.7;


//iiteracion formulas
//x(n+1) = p * x(n) + gamma*zreal-omega*y(n);
//x(n+1) = p * x(n) + gamma*zreal-omega*y(n);
    float  p = lambda+alpha*length(v.xy)+beta*(v.x*v.x-v.y*v.y);
    float x = p * v.x + gamma*v.x-omega*v.y;
    float y = p * v.y - gamma*v.y+omega*v.x;
    return vec2(x,y);
    //  return p - 0.05*cos(t.xz + p.x*p.y + cos(t.yw+1.5*3.1415927*p.yx)+p.yx*p.yx );
}

bool isnan( float val ){
  return ( val < 0.0 || 0.0 < val || val == 0.0 ) ? false : true;
}

void main(  )
{
    float time = u_time*6.283185/60.0;
    
    vec4 t = u_time*vec4( .5, -0.2, .01, -0.1 ) + vec4(10.0,5.0,4.0,1.0);
    t = sin(t);
    vec2 p = (-u_resolution.xy + 2.0*gl_FragCoord.xy)/u_resolution.y;
    p *= 1.09;    

    vec2 z = p;
    float s = 0.;
    const int rep = 50;

    for( int i=0; i<rep; i++ ) {
        z = iterate( z, t );
        float d = dot( z-p, z-p ); 
        if(isnan(d)){
            break;
        }  
        if(d<1.){      
            s+=.7/(0.1+d);    
        }
    }
    float a=s/float(rep)*0.5;
    
    vec3 col = palette(a, 
	vec3(0.0902, 0.3451, 0.8157), 
	vec3(0.1647, 0.0431, 0.3451), 
	vec3(1.0,1.0,0.5), 
	vec3(0.5333, 0.5843, 0.2706) );   

   gl_FragColor=vec4( vec3(a)*col, 1. );
//    gl_FragColor=vec4( col, 1. );
}




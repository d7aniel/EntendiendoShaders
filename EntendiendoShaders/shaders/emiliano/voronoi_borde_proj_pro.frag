#ifdef GL_ES
precision highp float;
#endif

//el mejor borde sin erroes pero tambien el mas costoso computacionamente

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
const float PI=3.14159265359;

vec2 random2f(vec2 co) {
  return vec2(fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),fract(sin(dot(co,vec2(45.9898, 15.765))) * 43758.5453));
}

float voronoiBorde( vec2 x ){
    vec2 p = floor( x );
    vec2  f = fract( x );

    vec2 mb;
    vec2 mbo;

    float res = 8.0;
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 b = vec2(i, j);
		vec2 o = random2f(p+b);
		o = 0.5 + 0.5*sin( u_time + 6.2831*o );   
        vec2  bo = b + o;
        vec2  r = bo -f;
        float d = dot(r,r);

        if( d < res ){
            res = d;            
            mbo = bo;
            mb = b;
        }
    }

    res = 8.0;    
    const int difN = 2;
    for( int j=-difN; j<=difN; j++ )
    for( int i=-difN; i<=difN; i++ )
    {
        vec2 b = mb + vec2(i, j);
		vec2 o = random2f(p+b);
		o = 0.5 + 0.5*sin( u_time + 6.2831*o );   
        vec2 bo = b + o;
        vec2 centro = (mbo+bo)*0.5;
        vec2 c = bo-mbo;//vector entre los dos puntos para proyeccion
        float proj = dot(centro-f,normalize(c));
        res = min(res,proj);
    }
    return res;
}

void main(){
	vec2 uv=(gl_FragCoord.xy/u_resolution.xy);
	float escalaNoise=10.;	   
	float f = voronoiBorde(uv.xy*escalaNoise);
     vec3 d = vec3(0);
    // d = vec3(1.0,0.0,0.0)*sin(f*60.);
    d+=0.05/f;
	gl_FragColor=vec4(vec3(d),1.);
}
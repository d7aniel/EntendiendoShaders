#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
const float PI=3.14159265359;

//el mas rpaido y eficiente de los bordes pero tambien tiene muchos errores graficamente
//Si solo se va a usar como un b;ppm esta bueno
//en le main se puede decomentar una inea para ver las lineas de topografia

vec2 random2f(vec2 co) {
  return vec2(fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),fract(sin(dot(co,vec2(45.9898, 15.765))) * 43758.5453));
}

float voronoiBorde( vec2 x )
{
    vec2 p = floor( x );
    vec2  f = fract( x );

    float res = 8.0;
    float res2 = 8.0;
    vec2 id = vec2(0.);
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 b = vec2( i, j );
		vec2 o = random2f(p+b);
		o = 0.5 + 0.5*sin( u_time + 6.2831*o );   	
        vec2 r = b-f+o;
        float d = dot(r,r);
        if(d<res){
  		    res2 = res; 
  		    res = d; 
        }else if(d<res2){
             res2 = d; 
        }
    }
    return res2-res;
}

void main(){
	vec2 uv=(gl_FragCoord.xy/u_resolution.xy);
	float escalaNoise=10.;		
	float f =voronoiBorde(uv.xy*escalaNoise);
    vec3 d = vec3(0);
    // d = vec3(1.0,0.0,0.0)*sin(f*30.);
    d+=0.09/f;
	gl_FragColor=vec4(vec3(d),1.);
}
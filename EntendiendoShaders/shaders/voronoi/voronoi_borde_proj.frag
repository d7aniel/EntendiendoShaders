#ifdef GL_ES
precision highp float;
#endif
//bueno para usar como borde pero donde se jutan los tres bordes
//tiene un errorsito y las lineas de topografia son todas medio raras
//porque los puntos menores no siempre son relativos al menor 
//descomentar la linea en el main para ver

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
const float PI=3.14159265359;

vec2 random2f(vec2 co) {
  return vec2(fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),fract(sin(dot(co,vec2(45.9898, 15.765))) * 43758.5453));
}

float voronoiBorde( in vec2 x){
    vec2 p = floor( x );
    vec2  f = fract( x );

    vec2 ba = vec2(0.);
    vec2 bb = vec2(0.);
    vec2 res = vec2( 8.0 );
    for( int j=-1; j<=1; j++ )
    for( int i=-1; i<=1; i++ )
    {
        vec2 b = vec2( i, j );
		vec2 o = random2f(p+b);
		o = 0.5 + 0.5*sin( u_time + 6.2831*o );   	
        vec2 r = b-f+o;
        float d = dot(r,r);    

        if( d < res.x ){
            res.y = res.x;
            res.x = d;          
            bb = ba;
            ba = r;
        }
        else if( d < res.y ){
            res.y = d;
            bb = r;
        }
    }
    return dot(0.5*(ba+bb),normalize(bb-ba));
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
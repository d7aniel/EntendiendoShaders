#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
const float PI=3.14159265359;

vec2 random2f(vec2 co) {
  return vec2(fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),fract(sin(dot(co,vec2(45.9898, 15.765))) * 43758.5453));
}

vec2 voronoi( vec2 x )
{
    vec2 p = floor( x );
    vec2  f = fract( x );

    float res = 8.0;
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
  		    res = d; 
            id = p+b;//min( res,d );
        }
    }
    return id;
}

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;  
	vec2 uv = st*0.5;
	uv.y = 1.-uv.y;
	st = st-vec2(1.);
	float escalaNoise=80.;		
	vec2 f =voronoi(uv.xy*escalaNoise);
    vec3 pix = texture2D(in_graf, f/escalaNoise).rgb;    
	gl_FragColor=vec4(pix,1.);
}
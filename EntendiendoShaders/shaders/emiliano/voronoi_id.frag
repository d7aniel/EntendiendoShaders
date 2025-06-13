#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
const float PI=3.14159265359;

float random1f(vec2 co) {
  return fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453);
}

vec2 random2f(vec2 co) {
  return vec2(fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),fract(sin(dot(co,vec2(45.9898, 15.765))) * 43758.5453));
}

float voronoi( in vec2 x, out vec2 id )
{
    vec2 p = floor( x );
    vec2  f = fract( x );

    float res = 8.0;
    // vec2 id = vec2(0.);
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
    return res;
}

  vec2 voronoiID( in vec2 st , in vec2 escala , in float u_time  ){
      vec2 id = vec2(0.0,0.0);
    //   st.x *= u_resolution.x/u_resolution.y;
      float color = 0.0;
      st *= escala;
      vec2 i_st = floor(st);
      vec2 f_st = fract(st);
      vec2 diff = vec2(0);
      float m_dist = 8.0;  // minimum distance
      for (int y= -1; y <= 1; y++) {
          for (int x= -1; x <= 1; x++) {
              vec2 neighbor = vec2(float(x),float(y));
              vec2 suma = i_st + neighbor;
              vec2 point = random2f( suma );
              point = 0.5 + 0.5 * sin( u_time + 6.2831 * point );
              vec2 diff = neighbor + point - f_st;
              float dist = dot(diff,diff);
              if(dist<m_dist){
              m_dist = dist;
                id = i_st+neighbor;
              }
          }
      }
      return id/escala;
  }

vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 palette2( float f, vec3 c_rand ){
    return 0.5 + 0.5*sin( random1f(vec2(f,f)+vec2(7.0,113.0))*2.5 + 3.5 + c_rand);
}

void main(){
	vec2 uv=(gl_FragCoord.xy/u_resolution.xy);
	float escalaNoise=10.;		
    vec2 id = vec2(0.);
	float f =voronoi(uv.xy*escalaNoise,id);
    float rnd = random1f(id);
    vec2 escala = vec2(15.0,14.0);
    vec2 ff = voronoiID( uv , escala , u_time );
    vec3 col = palette( rnd,vec3(1.0,0.5,0.4),vec3(1.0,0.3,1.4),vec3(1.5),vec3(0.9,0.7,0.24));
    vec3 col2 = palette2( rnd,vec3(10.0,5.5,5.4));
	gl_FragColor=vec4(vec3(ff.xyy),1.);
}
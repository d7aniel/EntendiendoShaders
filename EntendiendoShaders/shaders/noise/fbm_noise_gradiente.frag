#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 random3fV3(vec3 co) {
  return vec3(
    -1.+2.*fract(sin(dot(co,vec3(12.9898, 78.233, 8.573))) * 43758.5453),
    -1.+2.*fract(sin(dot(co,vec3(5.9898, 40.233, 8.573))) * 43758.5453),
    -1.+2.*fract(sin(dot(co,vec3(19.4535, 20.233, 8.573))) * 43758.5453));
}

float noise3D( vec3 x ){
    vec3 p = floor( x );
    vec3  f = fract( x );

    vec3 ga = random3fV3(p);
    vec3 gb = random3fV3(p+vec3(1.,0.,0.));
    vec3 gc = random3fV3(p+vec3(0.,1.,0.));
    vec3 gd = random3fV3(p+vec3(1.,1.,0.));
    vec3 ge = random3fV3(p+vec3(0.,0.,1.));
    vec3 gf = random3fV3(p+vec3(1.,0.,1.));
    vec3 gg = random3fV3(p+vec3(0.,1.,1.));
    vec3 gh = random3fV3(p+vec3(1.,1.,1.));

    float p000 = dot(ga,f);
    float p100 = dot(gb,f-vec3(1.,0.,0.));
    float p010 = dot(gc,f-vec3(0.,1.,0.));
    float p110 = dot(gd,f-vec3(1.,1.,0.));
    float p001 = dot(ge,f-vec3(0.,0.,1.));
    float p101 = dot(gf,f-vec3(1.,0.,1.));
    float p011 = dot(gg,f-vec3(0.,1.,1.));
    float p111 = dot(gh,f-vec3(1.,1.,1.));
    
    //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    // vec3 pxyz = f*f*(3.-2.*f); 
    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*(6.-15.)+10.))
    vec3 pxyz = f*f*f*(f*(f*6.-15.)+10.);

    return 0.5+0.5*(p000
    +pxyz.z*(p001-p000)
    +pxyz.x*(p100-p000)
    +pxyz.y*(p010-p000)
    +pxyz.y*pxyz.x*(p000-p100-p010+p110)
    +pxyz.z*pxyz.x*(p101-p001-p100+p000)
    +pxyz.z*pxyz.y*(p011-p001-p010+p000)
    +pxyz.z*pxyz.y*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 ));

}

float fbm( vec3 x, float H ){    
    float t = 0.0;
    const int numOctaves = 16;
    for( int i=0; i<numOctaves; i++ ){
        float f = pow( 2.0, float(i) );
        float a = pow( f, -H );
        t += a*noise3D(f*x);
    }
    return t;
}

float fbm_economico( vec3 x, float H ){    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 0.0;
    const int numOctaves = 32;
    for( int i=0; i<numOctaves; i++ ){
        t += a*noise3D(f*x);
        f *= 2.0;
        a *= G;
    }
    return t;
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
    // float n = fbm(vec3(uv*10.,u_time*.5),0.9);
    float n = fbm_economico(vec3(uv*9.4,u_time*.2),0.9);
    vec3 col = vec3(n*0.7);
    gl_FragColor=vec4(col,1.);
	
}
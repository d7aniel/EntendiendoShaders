#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float random1f(vec2 co) {
  return fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453);
}

float random1fV3(vec3 co) {
  return fract(sin(dot(co,vec3(12.9898, 78.233, 8.573))) * 43758.5453);
}

vec3 noise2D( vec2 x ){
    vec2 p = floor( x );
    vec2  f = fract( x );

    float p00 = random1f(p);
    float p10 = random1f(p+vec2(1.,0.));
    float p01 = random1f(p+vec2(0.,1.));
    float p11 = random1f(p+vec2(1.,1.));
    
   //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    vec2 pxy = f*f*(3.-2.*f); 
    //la derivada de la curva de la forma du(x) = 6x - pow(6x,2)
    vec2 dp = f*(6.-6.*f); 

    // //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*6.-15.)+10.)
    // vec3 pxyz = f*f*f*(f*(f*6.-15.)+10.);
    // //para esta version la derivada seria pow(30x,4)-pow(60x,3)+pow(30x,2)
    // vec3 dp = 30.*f*f*(f*(f-2.)+1.);

    float derivadax = (p10-p00)+pxy.y*(p00-p10-p01+p11);
    float derivaday = (p01-p00)+pxy.x*(p00-p10-p01+p11);
    
    return vec3(p00+pxy.x*(p10-p00)+pxy.y*(p01-p00)+pxy.y*pxy.x*(p00-p10-p01+p11),
    derivadax*dp.x,
    derivaday*dp.y
    );
}

vec4 noise3D( vec3 x ){
    vec3 p = floor( x );
    vec3  f = fract( x );

    float p000 = random1fV3(p);
    float p100 = random1fV3(p+vec3(1.,0.,0.));
    float p010 = random1fV3(p+vec3(0.,1.,0.));
    float p110 = random1fV3(p+vec3(1.,1.,0.));
    float p001 = random1fV3(p+vec3(0.,0.,1.));
    float p101 = random1fV3(p+vec3(1.,0.,1.));
    float p011 = random1fV3(p+vec3(0.,1.,1.));
    float p111 = random1fV3(p+vec3(1.,1.,1.));
    
    // //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    // //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    // vec3 pxyz = f*f*(3.-2.*f); 
    // //la derivada de la curva de la forma du(x) = 6x - pow(6x,2)
    // vec3 dp = f*(6.-6.*f); 

    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*6.-15.)+10.)
    vec3 pxyz = f*f*f*(f*(f*6.-15.)+10.);
    //para esta version la derivada seria pow(30x,4)-pow(60x,3)+pow(30x,2)
    vec3 dp = 30.*f*f*(f*(f-2.)+1.);

    float derivadax = (p100-p000)
    +pxyz.y*(p000-p100-p010+p110)
    +pxyz.z*(p101-p001-p100+p000)
    +pxyz.z*pxyz.y*(p001-p101-p011+p111-p000+p100+p010-p110 );

    float derivaday = (p010-p000)
    +pxyz.x*(p000-p100-p010+p110)
    +pxyz.z*(p011-p001-p010+p000)
    +pxyz.z*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 );

    float derivadaz = (p001-p000)
    +pxyz.x*(p101-p001-p100+p000)
    +pxyz.y*(p011-p001-p010+p000)
    +pxyz.y*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 );

    return vec4(p000
    +pxyz.z*(p001-p000)
    +pxyz.x*(p100-p000)
    +pxyz.y*(p010-p000)
    +pxyz.y*pxyz.x*(p000-p100-p010+p110)
    +pxyz.z*pxyz.x*(p101-p001-p100+p000)
    +pxyz.z*pxyz.y*(p011-p001-p010+p000)
    +pxyz.z*pxyz.y*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 ),
    derivadax*dp.x,
    derivaday*dp.y,
    derivadaz*dp.z);
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
    
    // vec3 n = noise2D( 8.0*uv );
    vec4 n = noise3D( vec3(16.0*uv,u_time*.5) );
    vec3 col = (uv.x>0.5) ? vec3(0.5 + 0.5*n.yz,1.) : n.xxx;    
	  gl_FragColor = vec4( col, 1.0 );
	
}
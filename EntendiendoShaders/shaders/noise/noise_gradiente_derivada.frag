#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec2 random2fV2(vec2 co) {
  return vec2(
    -1.+2.*fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453),
    -1.+2.*fract(sin(dot(co,vec2(5.9898, 40.233))) * 43758.5453));
}
vec3 random3fV3(vec3 co) {
  return vec3(
    -1.+2.*fract(sin(dot(co,vec3(12.9898, 78.233, 8.573))) * 43758.5453),
    -1.+2.*fract(sin(dot(co,vec3(5.9898, 40.233, 8.573))) * 43758.5453),
    -1.+2.*fract(sin(dot(co,vec3(19.4535, 20.233, 8.573))) * 43758.5453));
}

vec3 noise2D( vec2 x ){
    vec2 p = floor( x );
    vec2  f = fract( x );

    vec2 ga = random2fV2(p);
    vec2 gb = random2fV2(p+vec2(1.,0.));
    vec2 gc = random2fV2(p+vec2(0.,1.));
    vec2 gd = random2fV2(p+vec2(1.,1.));

    float p00 = dot(ga,f);
    float p10 = dot(gb,f-vec2(1.,0.));
    float p01 = dot(gc,f-vec2(0.,1.));
    float p11 = dot(gd,f-vec2(1.,1.));
    
    // //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    // //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    // vec2 pxy = f*f*(3.-2.*f); 
    // //la derivada de la curva de la forma du(x) = 6x - pow(6x,2)
    // vec2 dp = f*(6.-6.*f); 

    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*6.-15.)+10.)
    vec2 pxy = f*f*f*(f*(f*6.-15.)+10.);
    //para esta version la derivada seria pow(30x,4)-pow(60x,3)+pow(30x,2)
    vec2 dp = 30.*f*f*(f*(f-2.)+1.);
      
    vec2 derivada =  ga 
    + pxy.x*(gb-ga) 
    + pxy.y*(gc-ga) 
    + pxy.x*pxy.y*(ga-gb-gc+gd) 
    + dp * (pxy.yx*(p00-p10-p01+p11) 
    + vec2(p10,p01) - p00);
    
    return vec3(0.5+0.5*(p00+pxy.x*(p10-p00)+pxy.y*(p01-p00)+pxy.y*pxy.x*(p00-p10-p01+p11)),
    derivada);
}

vec4 noise3D( vec3 x ){
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
    
    // //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    // // //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    // vec3 pxyz = f*f*(3.-2.*f); 
    // //la derivada de la curva de la forma du(x) = 6x - pow(6x,2)
    // vec3 dp = f*(6.-6.*f); 

    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*6.-15.)+10.)
    vec3 pxyz = f*f*f*(f*(f*6.-15.)+10.);
    //para esta version la derivada seria pow(30x,4)-pow(60x,3)+pow(30x,2)
    vec3 dp = 30.*f*f*(f*(f-2.)+1.);

    vec3 derivada = ga + 
             pxyz.x*(gb-ga) + 
             pxyz.y*(gc-ga) + 
             pxyz.z*(ge-ga) + 
             pxyz.x*pxyz.y*(ga-gb-gc+gd) + 
             pxyz.y*pxyz.z*(ga-gc-ge+gg) + 
             pxyz.z*pxyz.x*(ga-gb-ge+gf) + 
             pxyz.x*pxyz.y*pxyz.z*(-ga+gb+gc-gd+ge-gf-gg+gh) +   
             
             dp * (vec3(p100-p000,p010-p000,p001-p000) + 
                   pxyz.yzx*vec3(p000-p100-p010+p110,p000-p010-p001+p011,p000-p100-p001+p101) + 
                   pxyz.zxy*vec3(p000-p100-p001+p101,p000-p100-p010+p110,p000-p010-p001+p011) + 
                   pxyz.yzx*pxyz.zxy*(-p000+p100+p010-p110+p001-p101-p011+p111) );



    return vec4(0.5+0.5*(p000
    +pxyz.z*(p001-p000)
    +pxyz.x*(p100-p000)
    +pxyz.y*(p010-p000)
    +pxyz.y*pxyz.x*(p000-p100-p010+p110)
    +pxyz.z*pxyz.x*(p101-p001-p100+p000)
    +pxyz.z*pxyz.y*(p011-p001-p010+p000)
    +pxyz.z*pxyz.y*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 )),
    derivada);
}


void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
    
    // vec3 n = noise2D( 8.0*uv );
    vec4 n = noise3D( vec3(10.0*uv,u_time*1.) );
    vec3 col = (uv.x>0.5) ? vec3(0.5 + 0.5*n.yz,1.) : n.xxx;    
	  gl_FragColor = vec4( col, 1.0 );
	
}
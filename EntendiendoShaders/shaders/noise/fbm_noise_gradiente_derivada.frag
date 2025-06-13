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

vec4 fbm( vec3 x, float H ){    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 0.0;
    vec3 dt = vec3(0.0);
    const int numOctaves = 16;
    for( int i=0; i<numOctaves; i++ ){
        vec4 n = noise3D(f*x);
        dt += a*n.yzw;
        t += a*n.x;
        f *= 2.0;
        a *= G;
    }
    return vec4(t,dt);
}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
    vec4 n = fbm(vec3(uv*5.,u_time*.5),0.5);
    // vec3 col = vec3(n.xxx*.3);
    // if(uv.x<0.5){
    //     col = n.yzw*0.2+0.5;
    // }
    vec3 col = (uv.x>0.5) ? vec3(0.5 + 0.5*n.yz,1.) : vec3(n.xxx*.3);    
    gl_FragColor=vec4(col,1.);
	
}
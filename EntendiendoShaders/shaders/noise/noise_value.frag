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

float noise2D( vec2 x ){
    vec2 p = floor( x );
    vec2  f = fract( x );

    float p00 = random1f(p);
    float p10 = random1f(p+vec2(1.,0.));
    float p01 = random1f(p+vec2(0.,1.));
    float p11 = random1f(p+vec2(1.,1.));
    
   //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    vec2 pxy = f*f*(3.-2.*f); 
    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*(6.-15.)+10.))
    // vec3 pxy = x*x*x(x*(x*(6.-15.)+10.)) 

    // float cb1 = mix(p00, p10, pxy.x);
    // float cb2 = mix(p01, p11, pxy.x);
    // float cb = mix(cb1, cb2, pxy.y);
    //-----------------------------------------> cb es lo que estamos buscando ahora vamos a derivar una forma eficiente de hacerlo
    // mix function => x*(1-a)+y*a
    // x = cb1 = p00*(1.-pxy.x)+p10*pxy.x = p00-p00*pxy.x+p10*pxy.x
    // y = cb2 = p01*(1.-pxy.x)+p11*pxy.x = p01-p01*pxy.x+p11*pxy.x
    // cb = (p00-p00*pxy.x+p10*pxy.x)*(1-pxy.y)+(p01-p01*pxy.x+p11*pxy.x)*pxy.y
    // cb = (p00-p00*pxy.x+p10*pxy.x)-(pxy.y*p00-pxy.y*p00*pxy.x+pxy.y*p10*pxy.x) +(pxy.y*p01-pxy.y*p01*pxy.x+pxy.y*p11*pxy.x)
    // cb = p00-p00*pxy.x+p10*pxy.x-p00*pxy.y+p01*pxy.y+p00*pxy.y*pxy.x-p10*pxy.y*pxy.x  -p01*pxy.y*pxy.x+p11*pxy.y*pxy.x
    // cb = p00+pxy.x*(p10-p00)+pxy.y*(p01-p00)+pxy.y*pxy.x*(p00-p10-p01+p11);

    return p00+pxy.x*(p10-p00)+pxy.y*(p01-p00)+pxy.y*pxy.x*(p00-p10-p01+p11);
}

float noise3D( vec3 x ){
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
    
    //para no hacer un mix linean hacemos esta curva mistica que es un smoothstep de 0. a 1.
    //la curva es un polynomio cubico de la forma u(x) = pow(3x,2) - pow(2x,3)
    vec3 pxyz = f*f*(3.-2.*f); 
    //otra opcion seria usar una curva quintica de la forma u(x) = pow(6x,5) - pow(15x,4) + pow(10x,3) = x*x*x(x*(x*(6.-15.)+10.))
    // vec3 pxyz = f*f*f*(f*(f*6.-15.)+10.);

    // float cb10 = mix(p000, p100, pxy.x);
    // float cb20 = mix(p010, p110, pxy.x);
    // float cb1 = mix(cb10, cb20, pxy.y);
    // float cb11 = mix(p001, p101, pxy.x);
    // float cb21 = mix(p011, p111, pxy.x);
    // float cb2 = mix(cb11, cb21, pxy.y);
    // float cb = mix(cb1, cb2, pxy.z);
    //-----------------------------------------> cb es lo que estamos buscando ahora vamos a derivar una forma eficiente de hacerlo
    // mix function => x*(1-a)+y*a
    // si vemos la funcion de el noise 2D sabemos tenemos la formula derivada para cb1 y cb2
    // cb1 = x = p000+pxy.x*(p100-p000)+pxy.y*(p010-p000)+pxy.y*pxy.x*(p000-p100-p010+p110);
    // cb2 = y = p001+pxy.x*(p101-p001)+pxy.y*(p011-p001)+pxy.y*pxy.x*(p001-p101-p011+p111);
    // cb = (p000+pxy.x*(p100-p000)+pxy.y*(p010-p000)+pxy.y*pxy.x*(p000-p100-p010+p110))*(1-pxy.z)+(p001+pxy.x*(p101-p001)+pxy.y*(p011-p001)+pxy.y*pxy.x*(p001-p101-p011+p111))*pxy.z
    // cb = p000+pxy.x*(p100-p000)+pxy.y*(p010-p000)+pxy.y*pxy.x*(p000-p100-p010+p110)-px.z*p000-pxy.z*pxy.x*(p100-p000)-pxy.z*pxy.y*(p010-p000)-pxy.z*pxy.y*pxy.x*(p000-p100-p010+p110)+pxy.z*p001+pxy.z*pxy.x*(p101-p001)+pxy.z*pxy.y*(p011-p001)+pxy.z*pxy.y*pxy.x*(p001-p101-p011+p111)
    // cb = p000+pxy.z*(p001-p000)+pxy.x*(p100-p000)+pxy.y*(p010-p000)+pxy.y*pxy.x*(p000-p100-p010+p110)+pxy.z*pxy.x*(p101-p001-p100+p000)+pxy.z*pxy.y*(p011-p001-p010+p000)+pxy.z*pxy.y*pxy.x*(p001-p101-p011+p111-p000+p100+p010-p110 );

    return p000
    +pxyz.z*(p001-p000)
    +pxyz.x*(p100-p000)
    +pxyz.y*(p010-p000)
    +pxyz.y*pxyz.x*(p000-p100-p010+p110)
    +pxyz.z*pxyz.x*(p101-p001-p100+p000)
    +pxyz.z*pxyz.y*(p011-p001-p010+p000)
    +pxyz.z*pxyz.y*pxyz.x*(p001-p101-p011+p111-p000+p100+p010-p110 );

}

void main() {
	vec2 uv = gl_FragCoord.xy/u_resolution.xy;  
    float n = noise3D(vec3(uv*10.,u_time*1.));
    gl_FragColor=vec4(vec3(n),1.);
	
}
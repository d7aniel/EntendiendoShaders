#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
	// varying highp vec2 vPos;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

float hexagon( vec2 p, float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p = abs(p);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}


float circulo( in vec2 p, in float r ){
    return length(p) - r;
}

float cuadrado( in vec2 p, in float b ){
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

vec2 repeticion(vec2 uv,vec2 escala){
    return fract(uv*escala)-0.5;
}

float random1f(vec2 co) {
  return fract(sin(dot(co,vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 palette2( vec2 f, vec3 c_rand ){
    return 0.5 + 0.5*sin( random1f(f+vec2(7.0,113.0))*2.5 + 3.5 + c_rand);
}

vec4 repeticionConID(vec2 uv,vec2 escala){
    vec2 uvE = uv*escala;
    return vec4(fract(uvE)-0.5,floor(uvE));
}

float bordearDistancia(float d,float grueso){
    return grueso/abs(d);
}

float fillDistancia(float d,float gruesoBorde){
    return 1.-smoothstep(0.001 ,gruesoBorde,d-0.001 );//d;//
}

float repeticionRadialDistancia(float d,float escala,float anim){
    return abs(sin(d*escala+anim)/escala);//d;//
}

float bloomFill(float brillo, float brilloBase){
    return min(brilloBase/(1.-min(brillo,1.)),1.0);//d;//
}

void main(){
     vec2 uv = (gl_FragCoord.xy*2.0-u_resolution)/u_resolution.y;
   
    float distanciaMarcara = circulo(repeticion(uv+1.,vec2(.5)),.2);
    float mascara = fillDistancia(distanciaMarcara,.001);


    vec2 rep = repeticion(uv+vec2(0.1,0.5),vec2(2.));
    float distancia = circulo(rep,.18);
    distancia = repeticionRadialDistancia(distancia,10.,u_time*5.);
    float borde = bordearDistancia(distancia,.002);

    vec4 rep2 = repeticionConID(uv,vec2(4.));
    float distancia2 = hexagon(rep2.xy,.5);
    distancia2 = repeticionRadialDistancia(distancia2,5.,(sin(u_time)*exp(-mascara))*5.);
    float borde2 = bordearDistancia(distancia2,.005);

    vec3 c = palette2(rep2.zw,vec3(3.,1.2,8.7));
        

    float fill = fillDistancia(distancia,.2);
    float bFill = bloomFill(fill,0.2);
    gl_FragColor=vec4(vec3(c*(borde2+borde*0.7)),1.);
}
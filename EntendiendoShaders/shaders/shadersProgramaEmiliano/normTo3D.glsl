#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592

uniform vec2 u_resolution;
uniform vec2 luz;
uniform float u_time;
uniform sampler2D in_graf;

void main(  ){

    // vec2 e = vec2(1.0 / u_resolution.x,0.);//1 pixels normalizado hacia la derecha
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    
    vec3 nor = texture( in_graf, uv ).xyz;
    
    //--- 1. posicion de la luz
    float lx = luz.x;//sin(u_time*0.9);
    float lz = luz.y;//cos(u_time*0.9);
    vec3 lig = normalize( vec3( lx, 0.1, lz ) );
    //--- 2. calculamos la luz difusa
    float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );

    vec3 redu = vec3(0.8);
    vec3 lin = redu*(nor.y*0.5+0.5);
    lin+=dif*(1.-redu);
            
    gl_FragColor=vec4( lin, 1. );
}



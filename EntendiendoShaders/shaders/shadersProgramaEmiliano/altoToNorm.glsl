#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

void main(  ){

    vec2 e = vec2(1.0 / u_resolution.x,0.);//1 pixels normalizado hacia la derecha
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    
    vec4 pix = texture( in_graf, uv );
    vec4 pixDifX = texture( in_graf, uv+e.xy );
    vec4 pixDifY = texture( in_graf, uv+e.yx );
    float d = (pix.x+pix.y+pix.z)/3.;
    float dX = (pixDifX.x+pixDifX.y+pixDifX.z)/3.;
    float dY = (pixDifY.x+pixDifY.y+pixDifY.z)/3.;


    vec3 nor = normalize( vec3( dX - d, e.x, dY - d ) );
            
    gl_FragColor=vec4( nor, 1. );
}



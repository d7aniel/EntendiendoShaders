/* Main function, uniforms & utils */
#ifdef GL_ES
    precision highp float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI_TWO			1.570796326794897
#define PI				3.141592653589793
#define TWO_PI			6.283185307179586



// float pointTraping( vec2 uv, vec2 p )
// {
//     float dist = 1000000000000000000000.0;
//     const int maxIteraciones = 20;
// 	float zr = uv.x;
// 	float zi = uv.y;
// 	// float cr = sin(450.);
// 	// float ci = cos(450.*.2);
// 	float cr = sin(10.+8.*0.264);
// 	float ci = cos(7.+3.*0.3714);

// 	float R = 2.;
// 	float RR = R*R;
//     for( int i=0; i<maxIteraciones; i++ ){
//         float zrzrzizi = zr*zr-zi*zi;
// 		if( zr*zr+zi*zi > RR){
// 			return 0.0;
// 		}
// 		zi = 2.*zr*zi+ci;
// 		zr = zrzrzizi+cr;
//         vec2 z = vec2(zr,zi);
//         float dc = length(z-p);
//         dist = min( dist, dc*dc);
//     }
//     return sqrt( dist );
// }

// vec3 lineTraping( vec2 uv,float p1, float p2, vec2 p3 )
// {
//     float dist = 1000000000000000000.0;
//     float dist2 = 1000000000000000000.0;
//     float dist3 = 1000000000000000000.0;
//     const int maxIteraciones =50;
// 	float zr = uv.x;
// 	float zi = uv.y;
// 	// float cr = sin(450.);
// 	// float ci = cos(450.*.2);
// 	float cr = sin(10.+sin(1.*0.5)*0.264);
// 	float ci = cos(7.+cos(7.*0.2)+3.*0.3714);

// 	float R = 2.;
// 	float RR = R*R;
//     vec2 m = (u_mouse.xy/u_resolution.xy)*2.-1.; 
//     for( int i=0; i<maxIteraciones; i++ ){
//         float zrzrzizi = zr*zr-zi*zi;
// 		if( zr*zr+zi*zi > RR){
// 			return vec3(0.,0.,0.);
// 		}
// 		zi = 2.*zr*zi+ci;
// 		zr = zrzrzizi+cr;
//         vec2 z = vec2(zr,zi);
//         float dc = z.x-m.x;
//         float dc3 = z.y-m.y;
//         float dc2 = length(z-m);
//         dist = min( dist, dc*dc);
//         dist3 = min( dist3, dc3*dc3);
//         dist2 = min( dist2, dc2*dc2);
//     }
//     return sqrt( vec3(dist,dist2,dist3));
// }

mat2 rot(float ang){
    return mat2(cos(ang),-sin(ang),sin(ang),cos(ang));
}

float distALinea(vec2 punto){
   vec2 p = vec2(cos(u_time*0.1),sin(u_time*0.1));
    punto*=rot(u_time*0.1);
   return min(length(punto-p),min(abs(punto.y-p.y),abs(punto.x-p.x)));
}

vec2 iSqrt(vec2 C){
    float a = C.x;
    float b = C.y;
    float r = pow((pow(a*a+b*b,0.5)+a)/2.,0.5);
    float i = b/abs(b)*pow((pow(a*a+b*b,0.5)-a)/2.,0.5);
    return vec2(r,i);
}

vec2 iSq(vec2 a){
    float r = a.x*a.x-a.y*a.y;
    float i = 2.*a.x*a.y;
    return vec2(r,i);
}

vec2 iMult(vec2 a, vec2 b){
    float r = a.x*b.x-a.y*b.y;
    float i = a.x*b.y+b.x*a.y;
    return vec2(r,i);
}

vec2 iDiv(vec2 C1, vec2 C2){
      float a = C1.x;
    float b = C1.y;
      float c = C2.x;
    float d = C2.y;
    float l2 = c*c+d*d;
    float r = (a*c+b*d)/l2;
    float i = (b*c-a*d)/l2;
    return vec2(r,i);
}

vec2 iCub(vec2 a){
    float r = a.x*a.x*a.x-3.*a.x*a.y*a.y;
    float i = 3.*a.x*a.x*a.y-a.y*a.y*a.y;
    return vec2(r,i);
}

vec2 iRoot4(vec2 C){
    return iSqrt(iSqrt(C));
}
float cMandelbrot(vec2   uv){
    const int maxIteraciones = 50;
    vec2 z = vec2(0.);
    vec2 c = vec2(uv.x,uv.y);
    int iteracion = 0;

	float R = 2.;
	float RR = R*R;
	for(int i=0;i < maxIteraciones ;i++){
		if( z.x*z.x+z.y*z.y > RR){
			break;
		}
        z = iMult(z,z)+c;
		iteracion++;
	}

    //return float(iteracion)/float(maxIteraciones);
    return iteracion>=maxIteraciones?1.:0.;
}

vec2 iPow4(vec2 C){
 return(iMult(iSq(C),iSq(C)));
}

vec2 iPow5(vec2 C){
 return(iMult(iCub(C),iSq(C)));

}


vec3 func_paleta( float t, vec3 a, vec3 b, vec3 c, vec3 d ){
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 paleta( float t ){
    return func_paleta( t, vec3(0.895,0.02,0.59), vec3(0.485,0.655,0.38), vec3(0.5,1.5,0.5), vec3(0.68,0.925,0.41) );
    // return func_paleta(t,vec3(0.6,0.5,1.0)+vec3(.2,0.4,0.5)*sin(u_time*0.5),vec3(1.3,0.0,1.9),vec3(.5),vec3(0.,0.6,0.1));
    // return func_paleta(t,vec3(0.6,0.5,1.0),vec3(1.3,0.0,1.9),vec3(.5),vec3(0.,0.6,0.1));
}


vec3 paletaF(float t1, float t2){
    vec3 col = vec3(0.2,0.1,0.4);
    col = mix( col, vec3(1.0, 0.0, 0.0), t1 );
    col = mix( col, vec3(0.0, 0.0, 0.0), t2*t2);
    col = mix( col, vec3(1.0, 0.749, 0.4431), 0.7*t1*t2 );
    col = mix( col, vec3(0.149, 0.3765, 0.8039), 0.5*smoothstep(1.2,t2,t1) );
    col *= t1*t2*3.5;
   return col;//
}


vec3 cMandelbrot3(vec2   uv){
    const int maxIteraciones = 15;
    vec2 z = iRoot4(-vec2(uv.x,uv.y))/pow(5.,0.25);
    // vec2 c = iDiv(vec2(1.,0),vec2(uv.x,uv.y));
    float m = uv.x*uv.x+uv.y*uv.y;
    vec2 c = vec2(uv.x/m,uv.y/m);//iDiv(vec2(1.,0.),c);
    int iteracion = 0;
	float R = 2.5;
	float RR = R*R;
	for(int i=0;i < maxIteraciones ;i++){
		if( z.x*z.x+z.y*z.y > RR){
			break;
		}
        z = iPow5(z)+iMult(c,z);
		iteracion++;
	}

    return iteracion>=maxIteraciones?vec3(0.):paleta(float(iteracion)/float(maxIteraciones));
    // return iteracion>=maxIteraciones?1.:0.;
}

vec3 cMandelbrot4(vec2   uv){
    const int maxIteraciones = 30;
    vec2 z = iRoot4(-vec2(uv.x,uv.y))/pow(5.,0.25);
    // vec2 c = iDiv(vec2(1.,0),vec2(uv.x,uv.y));
    float m = uv.x*uv.x+uv.y*uv.y;
    vec2 c = vec2(uv.x/m,uv.y/m);//iDiv(vec2(1.,0.),c);
    int iteracion = 0;
	float R = 2.5;
	float RR = R*R;
    float minD = 100000000.;
	for(int i=0;i < maxIteraciones ;i++){
		if( z.x*z.x+z.y*z.y > RR){
			break;
		}
        z = iPow5(z)+iMult(c,z);
        minD = min(minD,distALinea(z));
		iteracion++;
	}

    return iteracion>=maxIteraciones?vec3(0.):paleta(abs(minD));//float(iteracion)/float(maxIteraciones);
    // return iteracion>=maxIteraciones?1.:0.;
}

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

float fbm_economico( vec2 x, float H,vec2 uv ){    
    float G = exp2(-H);
    float f = .5;//-.53/length(x*1.5);//0.9/(length(x));//.1+sin(u_time*1.1)*1.5;
    float a = .5;
    float t = 0.0;
    const int numOctaves = 4;
    for( int i=0; i<numOctaves; i++ ){
        t += a*noise3D(f*vec3(abs(x*.4*uv*.2),4.9));
        // f *= 2.;
        a *= G;

    }
    return t;
}

float defDom(vec2 p ,vec2 uv){        
    vec2 q = vec2( fbm_economico( p + vec2(1.0,2.1),0.9,uv ),
        fbm_economico( p + vec2(2.1,1.1),0.4,uv ));
    return fbm_economico( p + 1.2*q,0.4,uv );
}

vec3 cMandelbrot5(vec2   uv){
    const int maxIteraciones = 30;
    vec2 z = vec2(0.);//iRoot4(-vec2(uv.x,uv.y))/pow(5.,0.25);
    vec2 z2 = vec2(0.);//iRoot4(-vec2(uv.x,uv.y))/pow(5.,0.25);
    vec2 c = vec2(uv.x,uv.y);
    float m = uv.x*uv.x+uv.y*uv.y;
    vec2 cInv = 1.2*vec2(uv.x/m,uv.y/m);
    int iteracion1 = 0;
    int iteracion2 = 0;
	float R = 2.5;
	float RR = R*R;
    float minD1 = 100000000.;
    float minD2 = 100000000.;
    bool libre1=false;
    bool libre2=false;
	for(int i=0;i < maxIteraciones ;i++){
		if( z.x*z.x+z.y*z.y > RR  ){
            //  break;  
			libre1=true;
		}
		if(  z2.x*z2.x+z2.y*z2.y > RR ){
			libre2=true;
		}

        if(libre1 && libre2){
            break;   
        }
        // Z = Z4 + 1 / C Z = Z4 + C
        if(!libre1){
            // z = iPow4(z)+cInv;//iMult(c,z);
            z = iPow5(z)+cInv;//iMult(c,z);
            minD1 = min(minD1,defDom(z,uv));
		    iteracion1++;
        }
        if(!libre2){
            z2 = iPow5(z2)+c;//iMult(c,z);
            minD2 = min(minD2,defDom(z2,uv));
		    iteracion2++;
        }
	}

    return vec3(minD1,minD2,0.0);//vec3( iteracion1>=maxIteraciones?minD1+0.1:minD1,iteracion2>=maxIteraciones?minD2+0.1:minD2,0.);//float(iteracion)/float(maxIteraciones);
    // return iteracion>=maxIteraciones?1.:0.;
}



void main() {
    // float tam = 0.9-sin(u_time*0.01)*2.8;;
    // float mag = .5+sin(u_time*0.1)*0.3;
    // float t =u_time*0.1;
    float tam = 4.5;
    float mag = 0.;//.4+sin(u_time*0.1)*0.4;
    float t =u_time*0.1;
    vec2 uv = (gl_FragCoord.xy / u_resolution.xy)*tam-tam/2.+vec2(mag*cos(t),mag*sin(t));
    // uv*=rot(5.+sin(.05)*7.*length(uv));
//    vec3 c = vec3(0.);
    

    
    // if(gl_FragCoord.x / u_resolution.x < 0.5){    
        // vec3 cf = cMandelbrot5(uv);
        // c = vec3(cf);

        vec3 tot = vec3(0.0);
        vec2 fv = cMandelbrot5(uv).xy;
        float f = fv.x*1.0;
        float f2 = fv.y*1.0;
        
        vec3 col = paletaF(f2,f);// sqrt(f2*f2+f+f)*1.1+u_time*0.1);//, vec3(0.405,0.31,0.32), vec3(0.465,0.305,0.715), vec3(1.0,1.0,0.5), vec3(0.74,0.865,0.125) );
        // vec3 col2 = paleta( -0.5+f*2.1+u_time*0.1);//, vec3(0.405,0.31,0.32), vec3(0.465,0.305,0.715), vec3(1.0,1.0,0.5), vec3(0.74,0.865,0.125) );
        //  vec2 ex = vec2( 1.0 / u_resolution.x, 0.0 )*tam;//1 pixels normalizado hacia la derecha
        // vec2 ey = vec2( 0.0, 1.0 / u_resolution.y )*tam;//1 pixels normalizado hacia la arriba
        // vec3 nor = normalize( vec3( cMandelbrot5(uv+ex).x - f, ex.x, cMandelbrot5(uv+ey).x - f ) );
        //  float lx =  2.*sin(1.);
        // float lz = 2.*cos(1.);
        // vec3 lig = normalize( vec3( lx, -0.1, lz ) );
        //  float dif = clamp( 0.9+0.1*dot( nor, lig ), 0.0, 1.0 );
        //  vec3 lin  = vec3(0.9)*(nor.y*0.5+0.5);
        //      lin += vec3(0.1)*dif;

        // col *= lin;
        //  col *= vec3(.7,.3,.9);        
        // tot += col;
   
    // vec3 f = vec3(noise3D(vec3(uv*10.,u_time*0.5)));
   
    //vec3 c = lineTraping(uv,0.5,2.,p);//pointTraping(uv,p);//cJulia(uv);
    //vec3 color = vec3(c,c,c );



    gl_FragColor = vec4(col, 1.0);
}
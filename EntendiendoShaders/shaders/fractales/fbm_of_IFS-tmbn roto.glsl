

#ifdef GL_ES
precision highp float;
#endif

#define PI 3.141592

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;

uniform vec2 indice_sample;
uniform vec2 res_sample;
uniform vec3 rnd_v3;

float wa, wb, wc, wd;
mat2 am, bm, cm, dm;
vec2 amt, bmt, cmt, dmt;


// int   seed = 1;
// void  srand(int s ) { seed = s; }
// int   rand(void) { seed = seed*0x343fd+0x269ec3; return (seed>>16)&32767; }
// float frand(void) { return float(rand())/32767.0; }
// hash to initialize the random sequence (copied from Hugo Elias)
// int   hash( int n ) { n=(n<<13)^n; return n*(n*n*15731+789221)+1376312589; }

float hash(vec3 co) {
  return fract(sin(dot(co,vec3(12.9898, 78.233, 8.573))) * 43758.5453);
}

float determinant(mat2 m){
    return m[0][0]*m[1][1]-m[0][1]*m[1][0];
}
// ensure determinant is less than 0.4
mat2 fixDet( in mat2 m, out float w )
{
    // mat2 r = mat2( m[0][0], m[0][1], m[1][0], m[1][1] );
    w = abs(determinant(m));
    if( w>0.4 ){
        float s = 0.4/w;
        w *= s;
        m[0][0] = m[0][0]*s;
        m[0][1] = m[0][1]*s;
        m[1][0] = m[1][0]*s;
        m[1][1] = m[1][1]*s;
    }
    return m;
}

vec2 map(vec2 OldValue,vec2 OldMin, vec2 OldMax, vec2 NewMin, vec2 NewMax){
    return (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin;
}



void calcularMatrices(){
    float t = 0.02*u_time;
	am = mat2( cos(t*1.71+0.18), cos(t*1.11+5.31), 
                   cos(t*1.31+3.18), cos(t*1.44+4.21));
    amt = vec2( cos(-t*2.13+0.94), cos(-t*1.19+0.29) );                 
	bm = mat2( cos(-t*2.57+1.66), cos(t*1.08+0.74), 
                   cos(t*1.31+4.51), cos(t*1.23+1.29));
    bmt = vec2( cos(t*1.09+5.25), cos(t*1.27+1.77) );
	cm = mat2( cos(t*1.75+0.33), cos(t*1.74+5.12), 
                   cos(t*2.94+1.92), cos(t*2.58+2.36));
    cmt = vec2( cos(t*2.76+2.39), cos(t*2.35+2.04) );
	dm = mat2( cos(t*1.42+4.89), cos(t*1.14+1.94),
                   cos(t*2.73+6.34), cos(-t*1.21+4.84));
    dmt = vec2( cos(-t*1.42+4.71), cos(t*2.81+3.51) );

    // ensure all transformations are contracting, by checking
    // the determinant and inverting the top 2x2 matrix if it
    // is less than 1
    
    float ad, bd, cd, dd;
    am = fixDet(am, ad);
    bm = fixDet(bm, bd);
    cm = fixDet(cm, cd);
    dm = fixDet(dm, dd);

    // // compute probability for each transformation
    wa = (ad         ) / (ad+bd+cd+dd);
    wb = (ad+bd      ) / (ad+bd+cd+dd);
    wc = (ad+bd+cd   ) / (ad+bd+cd+dd);
    wd = (ad+bd+cd+dd) / (ad+bd+cd+dd);
}

vec4 IFS(vec2 uv){
    vec3  cola = vec3(0.0);
	vec3  colb = vec3(0.0);
    float colw = 0.0;
	float cad = 0.0;

    vec2 z = vec2( 0.0 );
	const int num = 300000;
	for( int i=0; i<num; i++ ) {
		float p = hash(uv.xyx+vec3(float(i))*uv.yxy*rnd_v3);

        // affine transform
        cad *= 0.25;
        if( p < wa ) { z = am*z+amt; cad += 0.00; }
        else if( p < wb ) { z = bm*z+bmt; cad += 0.25; }
        else if( p < wc ) { z = cm*z+cmt; cad += 0.50; }
        else              { z = dm*z+dmt; cad += 0.75; }

        // non linear transform
        float an = length(z)*0.17;
        vec2 c = vec2( cos(an), sin(an*1.7) );
        z = 2.0*mat2(c.x,c.y,-c.y,c.x)*z/dot(z,z);

        // splat into screen
        if( i>10000 ){
            vec3  co = 0.5 + 0.5*sin(1.5*cad + vec3(0.9,2.0,3.0)+2.0);
            co.z += co.y*(1.0*sin(cad*3.0+3.0));
            co = clamp(co,0.0,1.0);
        
            float d2 = dot(uv-z,uv-z);
            cola += co*exp2( -40000.0*d2 );
            colb += co*exp2(  -80000.0*d2 );
            colw += exp2( d2 );
		}
	}
    cola/=float(num);
    colb/=float(num);
    colw/=float(num);

    // color
    cola = 256.0*sqrt(cola);
    colb =   10.0*sqrt(colb);
    colw = 50.0*sqrt(colw);
    vec3 col = cola +colb;
    
    // auto-gain
    col *= 3.0/(1.0+col);
    col = clamp(col,0.0,1.0);
    colw = clamp(colw,0.0,1.0);
   
    return vec4(col,colw);
}

vec4 fbm( vec2 x, float H ){    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.;
    float t = 0.0;
    vec3 dt = vec3(0.0);
    const int numOctaves = 8;
    for( int i=0; i<numOctaves; i++ ){
        vec4 n = IFS(f*x);
        dt += a*n.xyz;
        t += a*n.w;
        f *= 2.0;
        a *= G;
    }
    return vec4(dt,t);
}

void main(  ){

    calcularMatrices();
    // init randoms
    // ivec2 q = ivec2(gl_FragCoord.xy);
    // srand( hash(q.x+hash(q.y+hash(iFrame))) );

    // create ifs
	

     // compute probability for each transformation
    // float wa = (ad         ) / (ad+bd+cd+dd);
    // float wb = (bd      ) / (ad+bd+cd+dd);
    // float wc = (cd   ) / (ad+bd+cd+dd);
    // float wd = (dd) / (ad+bd+cd+dd);

    // render ifs
    // float zoom = 0.5+0.5*sin(u_time*0.1);
    
// indice_sample;
// res_sample;
    // vec2 transform = indice_sample.xy/(u_resolution.xy/res_sample.xy);
    // vec2 uvSample = (2.0*(indice_sample.xy*res_sample.xy)-u_resolution.xy)/u_resolution.y;
    vec2 uvSample = res_sample.xy/u_resolution.xy;
    vec2 uvSampleMin = indice_sample*uvSample;
    vec2 uvSampleMax = uvSampleMin+uvSample;
    vec2 uv = map(gl_FragCoord.xy,vec2(0),res_sample,uvSampleMin,uvSampleMax);
    uv = 2.*uv-1.;
    // vec2 uv = map(gl_FragCoord.xy,vec2(0),res_sample,vec2(0.),vec2(1.));
	// uv += indice_sample.xy;
    uv *= 3.0;//*exp2(-zoom);

    // gl_FragColor = vec4(vec3(uv,0.0),1.0);

    gl_FragColor = IFS(uv);	
}

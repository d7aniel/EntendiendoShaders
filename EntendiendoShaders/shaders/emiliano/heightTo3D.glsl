#ifdef GL_ES
precision mediump float;
#endif

// varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D in_graf;
uniform float profundidad;
uniform vec2 luz;
	// varying highp vec2 vPos;
void main() {
	// vec2 uv = vTexCoord;
	// vec2 st = gl_FragCoord.xy/u_resolution.xy;  
	// vec3 pix = texture2D(in_graf, st).rgb;    

 	vec2 ex = vec2(1.0 / u_resolution.x,0.);//1 pixels normalizado hacia la derecha
 	vec2 ey = vec2(0.,1.0 / u_resolution.y);//1 pixels normalizado hacia la derecha
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
	if(uv.x<0.5){
		// vec3 pix = texture2D(in_graf, uv).rgb;
		
		vec4 pix = texture2D( in_graf, uv );//texture() tmbn se peuden usar no estoy seguro cual es mejor
		vec4 pixDifX = texture2D( in_graf, uv+ex );//texture() tmbn se peuden usar no estoy seguro cual es mejor
		vec4 pixDifY = texture2D( in_graf, uv+ey );//texture() tmbn se peuden usar no estoy seguro cual es mejor
		float d = (pix.x+pix.y+pix.z)/3.;
		float dX = (pixDifX.x+pixDifX.y+pixDifX.z)/3.;
		float dY = (pixDifY.x+pixDifY.y+pixDifY.z)/3.;
		vec3 nor = normalize( vec3( dX - d, max(1.-profundidad,0.), dY - d ) );


		/////// ESTAS DOS LINEAS 
		// vec4 pix = texture2D( in_graf, uv );
		//  vec3 nor = normalize( vec3( dFdx(pix.x), max(1.-profundidad,0.), dFdy(pix.x) ) );



		//--- 1. posicion de la luz
		// vec2 luz = vec2(0.7,-0.2);
		// luz = vec2(sin(u_time),sin(u_time*7.));
		float lx = luz.x;//sin(u_time*0.9);
		float lz = luz.y;//cos(u_time*0.9);
		vec3 lig = normalize( vec3( lx, 0.1, lz ) );
		//--- 2. calculamos la luz difusa
		float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );//un color que queramos se puede aplicar aqui o abajo

		vec3 redu = vec3(0.5);
		vec3 lin = redu*(nor.y*0.5+0.5);
		lin+=dif*(1.-redu);

		gl_FragColor=vec4(lin*lin,1.);
		// gl_FragColor=vec4(lin*(1.-pix.rgb),1.);
	}else{
		vec3 pix = texture2D(in_graf, uv).rgb;
		gl_FragColor=vec4(pix,1.);    
	}
    // gl_FragColor=vec4( nor, 1. );

    // vec3 nor = normalize( vec3( dFdx(s.x), 0.02, dFdy(s.x) ) );


	
	
}
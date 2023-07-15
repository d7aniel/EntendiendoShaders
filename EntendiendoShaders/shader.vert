#ifdef GL_ES
precision mediump float;
#endif


attribute vec3 aPosition;
// attribute vec2 aTexCoord;
// uniform mat4 uProjectionMatrix;
// uniform mat4 uModelViewMatrix;
// varying vec2 vTexCoord;

// void main() {
//     // vTexCoord = aTexCoord;
//     vec4 position = vec4(aPosition, 1.0);
//     position.xy = position.xy*2.0-1.0;
//     gl_Position = position;//uProjectionMatrix * uModelViewMatrix * position;
// }

// varying mediump vec2 vPos;

void main() {
    // vTexCoord = aTexCoord;
    vec4 position = vec4(aPosition, 1.0);
    position.xy = position.xy;
    // vPos = position.xy;
    gl_Position = position;//uProjectionMatrix * uModelViewMatrix * position;
}
// void main() {
//     vPos = (gl_Position = vec4(aPosition, 1.0)).xy;
// }
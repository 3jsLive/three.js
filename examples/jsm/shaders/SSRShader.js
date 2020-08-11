import {
  Matrix4,
  Vector2
} from "../../../build/three.module.js";
/**
 * References:
 * http://john-chapman-graphics.blogspot.com/2013/01/ssr-tutorial.html
 * https://learnopengl.com/Advanced-Lighting/SSR
 * https://github.com/McNopper/OpenGL/blob/master/Example28/shader/ssr.frag.glsl
 */

var SSRShader = {

  defines: {
    "PERSPECTIVE_CAMERA": 0,
    "KERNEL_SIZE": 32
  },

  uniforms: {

    "tDiffuse": { value: null },
    "tNormal": { value: null },
    "tDepth": { value: null },
    "tNoise": { value: null },
    "kernel": { value: null },
    "cameraNear": { value: null },
    "cameraFar": { value: null },
    "resolution": { value: new Vector2() },
    "cameraProjectionMatrix": { value: new Matrix4() },
    "cameraInverseProjectionMatrix": { value: new Matrix4() },
    "kernelRadius": { value: 8 },
    "minDistance": { value: 0.005 },
    "maxDistance": { value: 0.05 },
    "cameraNear2": { value: 0 },
    "cameraRange": { value: 0 },
    "UVWR": { value: 0 },

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "	vUv = uv;",

    "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: `
		#define MAX_DISTuv 1. //uv unit
		#define MAX_STEP ${innerWidth * Math.sqrt(2)}
		#define SURF_DISTuv .01
		varying vec2 vUv;
		uniform sampler2D tDepth;
		uniform sampler2D tNormal;
		uniform sampler2D tDiffuse;
		uniform float cameraRange;
		uniform float cameraNear2;
		uniform float UVWR; //uv unit to world unit ratio
		uniform vec2 resolution;
		uniform float cameraNear;
		uniform float cameraFar;
		uniform mat4 cameraProjectionMatrix;
		uniform mat4 cameraInverseProjectionMatrix;
		#include <packing>
		float getDepth( const in vec2 screenPosition ) {
			return texture2D( tDepth, screenPosition ).x;
		}
		float getLinearDepth( const in vec2 screenPosition ) {
			#if PERSPECTIVE_CAMERA == 1
				float fragCoordZ = texture2D( tDepth, screenPosition ).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			#else
				return texture2D( tDepth, screenPosition ).x;
			#endif
		}
		float getViewZ( const in float depth ) {
			#if PERSPECTIVE_CAMERA == 1
				return perspectiveDepthToViewZ( depth, cameraNear, cameraFar );
			#else
				return orthographicDepthToViewZ( depth, cameraNear, cameraFar );
			#endif
		}
		vec3 getViewPosition( const in vec2 screenPosition, const in float depth, const in float viewZ ) {
			float clipW = cameraProjectionMatrix[2][3] * viewZ + cameraProjectionMatrix[3][3];
			vec4 clipPosition = vec4( ( vec3( screenPosition, depth ) - 0.5 ) * 2.0, 1.0 );
			clipPosition *= clipW; // unprojection.
			return ( cameraInverseProjectionMatrix * clipPosition ).xyz;
		}
		vec3 getViewNormal( const in vec2 screenPosition ) {
			return unpackRGBToNormal( texture2D( tNormal, screenPosition ).xyz );
		}
		void main(){
			float depth = getDepth( vUv );
			float viewZ = getViewZ( depth );
			vec3 viewPosition = getViewPosition( vUv, depth, viewZ );
			vec3 viewNormal = getViewNormal( vUv );

			// if(depth<=0.) return;
			vec2 d0=gl_FragCoord.xy;
			vec2 d1;
			vec3 pos=viewPosition;

			vec3 normal=viewNormal;
			vec3 reflectDir=reflect(vec3(0,0,-1),normal);
			d1=d0+(reflectDir*MAX_DISTuv).xy*vec2(resolution.x,resolution.y);
			float totalLen=length(d1-d0);
			float xLen=d1.x-d0.x;
			float yLen=d1.y-d0.y;
			float totalStep=max(abs(xLen),abs(yLen));
			float xSpan=xLen/totalStep;
			float ySpan=yLen/totalStep;
			for(float i=0.;i<MAX_STEP;i++){
				if(i>=totalStep) break;
				float x=d0.x+i*xSpan;
				float y=d0.y+i*ySpan;
				if(x<0.||x>resolution.x) break;
				if(y<0.||y>resolution.y) break;
				float u=x/resolution.x;
				float v=y/resolution.y;
				vec2 uv=vec2(u,v);

				float d = getDepth(uv);
				float vZ = getViewZ( d );
				vec3 p=getViewPosition( uv, d, vZ );
				vec3 rayPos=pos+(length(vec2(x,y)-d0)/totalLen)*(reflectDir*MAX_DISTuv);
				float away=length(rayPos-p);
				if(away<SURF_DISTuv){
					vec3 n=getViewNormal( uv );
					if(dot(reflectDir,n)>=0.) continue;
					vec4 reflect=texture2D(tDiffuse,uv);
					gl_FragColor=reflect;
					gl_FragColor.a=.5;
					break;
				}
			}
		}
	`

};

var SSRDepthShader = {

  defines: {
    "PERSPECTIVE_CAMERA": 0
  },

  uniforms: {

    "tDepth": { value: null },
    "cameraNear": { value: null },
    "cameraFar": { value: null },

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "	vUv = uv;",
    "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D tDepth;",

    "uniform float cameraNear;",
    "uniform float cameraFar;",

    "varying vec2 vUv;",

    "#include <packing>",

    "float getLinearDepth( const in vec2 screenPosition ) {",

    "	#if PERSPECTIVE_CAMERA == 1",

    "		float fragCoordZ = texture2D( tDepth, screenPosition ).x;",
    "		float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );",
    "		return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );",

    "	#else",

    "		return texture2D( tDepth, screenPosition ).x;",

    "	#endif",

    "}",

    "void main() {",

    "	float depth = getLinearDepth( vUv );",
    "	gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );",

    "}"

  ].join("\n")

};

var SSRBlurShader = {

  uniforms: {

    "tDiffuse": { value: null },
    "resolution": { value: new Vector2() }

  },

  vertexShader: [

    "varying vec2 vUv;",

    "void main() {",

    "	vUv = uv;",
    "	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

    "}"

  ].join("\n"),

  fragmentShader: [

    "uniform sampler2D tDiffuse;",

    "uniform vec2 resolution;",

    "varying vec2 vUv;",

    "void main() {",

    "	vec2 texelSize = ( 1.0 / resolution );",
    "	vec3 result = vec3(0);",

    "	for ( int i = - 2; i <= 2; i ++ ) {",

    "		for ( int j = - 2; j <= 2; j ++ ) {",

    "			vec2 offset = ( vec2( float( i ), float( j ) ) ) * texelSize;",
    "			result += texture2D( tDiffuse, vUv + offset ).xyz;",

    "		}",

    "	}",

    "	gl_FragColor = vec4(  result / ( 5.0 * 5.0 ) , 1.0 );",

    "}"

  ].join("\n")

};

export { SSRShader, SSRDepthShader, SSRBlurShader };

/**
 * Uniforms library for RectAreaLight shared webgl shaders
 * @author abelnation
 * @author WestLangley / http://github.com/WestLangley
 * @author sam-g-steel / https://github.com/sam-g-steel
 *
 * NOTE: This is a temporary location for the BRDF approximation texture data
 *       based off of Eric Heitz's work (see citation below).  BRDF data for
 *       RectAreaLight is currently approximated using a precomputed texture
 *       of roughly 80kb in size.  The hope is to find a better way to include
 *       the large texture data before including the full RectAreaLight implementation
 *       in the main build files.
 *
 * TODO: figure out a way to compress the LTC BRDF data
 */

// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines
// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt
// code: https://github.com/selfshadow/ltc_code/

( function () {
	// LZMA Decoder modified from origonal source: https://github.com/LZMA-JS/LZMA-JS/blob/master/src/lzma-d-min.js
	var LZMA=function(){"use strict";function r(e,r){postMessage({action:nr,cbn:r,result:e})}function o(e){var r=[];return r[e-1]=void 0,r}function n(e,r){return i(e[0]+r[0],e[1]+r[1])}function t(e,r){var o,n;return e[0]==r[0]&&e[1]==r[1]?0:(o=0>e[1],n=0>r[1],o&&!n?-1:!o&&n?1:d(e,r)[1]<0?-1:1)}function i(e,r){var o,n;for(r%=0x10000000000000000,e%=0x10000000000000000,o=r%ir,n=Math.floor(e/ir)*ir,r=r-o+n,e=e-n+o;0>e;)e+=ir,r-=ir;for(;e>4294967295;)e-=ir,r+=ir;for(r%=0x10000000000000000;r>0x7fffffff00000000;)r-=0x10000000000000000;for(;-0x8000000000000000>r;)r+=0x10000000000000000;return[e,r]}function u(e){return e>=0?[e,0]:[e+ir,-ir]}function s(e){return e[0]>=2147483648?~~Math.max(Math.min(e[0]-ir,2147483647),-2147483648):~~Math.max(Math.min(e[0],2147483647),-2147483648)}function d(e,r){return i(e[0]-r[0],e[1]-r[1])}function c(e,r){return e.ab=r,e.cb=0,e.O=r.length,e}function m(e){return e.cb>=e.O?-1:255&e.ab[e.cb++]}function a(e){return e.ab=o(32),e.O=0,e}function _(e){var r=e.ab;return r.length=e.O,r}function f(e,r,o,n){p(r,o,e.ab,e.O,n),e.O+=n}function p(e,r,o,n,t){for(var i=0;t>i;++i)o[n+i]=e[r+i]}function D(e,r,o){var n,t,i,s,d="",c=[];for(t=0;5>t;++t){if(i=m(r),-1==i)throw Error("truncated input");c[t]=i<<24>>24}if(n=N({}),!z(n,c))throw Error("corrupted input");for(t=0;64>t;t+=8){if(i=m(r),-1==i)throw Error("truncated input");i=i.toString(16),1==i.length&&(i="0"+i),d=i+""+d}/^0+$|^f+$/i.test(d)?e.N=ur:(s=parseInt(d,16),e.N=s>4294967295?ur:u(s)),e.Q=B(n,r,o,e.N)}function l(e,r){return e.S=a({}),D(e,c({},r),e.S),e}function g(e,r,o){var n=e.D-r-1;for(0>n&&(n+=e.c);0!=o;--o)n>=e.c&&(n=0),e.x[e.D++]=e.x[n++],e.D>=e.c&&w(e)}function v(e,r){(null==e.x||e.c!=r)&&(e.x=o(r)),e.c=r,e.D=0,e.w=0}function w(e){var r=e.D-e.w;r&&(f(e.V,e.x,e.w,r),e.D>=e.c&&(e.D=0),e.w=e.D)}function R(e,r){var o=e.D-r-1;return 0>o&&(o+=e.c),e.x[o]}function h(e,r){e.x[e.D++]=r,e.D>=e.c&&w(e)}function P(e){w(e),e.V=null}function C(e){return e-=2,4>e?e:3}function S(e){return 4>e?0:10>e?e-3:e-6}function M(e,r){return e.h=r,e.bb=null,e.X=1,e}function L(e){if(!e.X)throw Error("bad state");if(e.bb)throw Error("No encoding");return y(e),e.X}function y(e){var r=I(e.h);if(-1==r)throw Error("corrupted input");e.$=ur,e.Z=e.h.d,(r||t(e.h.U,sr)>=0&&t(e.h.d,e.h.U)>=0)&&(w(e.h.b),P(e.h.b),e.h.a.K=null,e.X=0)}function B(e,r,o,n){return e.a.K=r,P(e.b),e.b.V=o,b(e),e.f=0,e.l=0,e.T=0,e.R=0,e._=0,e.U=n,e.d=sr,e.I=0,M({},e)}function I(e){var r,o,i,d,c,m;if(m=s(e.d)&e.P,Q(e.a,e.q,(e.f<<4)+m)){if(Q(e.a,e.E,e.f))i=0,Q(e.a,e.s,e.f)?(Q(e.a,e.u,e.f)?(Q(e.a,e.r,e.f)?(o=e._,e._=e.R):o=e.R,e.R=e.T):o=e.T,e.T=e.l,e.l=o):Q(e.a,e.n,(e.f<<4)+m)||(e.f=7>e.f?9:11,i=1),i||(i=x(e.o,e.a,m)+2,e.f=7>e.f?8:11);else if(e._=e.R,e.R=e.T,e.T=e.l,i=2+x(e.C,e.a,m),e.f=7>e.f?7:10,c=q(e.j[C(i)],e.a),c>=4){if(d=(c>>1)-1,e.l=(2|1&c)<<d,14>c)e.l+=J(e.J,e.l-c-1,e.a,d);else if(e.l+=U(e.a,d-4)<<4,e.l+=F(e.t,e.a),0>e.l)return-1==e.l?1:-1}else e.l=c;if(t(u(e.l),e.d)>=0||e.l>=e.m)return-1;g(e.b,e.l,i),e.d=n(e.d,u(i)),e.I=R(e.b,0)}else r=Z(e.k,s(e.d),e.I),e.I=7>e.f?T(r,e.a):$(r,e.a,R(e.b,e.l)),h(e.b,e.I),e.f=S(e.f),e.d=n(e.d,dr);return 0}function N(e){e.b={},e.a={},e.q=o(192),e.E=o(12),e.s=o(12),e.u=o(12),e.r=o(12),e.n=o(192),e.j=o(4),e.J=o(114),e.t=K({},4),e.C=G({}),e.o=G({}),e.k={};for(var r=0;4>r;++r)e.j[r]=K({},6);return e}function b(e){e.b.w=0,e.b.D=0,X(e.q),X(e.n),X(e.E),X(e.s),X(e.u),X(e.r),X(e.J),H(e.k);for(var r=0;4>r;++r)X(e.j[r].B);A(e.C),A(e.o),X(e.t.B),V(e.a)}function z(e,r){var o,n,t,i,u,s,d;if(5>r.length)return 0;for(d=255&r[0],t=d%9,s=~~(d/9),i=s%5,u=~~(s/5),o=0,n=0;4>n;++n)o+=(255&r[1+n])<<8*n;return o>99999999||!W(e,t,i,u)?0:O(e,o)}function O(e,r){return 0>r?0:(e.z!=r&&(e.z=r,e.m=Math.max(e.z,1),v(e.b,Math.max(e.m,4096))),1)}function W(e,r,o,n){if(r>8||o>4||n>4)return 0;E(e.k,o,r);var t=1<<n;return k(e.C,t),k(e.o,t),e.P=t-1,1}function k(e,r){for(;r>e.e;++e.e)e.G[e.e]=K({},3),e.H[e.e]=K({},3)}function x(e,r,o){if(!Q(r,e.M,0))return q(e.G[o],r);var n=8;return n+=Q(r,e.M,1)?8+q(e.L,r):q(e.H[o],r)}function G(e){return e.M=o(2),e.G=o(16),e.H=o(16),e.L=K({},8),e.e=0,e}function A(e){X(e.M);for(var r=0;e.e>r;++r)X(e.G[r].B),X(e.H[r].B);X(e.L.B)}function E(e,r,n){var t,i;if(null==e.F||e.g!=n||e.y!=r)for(e.y=r,e.Y=(1<<r)-1,e.g=n,i=1<<e.g+e.y,e.F=o(i),t=0;i>t;++t)e.F[t]=j({})}function Z(e,r,o){return e.F[((r&e.Y)<<e.g)+((255&o)>>>8-e.g)]}function H(e){var r,o;for(o=1<<e.g+e.y,r=0;o>r;++r)X(e.F[r].v)}function T(e,r){var o=1;do o=o<<1|Q(r,e.v,o);while(256>o);return o<<24>>24}function $(e,r,o){var n,t,i=1;do if(t=o>>7&1,o<<=1,n=Q(r,e.v,(1+t<<8)+i),i=i<<1|n,t!=n){for(;256>i;)i=i<<1|Q(r,e.v,i);break}while(256>i);return i<<24>>24}function j(e){return e.v=o(768),e}function K(e,r){return e.A=r,e.B=o(1<<r),e}function q(e,r){var o,n=1;for(o=e.A;0!=o;--o)n=(n<<1)+Q(r,e.B,n);return n-(1<<e.A)}function F(e,r){var o,n,t=1,i=0;for(n=0;e.A>n;++n)o=Q(r,e.B,t),t<<=1,t+=o,i|=o<<n;return i}function J(e,r,o,n){var t,i,u=1,s=0;for(i=0;n>i;++i)t=Q(o,e,r+u),u<<=1,u+=t,s|=t<<i;return s}function Q(e,r,o){var n,t=r[o];return n=(e.i>>>11)*t,(-2147483648^n)>(-2147483648^e.p)?(e.i=n,r[o]=t+(2048-t>>>5)<<16>>16,-16777216&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8),0):(e.i-=n,e.p-=n,r[o]=t-(t>>>5)<<16>>16,-16777216&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8),1)}function U(e,r){var o,n,t=0;for(o=r;0!=o;--o)e.i>>>=1,n=e.p-e.i>>>31,e.p-=e.i&n-1,t=t<<1|1-n,-16777216&e.i||(e.p=e.p<<8|m(e.K),e.i<<=8);return t}function V(e){e.p=0,e.i=-1;for(var r=0;5>r;++r)e.p=e.p<<8|m(e.K)}function X(e){for(var r=e.length-1;r>=0;--r)e[r]=1024}function Y(e){for(var r,o,n,t=0,i=0,u=e.length,s=[],d=[];u>t;++t,++i){if(r=255&e[t],128&r)if(192==(224&r)){if(t+1>=u)return e;if(o=255&e[++t],128!=(192&o))return e;d[i]=(31&r)<<6|63&o}else{if(224!=(240&r))return e;if(t+2>=u)return e;if(o=255&e[++t],128!=(192&o))return e;if(n=255&e[++t],128!=(192&n))return e;d[i]=(15&r)<<12|(63&o)<<6|63&n}else{if(!r)return e;d[i]=r}16383==i&&(s.push(String.fromCharCode.apply(String,d)),i=-1)}return i>0&&(d.length=i,s.push(String.fromCharCode.apply(String,d))),s.join("")}function er(e){return e[1]+e[0]}function rr(e,o,n){function t(){try{for(var e,r=0,u=(new Date).getTime();L(c.d.Q);)if(++r%1e3==0&&(new Date).getTime()-u>200)return s&&(i=er(c.d.Q.h.d)/d,n(i)),tr(t,0),0;n(1),e=Y(_(c.d.S)),tr(o.bind(null,e),0)}catch(m){o(null,m)}}var i,u,s,d,c={},m=void 0===o&&void 0===n;if("function"!=typeof o&&(u=o,o=n=0),n=n||function(e){return void 0!==u?r(s?e:-1,u):void 0},o=o||function(e,r){return void 0!==u?postMessage({action:or,cbn:u,result:e,error:r}):void 0},m){for(c.d=l({},e);L(c.d.Q););return Y(_(c.d.S))}try{c.d=l({},e),d=er(c.d.N),s=d>-1,n(0)}catch(a){return o(null,a)}tr(t,0)}var or=2,nr=3,tr="function"==typeof setImmediate?setImmediate:setTimeout,ir=4294967296,ur=[4294967295,-ir],sr=[0,0],dr=[1,0];return"undefined"==typeof onmessage||"undefined"!=typeof window&&void 0!==window.document||!function(){onmessage=function(r){r&&r.W&&r.W.action==or&&e.decompress(r.W.W,r.W.cbn)}}(),{decompress:rr}}();

	// source: https://jsperf.com/string-to-uint8array
	function StringToUint8(string) {
	    var uint = new Uint8Array(string.length);
	    for (var i = 0, j = string.length; i < j; ++i) {
	        uint[i] = string.charCodeAt(i);
	    }
	    return uint;
	}
	function deOptimizeFloat(v){
		var exponentLocation = Math.max(
			v.indexOf("-", 1),
			v.indexOf("+", 1)
		) ;

		if(exponentLocation != -1){
			// add e back
			v = v.substr(0,exponentLocation) +
			"e" + v.substr(exponentLocation);

			// add dec point back
			var decPos = v[0] == "-" ? 2 : 1;
			v = v.substr(0, decPos) + "." + v.substr(decPos);
		}

		return +v;
	}

	function unpackData(data){
		// remove B64
		data = atob(data);
		// convert to Uint8Array
		data = StringToUint8(data);
		// decompress
		data = LZMA.decompress(data);

		// restore js float syntax
		// compressed data looks like this [...9, -4, .1, -.32, 125-2, 11+2]
		// uncompressed it looks like this [...9, -4, .1, -.32, 1.25e-2, 1.1e+2]
		data = data.split(",");
		data = data.map(deOptimizeFloat);

		// Mix rgba chanels back together
		// Currently the data is chanel major instead of pixel major
		var chanelSize = 64*64*2; // ltc_1 && ltc_2
		var dataSize = 64*64; // 64x64 pixels

		var redC   = data.splice(0,chanelSize).reverse();
		var greenC = data.splice(0,chanelSize).reverse();
		var blueC  = data.splice(0,chanelSize).reverse();
		var alphaC = data.splice(0,chanelSize).reverse();

		var LTC_1 = [];
		var LTC_2 = [];

		for(var i=0; i<dataSize; i++){
			LTC_1.push(redC.pop()  );
			LTC_1.push(greenC.pop());
			LTC_1.push(blueC.pop() );
			LTC_1.push(alphaC.pop());
		}
		for(var i=0; i<dataSize; i++){
			LTC_2.push(redC.pop()  );
			LTC_2.push(greenC.pop());
			LTC_2.push(blueC.pop() );
			LTC_2.push(alphaC.pop());
		}

		// Split Data in half
		return {LTC_1: LTC_1, LTC_2: LTC_2};
	}

	// source: https://github.com/selfshadow/ltc_code/tree/master/fit/results/ltc.js
	var lzmaCompressedData = "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";

	var LTC_MAT_1;
	var LTC_MAT_2;
	var data = unpackData(lzmaCompressedData);
	LTC_MAT_1 = data.LTC_1;
	LTC_MAT_2 = data.LTC_2;

	// data textures

	var ltc_1 = new THREE.DataTexture( new Float32Array( LTC_MAT_1 ), 64, 64, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1 );

	var ltc_2 = new THREE.DataTexture( new Float32Array( LTC_MAT_2 ), 64, 64, THREE.RGBAFormat, THREE.FloatType, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.NearestFilter, 1 );

	ltc_1.needsUpdate = true;
	ltc_2.needsUpdate = true;

	THREE.UniformsLib.LTC_1 = ltc_1;
	THREE.UniformsLib.LTC_2 = ltc_2;

	// add ltc data textures to material uniforms

	var ltc = { ltc_1: { value: null }, ltc_2: { value: null } };

	Object.assign( THREE.ShaderLib.standard.uniforms, ltc );
	Object.assign( THREE.ShaderLib.physical.uniforms, ltc );

} )()

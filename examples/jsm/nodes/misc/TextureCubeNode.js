/**
 * @author sunag / http://www.sunag.com.br/
 */

import {
	CubeUVReflectionMapping,
	CubeUVRefractionMapping
} from '../../../../build/three.module.js';

import { TextureNode } from '../inputs/TextureNode.js';
import { TextureCubeUVNode } from './TextureCubeUVNode.js';
import { NodeLib } from '../core/NodeLib.js';
import { NodeContext } from '../core/NodeContext.js';
import { ExpressionNode } from '../core/ExpressionNode.js';
import { FloatNode } from '../inputs/FloatNode.js';
import { ReflectNode } from '../accessors/ReflectNode.js';
import { NormalNode } from '../accessors/NormalNode.js';
import { ColorSpaceNode } from '../utils/ColorSpaceNode.js';

export class TextureCubeNode extends TextureNode {

	constructor( value, uv, bias, textureSize ) {

		super( value, uv, bias );

		textureSize = NodeLib.resolve( textureSize || 1024 );

		this.radianceCache = { uv: new TextureCubeUVNode(
			uv || new ReflectNode( ReflectNode.VECTOR ),
			textureSize,
			// bias should be replaced in builder.context in build process
			bias
		) };

		this.irradianceCache = { uv: new TextureCubeUVNode(
			new NormalNode( NormalNode.WORLD ),
			textureSize,
			1
		) };

		this.nodeType = "TextureCube";

	}

	set textureSize( val ) {

		this.radianceCache.textureSize = this.irradianceCache.textureSize = val;

	}

	get textureSize() {

		return this.radianceCache.textureSize;

	}

	generateTextureCubeUV( builder, cache ) {

		var uv_10 = cache.uv.build( builder ) + '.uv_10',
			uv_20 = cache.uv.build( builder ) + '.uv_20',
			t = cache.uv.build( builder ) + '.t';

		var color10 = 'texture2D( ' + super.generate( builder, 'sampler2D' ) + ', ' + uv_10 + ' )',
			color20 = 'texture2D( ' + super.generate( builder, 'sampler2D' ) + ', ' + uv_20 + ' )';

		// add a custom context for fix incompatibility with the core
		// include ColorSpace function only for vertex shader (in fragment shader color space functions is added automatically by core)
		// this should be removed in the future
		// include => is used to include or not functions if used FunctionNode
		// caching => create temp variables nodeT0..9 to optimize the code

		var colorSpaceContext = new NodeContext()
			.setProperty( 'include', builder.isShader( 'vertex' ) )
			.setProperty( 'caching', false );

		var outputType = this.getType( builder );

		cache.colorSpace10 = cache.colorSpace10 || new ColorSpaceNode( ColorSpaceNode.LINEAR_TO_LINEAR, new ExpressionNode( '', outputType ) );
		cache.colorSpace10.fromDecoding( builder.getTextureEncodingFromMap( this.value.value ) );
		cache.colorSpace10.input.src = color10;

		color10 = cache.colorSpace10.buildContext( colorSpaceContext, builder, outputType );

		cache.colorSpace20 = cache.colorSpace20 || new ColorSpaceNode( ColorSpaceNode.LINEAR_TO_LINEAR, new ExpressionNode( '', outputType ) );
		cache.colorSpace20.fromDecoding( builder.getTextureEncodingFromMap( this.value.value ) );
		cache.colorSpace20.input.src = color20;

		color20 = cache.colorSpace20.buildContext( colorSpaceContext,builder, outputType );

		return 'mix( ' + color10 + ', ' + color20 + ', ' + t + ' ).rgb';

	}

	generate( builder, output ) {

		if ( builder.isShader( 'fragment' ) ) {

			var contextuallyBias = builder.getContextProperty( 'bias' );

			if ( contextuallyBias ) {

				contextuallyBias.setTexture( this );

			}

			builder.require( 'irradiance' );

			var cache = builder.slot === 'irradiance' ? this.irradianceCache : this.radianceCache;
			var result = this.generateTextureCubeUV( builder, cache );

			return builder.format( 'vec4( ' + result + ', 1.0 )', this.getType( builder ), output );

		} else {

			console.warn( "THREE.TextureCubeNode is not compatible with " + builder.shader + " shader." );

			return builder.format( 'vec4( 0.0 )', this.getType( builder ), output );

		}

	}

	copy( source ) {

		super.copy( source );

		this.textureSize = source.textureSize;

		return this;

	}

	toJSON( meta ) {

		var data = super.toJSON( meta );

		if ( ! data.textureSize ) {

			data.textureSize = this.textureSize.toJSON( meta ).uuid;

		}

		return data;

	}

}

NodeLib.addResolver( ( value ) => { 

	if ( value.isTexture && ! value.isCubeTexture ) {

		switch ( value.mapping ) {

			case CubeUVReflectionMapping:
				return new TextureCubeNode( value );

			case CubeUVRefractionMapping:
				return new TextureCubeNode( value, new ReflectNode( ReflectNode.VECTOR, 1 ) );

		}

	}

} );

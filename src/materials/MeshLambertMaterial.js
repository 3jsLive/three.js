import { Material } from './Material.js';
import { MultiplyOperation } from '../constants.js';
import { Color } from '../math/Color.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

function MeshLambertMaterial( parameters ) {

	Material.call( this );

	this.type = 'MeshLambertMaterial';

	this.color = new Color( 0xffffff ); // diffuse

	this.map = null;

	this.lightMap = null;
	this.lightMapIntensity = 1.0;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.emissive = new Color( 0x000000 );
	this.emissiveIntensity = 1.0;
	this.emissiveMap = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

}

MeshLambertMaterial.prototype = Object.create( Material.prototype );
MeshLambertMaterial.prototype.constructor = MeshLambertMaterial;

MeshLambertMaterial.prototype.isMeshLambertMaterial = true;

MeshLambertMaterial.prototype.copy = function ( source ) {

	Material.prototype.copy.call( this, source );

	if ( source.color !== undefined ) this.color.copy( source.color );

	if ( source.map !== undefined ) this.map = source.map;

	if ( source.lightMap !== undefined ) this.lightMap = source.lightMap;
	if ( source.lightMapIntensity !== undefined ) this.lightMapIntensity = source.lightMapIntensity;

	if ( source.aoMap !== undefined ) this.aoMap = source.aoMap;
	if ( source.aoMapIntensity !== undefined ) this.aoMapIntensity = source.aoMapIntensity;

	if ( source.emissive !== undefined ) this.emissive.copy( source.emissive );
	if ( source.emissiveMap !== undefined ) this.emissiveMap = source.emissiveMap;
	if ( source.emissiveIntensity !== undefined ) this.emissiveIntensity = source.emissiveIntensity;

	if ( source.specularMap !== undefined ) this.specularMap = source.specularMap;

	if ( source.alphaMap !== undefined ) this.alphaMap = source.alphaMap;

	if ( source.envMap !== undefined ) this.envMap = source.envMap;
	if ( source.combine !== undefined ) this.combine = source.combine;
	if ( source.reflectivity !== undefined ) this.reflectivity = source.reflectivity;
	if ( source.refractionRatio !== undefined ) this.refractionRatio = source.refractionRatio;

	if ( source.wireframe !== undefined ) this.wireframe = source.wireframe;
	if ( source.wireframeLinewidth !== undefined ) this.wireframeLinewidth = source.wireframeLinewidth;
	if ( source.wireframeLinecap !== undefined ) this.wireframeLinecap = source.wireframeLinecap;
	if ( source.wireframeLinejoin !== undefined ) this.wireframeLinejoin = source.wireframeLinejoin;

	if ( source.skinning !== undefined ) this.skinning = source.skinning;
	if ( source.morphTargets !== undefined ) this.morphTargets = source.morphTargets;
	if ( source.morphNormals !== undefined ) this.morphNormals = source.morphNormals;

	return this;

};


export { MeshLambertMaterial };

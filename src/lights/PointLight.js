import { Light } from './Light.js';
import { PointLightShadow } from './PointLightShadow.js';

class PointLight extends Light {

	constructor( color, intensity, distance, decay ) {

		super( color, intensity );

		this.type = 'PointLight';
		Object.defineProperty( this, 'isPointLight', true );

		this.distance = ( distance !== undefined ) ? distance : 0;
		this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

		this.shadow = new PointLightShadow();

	}

	get power() {

		// intensity = power per solid angle.
		// ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		return this.intensity * 4 * Math.PI;

	}

	set power( value ) {

		// intensity = power per solid angle.
		// ref: equation (15) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		this.intensity = value / ( 4 * Math.PI );

	}

	copy( source ) {

		super.copy( source );

		this.distance = source.distance;
		this.decay = source.decay;

		this.shadow = source.shadow.clone();

		return this;

	}

}

export { PointLight };

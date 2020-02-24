export default /* glsl */`
#ifdef USE_LOGDEPTHBUF

	#ifdef USE_LOGDEPTHBUF_EXT

		bool isPerspective = isPerspectiveMatrix( projectionMatrix );

		vIsPerspective = float( isPerspective );

		vFragDepth = isPerspective ? 1.0 + gl_Position.w : gl_Position.z * 0.5 + 0.5;

	#else

		if ( isPerspectiveMatrix( projectionMatrix ) ) {

			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;

			gl_Position.z *= gl_Position.w;

		}

	#endif

#endif
`;

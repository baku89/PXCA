/**
*
* automation.js
*
**/

CellularAutomaton = function( renderer, parameters ) {

	var scope = this;

	// todo: check if required parameters is not undefined
	if ( false ) {
		console.log('THREE.CellularAutomaton: required options is not specified.');
		return null; 
	}

	var vertexShaderPassThru = 
			'precision mediump float;\n' +
			'precision mediump int;\n\n' +
			'uniform vec2 resolution;\n' +
			'attribute vec3 position;\n' +
			'attribute vec2 uv;\n' +
			'varying vec2 coord;\n\n' +
		    'void main() {\n' +
		    '    coord = uv;\n' +
		    '    gl_Position = vec4( position, 1.0 );\n' +
		    '}';

	var fragmentShaderPrefix = 
			'precision mediump float;\n' +
			'precision mediump int;\n\n' +
			'uniform sampler2D buffer;\n' +
			'uniform float dx;\n' +
			'uniform float dy;\n' +
			'varying vec2 coord;\n\n' +
			'ivec4 decode() {\n' +
	        '    return ivec4( texture2D( buffer, coord ) * 255.0 + 0.5 );\n' +
	        '}\n\n' +
	        'vec4 encode( ivec4 cell ) {\n' +
	        '    return vec4( cell ) / 255.0;\n' +
	        '}\n\n' +
	        'ivec4 neighbor( float offsetX, float offsetY ) {\n' +
	        '    return ivec4( texture2D( buffer, coord + vec2( offsetX, offsetY ) ) * 255.0 + 0.5 );\n' +
	        '}\n\n';

	var fragmentShaderPassthru =
			'precision mediump float;\n' +
			'precision mediump int;\n\n' +
			'varying vec2 coord;\n' +
			'uniform sampler2D buffer;\n\n' +
			'void main() {\n' +
			'    gl_FragColor = texture2D( buffer, coord );\n' +
			'}';

	var builtinUniforms = {
		buffer:     { type:  't', value: null },
		resolution: { type: 'v2', value: null },
		dx:         { type:  'f', value: null },
		dy:         { type:  'f', value: null }
	};


	// properties 

	this.texture = null;

	this.clearColor = ( !(parameters.clearColor  instanceof THREE.Color ) ) ?
			          new THREE.Color( 0x000000 ) :
			          parameters.clearColor;

	this.fragmentShader = parameters.fragmentShader;

	this.uniforms = _.assign( builtinUniforms, parameters.uniforms );
	this.uniforms.dx.value = 1 / parameters.resolution.x;
	this.uniforms.dy.value = 1 / parameters.resolution.y;


	// private variables

	this.__canvas2d = document.createElement('canvas');

	this.__resolution = parameters.resolution.clone();

	this.__defaultRenderTargetParameters = {
		minFilter: THREE.NearestFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat
	};

	this.__srcRenderTarget = new THREE.WebGLRenderTarget( this.__resolution.x, this.__resolution.y, 
														  this.__defaultRenderTargetParameters );
	this.__dstRenderTarget = new THREE.WebGLRenderTarget( this.__resolution.x, this.__resolution.y, 
														  this.__defaultRenderTargetParameters );

	// init shaderCanvas
	this.__shaderMaterial = new THREE.RawShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: vertexShaderPassThru,
		fragmentShader: fragmentShaderPrefix + this.fragmentShader,
		transparent: true
	});

	this.__passthruMaterial = new THREE.RawShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: vertexShaderPassThru,
		fragmentShader: fragmentShaderPassthru,
		transparent: true
	});


	this.__shaderCanvas = new ShaderCanvas( renderer, this.__shaderMaterial );
}

CellularAutomaton.prototype = {

	// update frame
	update: function() {

		this.uniforms.buffer.value = this.__srcRenderTarget;
		this.__shaderCanvas.render( this.__dstRenderTarget )

		this.texture = this.__dstRenderTarget;

		var swap = this.__srcRenderTarget;
		this.__srcRenderTarget = this.__dstRenderTarget;
		this.__dstRenderTarget = swap;
	},

	// read pixels
	readPixels: function( x, y, width, height ) {

		var gl = this.__shaderCanvas.renderer.getContext();

		var texture = this.texture.__webglTexture;
		var fb = gl.createFramebuffer();

		gl.bindFramebuffer( gl.FRAMEBUFFER, fb );
		gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
			                     gl.TEXTURE_2D, texture, 0 );

		if ( gl.checkFramebufferStatus( gl.FRAMEBUFFER ) != gl.FRAMEBUFFER_COMPLETE ) {
			console.log('CellularAutomaton.readPixels ERROR');
			return null;
		}

		var pixels = new Uint8Array( width * height * 4 );

		gl.readPixels( x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels );
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);

		return pixels;
	},

	// reset by filling 'clearColor'
	clear: function() {

		var texture = THREE.ImageUtils.generateDataTexture( this.__resolution.x,
											                this.__resolution.y,
											                new THREE.Color( this.clearColor ) );
		
		this.resetByTexture( texture );

	},

	// reset by texture
	resetByTexture: function( texture ) {

		this.uniforms.buffer.value = texture;

		this.__shaderCanvas.shaderMaterial = this.__passthruMaterial;
		this.__shaderCanvas.render( this.__srcRenderTarget );
		this.__shaderCanvas.shaderMaterial = this.__shaderMaterial;
	},

	// change size
	setResolution: function( resolution ) {

		var offset = this.__resolution.clone();

		this.__resolution = resolution.clone();

		offset.sub( this.__resolution );
		offset.divideScalar( 2 );

		// get cropped pixels byte arrays
		var pixels = this.readPixels( parseInt(offset.x), parseInt(offset.y),
			                          this.__resolution.x, this.__resolution.y );

		// flip verticaly
		var x, y, swap, ia, ib;
		for ( y = 0; y < this.__resolution.y / 2; y++ ) {
			for ( x = 0; x < this.__resolution.x; x++ ) {

				ia = ( y * this.__resolution.x + x ) * 4;
				ib = ( ( this.__resolution.y - y - 1 ) * this.__resolution.x + x ) * 4;

				swap = pixels[ ia   ]; pixels[ ia   ] = pixels[ ib   ]; pixels[ ib   ] = swap;
				swap = pixels[ ia+1 ]; pixels[ ia+1 ] = pixels[ ib+1 ]; pixels[ ib+1 ] = swap;
				swap = pixels[ ia+2 ]; pixels[ ia+2 ] = pixels[ ib+2 ]; pixels[ ib+2 ] = swap;
				swap = pixels[ ia+3 ]; pixels[ ia+3 ] = pixels[ ib+3 ]; pixels[ ib+3 ] = swap;
			}
		}

		// craete new texture
		var newTexture = new THREE.DataTexture( pixels, this.__resolution.x, this.__resolution.y, THREE.RGBAFormat );
		newTexture.needsUpdate = true;

		//var newTexture = THREE.ImageUtils.generateDataTexture( this.__resolution.x, this.__resolution.y, 0x000000 );

		// create new RenderTarget
		this.__srcRenderTarget.dispose();
		this.__dstRenderTarget.dispose();

		this.__srcRenderTarget = new THREE.WebGLRenderTarget( this.__resolution.x, this.__resolution.y, 
															  this.__defaultRenderTargetParameters );
		this.__dstRenderTarget = new THREE.WebGLRenderTarget( this.__resolution.x, this.__resolution.y, 
															  this.__defaultRenderTargetParameters );


		// update uniform resolution info
		this.uniforms.resolution.value = this.__resolution;
		this.uniforms.dx.value = 1.0 / this.__resolution.x;
		this.uniforms.dy.value = 1.0 / this.__resolution.y;

		this.resetByTexture( newTexture );
	}
};
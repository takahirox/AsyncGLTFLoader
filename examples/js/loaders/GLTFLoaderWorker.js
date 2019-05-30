importScripts( '../../../build/three.js' );
importScripts( 'GLTFLoader.js' );
importScripts( '../utils/SceneUtils.js' );

function CustomTextureLoader() {

}

CustomTextureLoader.prototype = {

	constructor: CustomTextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var texture = new THREE.Texture();;

		var loader = new THREE.ImageBitmapLoader();

		loader.load( url, function ( bitmap ) {

			texture.image = bitmap;

			var isJPEG = url.search( /\.jpe?g($|\?)/i ) > 0 || url.search( /^data\:image\/jpeg/ ) === 0;

			texture.format = isJPEG ? THREE.RGBFormat : RGBAFormat;
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

		return texture;

	}

};

var customTextureLoader = new CustomTextureLoader();

THREE.Loader.Handlers.add( /\.(jpe?g|png)$/i, customTextureLoader );
THREE.Loader.Handlers.add( /^blob:/, customTextureLoader );

var loader = new THREE.GLTFLoader();
loader.setPath( '../../' );

onmessage = function ( event ) {

	var data = event.data;

	switch ( data.type ) {

		case 'load':

			loader.load( data.url, function ( gltf ) {

				var data = THREE.SceneUtils.toTransferableJSON( gltf.scene )

				postMessage( {
					type: 'onLoad',
					gltf: {
						scene: data.json
					}
				}, data.transferables );

			}, undefined, function ( error ) {

				console.error( error );

			} );

			break;

		case 'setPath':

			loader.setPath( '../../' + data.path );

			break;

		default:

			console.error( 'Unknown type: ', data.type );

			break;

	}

};

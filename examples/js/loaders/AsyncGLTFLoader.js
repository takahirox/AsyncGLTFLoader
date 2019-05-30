THREE.AsyncGLTFLoader = ( function () {

	function AsyncGLTFLoader() {

		this.worker = new Worker( 'js/loaders/GLTFLoaderWorker.js' );

	}

	AsyncGLTFLoader.prototype = {

		constructor: AsyncGLTFLoader,

		load: function ( url, onLoad, onProgress, onError ) {

			this.worker.onmessage = function ( event ) {

				var gltf = {};
				gltf.scene = THREE.SceneUtils.fromTransferableJSON( event.data.gltf.scene );

				onLoad( gltf );

			};

			this.worker.postMessage( {
				type: 'load',
				url: url
			} );

		},

		setPath: function ( path ) {

			this.worker.postMessage( {
				type: 'setPath',
				path: path
			} );

			return this;

		}

	};

	return AsyncGLTFLoader;

} )();

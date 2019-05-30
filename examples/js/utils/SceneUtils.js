/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	createMultiMaterialObject: function ( geometry, materials ) {

		var group = new THREE.Group();

		for ( var i = 0, l = materials.length; i < l; i ++ ) {

			group.add( new THREE.Mesh( geometry, materials[ i ] ) );

		}

		return group;

	},

	detach: function ( child, parent, scene ) {

		console.warn( 'THREE.SceneUtils: detach() has been deprecated. Use scene.attach( child ) instead.' );

		scene.attach( child );

	},

	attach: function ( child, scene, parent ) {

		console.warn( 'THREE.SceneUtils: attach() has been deprecated. Use parent.attach( child ) instead.' );

		parent.attach( child );

	},

	toTransferableJSON: function ( object ) {

		object.updateMatrixWorld();

		var json = object.toJSON();
		var transferables = [];

		if ( json.geometries ) {

			var geometries = json.geometries;

			for ( var i = 0, il = geometries.length; i < il; i ++ ) {

				var geometry = geometries[ i ];
				var data = geometry.data;
				var attributes = data.attributes;
				var index = data.index;

				if ( attributes ) {

					for ( var key in attributes ) {

						var attribute = attributes[ key ];
						attribute.array = new Float32Array( attribute.array );
						transferables.push( attribute.array.buffer );

					}

				}

				if ( index ) {

					index.array = new Uint16Array( index.array );
					transferables.push( index.array.buffer );

				}

			}

		}

		var bitmaps = [];

		object.traverse( function ( obj ) {

			if ( obj.material ) {

				var material = obj.material;

				for ( var key in material ) {

					if ( ! material[ key ] ) continue;

					if ( ! material[ key ].isTexture ) continue;

					var image = material[ key ].image;

					if ( ! image ) continue;

					if ( ! ( image instanceof ImageBitmap ) ) continue;

					bitmaps[ image.uuid ] = image;

				}

			}

		} );

		if ( json.images ) {

			var images = json.images;

			for ( var i = 0, il = images.length; i < il; i ++ ) {

				var image = images[ i ];
				var uuid = image.uuid;

				image.bitmap = bitmaps[ uuid ];

				transferables.push( image.bitmap );

			}

		}

		return {
			json: json,
			transferables: transferables
		};

	},

	fromTransferableJSON: function ( json ) {

		// Add some hacks in build/three.js
		return new THREE.ObjectLoader().parse( json );

	}

};

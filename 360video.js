document.addEventListener("DOMContentLoaded", startTHREE);

function startTHREE()
{
    // your code here
    var video, texture;
    video = document.getElementById( 'video' );
    video.autoplay  = true;
    video.loop  = true;
    texture = new THREE.Texture( video );
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    texture.generateMipmaps = false;
    
    var camera, scene, renderer;

    var fov = 70,
    texture_placeholder,
    isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

    init();
    animate();

    function init() {

        var cont, mesh;

        cont = document.getElementById( 'cont' );

        camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 1100 );
        camera.target = new THREE.Vector3( 0, 0, 0 );

        scene = new THREE.Scene();

        mesh = new THREE.Mesh( new THREE.SphereGeometry( 500, 60, 40 ), new THREE.MeshBasicMaterial( { map: texture } ) );
        mesh.scale.x = -1;
        scene.add( mesh );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        cont.appendChild( renderer.domElement );

        document.addEventListener( 'mousedown', onDocumentMouseDown, false );
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        document.addEventListener( 'mouseup', onDocumentMouseUp, false );
        document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
        document.addEventListener( 'DOMMouseScroll', onDocumentMouseWheel, false);

        //

        window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function onDocumentMouseDown( event ) {

        event.preventDefault();

        isUserInteracting = true;

        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

    function onDocumentMouseMove( event ) {

        if ( isUserInteracting ) {

            lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
            lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

        }
    }

    function onDocumentMouseUp( event ) {

        isUserInteracting = false;

    }

    function onDocumentMouseWheel( event ) {

        // WebKit

        if ( event.wheelDeltaY ) {

            fov -= event.wheelDeltaY * 0.05;

        // Opera / Explorer 9

        } else if ( event.wheelDelta ) {

            fov -= event.wheelDelta * 0.05;

        // Firefox

        } else if ( event.detail ) {

            fov += event.detail * 1.0;

        }

        camera.projectionMatrix.makePerspective( fov, window.innerWidth / window.innerHeight, 1, 1100 );
        render();

    }

    function animate() {

        requestAnimationFrame( animate );
        render();

    }

    function render() {
        
        if( video.readyState === video.HAVE_ENOUGH_DATA ){
            texture.needsUpdate = true;
        }
        
        lat = Math.max( - 85, Math.min( 85, lat ) );
        phi = ( 90 - lat ) * Math.PI / 180;
        theta = lon * Math.PI / 180;

        camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
        camera.target.y = 500 * Math.cos( phi );
        camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

        camera.lookAt( camera.target );

        /*
        // distortion
        camera.position.x = - camera.target.x;
        camera.position.y = - camera.target.y;
        camera.position.z = - camera.target.z;
        */
        
        // renderer.clean();
        renderer.render( scene, camera );

    }
}
class Car {
    static distanceByFrame = 0.02;
    wheels = new Array();
    static bodyMaterial = new THREE.MeshLambertMaterial( {color: 0x111111} );
    constructor( scene, x, z ) {
        for(var i = 0; i < 4; i++) {
            this.wheels.push( new Wheel(scene, x + (i % 2), z + Math.floor(i / 2)));
        }
        const bodygeometry = new THREE.BoxGeometry(2.25, 0.5, 0.75);
        const headgeometry = new THREE.BoxGeometry(1, 0.5, 0.75);
        this.body = new THREE.Mesh( bodygeometry, Car.bodyMaterial);
        this.head = new THREE.Mesh( headgeometry, Car.bodyMaterial);
        this.body.position.set(x + 0.5, -0.5, z + 0.5);
        this.head.position.set(x + 0.5, 0, z + 0.5);
        scene.add( this.body );
        scene.add( this.head );
    }

    update = function() {
        this.wheels.forEach(wheel => {
            wheel.update();
        });
        this.body.position.x -= Car.distanceByFrame;
        this.head.position.x -= Car.distanceByFrame;
    }
}


class Wheel {
    static radius = 0.25;
    static stepFactor = 60;
    static wheelmaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );

    constructor( scene, x, z) {
        const wheelgeometry = new THREE.CylinderGeometry( Wheel.radius, Wheel.radius, Wheel.radius / 2, 8 );
        this.wheel = new THREE.Mesh( wheelgeometry, Wheel.wheelmaterial );
        this.wheel.rotateX(Math.PI / 2);
        this.wheel.rotateY(Math.PI / 8);
        this.wheel.position.set(x, -1 + Wheel.radius, z);
        scene.add( this.wheel );
    }

    update = function() {
        this.wheel.rotateY(Car.distanceByFrame / Wheel.radius);
        this.wheel.position.x -= Car.distanceByFrame;
    }
  }


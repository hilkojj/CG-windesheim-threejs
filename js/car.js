StateEnum = {
    XMOVE : 1,
    ZMOVE : 2,
    TURN  : 3
}

class Car {

    state = StateEnum.XMOVE;
    static distanceByFrame = 0.02;
    wheels = new Array();
    parts = new THREE.Group();
    static bodyMaterial = new THREE.MeshLambertMaterial( {color: 0x111111} );
    constructor( scene, x, z ) {
        for(var i = 0; i < 4; i++) {
            this.wheels.push( new Wheel(scene, x + (i % 2), z + Math.floor(i / 2)));
            this.parts.add(this.wheels[i].wheel);
        }
        const bodygeometry = new THREE.BoxGeometry(2.25, 0.5, 0.75);
        const headgeometry = new THREE.BoxGeometry(1, 0.5, 0.75);
        //bodygeometry.translate(-0.5, 0, 1);
        //headgeometry.translate(-0.5, 0, 1);
        const body = new THREE.Mesh( bodygeometry, Car.bodyMaterial);
        const head = new THREE.Mesh( headgeometry, Car.bodyMaterial);
        body.position.set(x + 0.5, -0.5, z + 0.5);
        head.position.set(x + 0.5, 0, z + 0.5);
        this.parts.add(body);
        this.parts.add(head);
        //this.parts.translateX(20);
        scene.add(this.parts);

        this.markersphere = new THREE.Mesh( new THREE.SphereGeometry(0.25), new THREE.MeshBasicMaterial(0xffffff));
        this.markersphere.position.set(this.parts.position.x, this.parts.position.y, this.parts.position.z);
        scene.add(this.markersphere);
    }

    counter = 0;
    turn = function() {
        console.log("turning");
        this.state = StateEnum.TURN;
        this.counter = 0;
    }
    
    stop = function() {
        this.state = StateEnum.ZMOVE;
    }

    update = function() {
        switch (this.state) {
            case StateEnum.XMOVE:
                this.wheels.forEach(wheel => {
                    wheel.update();
                });
                this.parts.position.x -= Car.distanceByFrame;
                this.markersphere.position.x -= Car.distanceByFrame;
                this.counter++;
        
                if (this.counter == 60) this.turn();
                break;
            case StateEnum.TURN:
                this.parts.rotateY(-0.01);
                this.parts.position.x -= Car.distanceByFrame * Math.cos(this.counter);
                this.parts.position.z -= Car.distanceByFrame * Math.sin(this.counter);
                this.counter += 0.01;
                
                if (this.counter >= Math.PI / 2) this.stop();
                break;
        }
        
    }
}


class Wheel {
    static radius = 0.25;
    static stepFactor = 60;
    static wheelmaterial = new THREE.MeshLambertMaterial( {color: 0xffff00} );

    constructor( scene, x, z) {
        const wheelgeometry = new THREE.CylinderGeometry( Wheel.radius, Wheel.radius, Wheel.radius / 2, 8 );
        
        //wheelgeometry.translate(-0.5, 0, 1);
        this.wheel = new THREE.Mesh( wheelgeometry, Wheel.wheelmaterial );

        this.wheel.rotateX(Math.PI / 2);
        //this.wheel.rotateY(Math.PI / 8);
        this.wheel.position.set(x, -1 + Wheel.radius, z);

        scene.add( this.wheel );
    }

    update = function() {
        this.wheel.rotateY(Car.distanceByFrame / Wheel.radius);
    }
  }


CarState = {
    XMOVE : 1, //movement along x axis
    ZMOVE : 2, //movement along z axis
    XTOZ  : 3, //turning from the x axis to z
    ZTOX  : 4, //turning from the z axis to x
    STOP  : 5  //no movement
}

class Car {

    state = CarState.XMOVE; //determines the axis along which the car moves
    static distanceByFrame = 0.01; //determines how fast the car travels
    wheels = new Array();
    parts = new THREE.Group();
    static bodyMaterial = new THREE.MeshPhongMaterial( {color: 0xffff00} );

    constructor( scene, x, z, xLowerBoundary, xUpperBoundary, zLowerBoundary, zUpperBoundary ) {
        this.xLowerBoundary = xLowerBoundary; 
        this.xUpperBoundary = xUpperBoundary;
        this.zUpperBoundary = zUpperBoundary;
        this.zLowerBoundary = zLowerBoundary;

        for(var i = 0; i < 4; i++) {
            this.wheels.push( new Wheel(scene, x + (i % 2), z + Math.floor(i / 2)));
            this.parts.add(this.wheels[i].wheel);
        }

        const bodygeometry = new THREE.BoxGeometry(2.25, 0.5, 0.75);
        const headgeometry = new THREE.BoxGeometry(1, 0.5, 0.75);
        const body = new THREE.Mesh( bodygeometry, Car.bodyMaterial);
        const head = new THREE.Mesh( headgeometry, Car.bodyMaterial);
        body.position.set(x + 0.5, -0.5, z + 0.5);
        head.position.set(x + 0.5, 0, z + 0.5);
        this.parts.add(body);
        this.parts.add(head);
        scene.add(this.parts);
    }

    counter = 0;
    xMovementSign = -1; //determines which way along the axis will the car move
    zMovementSign = 1;

    update = function() {
        const angleByFrame = 0.005; //determines how sharply the car turns
        switch (this.state) {
            case CarState.STOP:
                return;
            case CarState.XMOVE:
                this.parts.position.x += Car.distanceByFrame * this.xMovementSign;
                this.counter++;
        
                if ((this.parts.position.x <= this.xLowerBoundary && this.xMovementSign == -1)
                    || (this.parts.position.x >= this.xUpperBoundary && this.xMovementSign == 1)) {
                        this.state = CarState.XTOZ;
                        this.zMovementSign *= -1;
                        this.counter = 0;
                }
                break;
            case CarState.XTOZ:
                this.parts.rotateY(-angleByFrame);
                this.parts.position.x += Car.distanceByFrame * Math.cos(this.counter) * this.xMovementSign;
                this.parts.position.z += Car.distanceByFrame * Math.sin(this.counter) * this.zMovementSign;
                this.counter += angleByFrame;
                
                if (this.counter >= Math.PI / 2) {
                    this.state = CarState.ZMOVE;
                    this.counter = 0;
                }
                break;
            case CarState.ZMOVE:
                this.parts.position.z += Car.distanceByFrame * this.zMovementSign;
                this.counter++;
        
                if ((this.parts.position.z <= this.zLowerBoundary && this.zMovementSign == -1)
                    || (this.parts.position.z >= this.zUpperBoundary && this.zMovementSign == 1)) {
                        this.state = CarState.ZTOX;
                        this.xMovementSign *= -1;
                        this.counter = 0;
                }
                break;
            case CarState.ZTOX:
                this.parts.rotateY(-angleByFrame);
                this.parts.position.x += Car.distanceByFrame * Math.sin(this.counter) * this.xMovementSign;
                this.parts.position.z += Car.distanceByFrame * Math.cos(this.counter) * this.zMovementSign;
                this.counter += angleByFrame;
                
                if (this.counter >= Math.PI / 2) {
                    this.state = CarState.XMOVE;
                    this.counter = 0;
                }
                break;
        }
        
        this.wheels.forEach(wheel => {
            wheel.update();
        });
    }
}


class Wheel {
    static radius = 0.25;
    static stepFactor = 60;
    static wheelmaterial = new THREE.MeshLambertMaterial( {color: 0x111111} );

    constructor( scene, x, z) {
        const wheelgeometry = new THREE.CylinderGeometry( Wheel.radius, Wheel.radius, Wheel.radius / 2, 8 );
        this.wheel = new THREE.Mesh( wheelgeometry, Wheel.wheelmaterial );

        this.wheel.rotateX(Math.PI / 2);
        this.wheel.position.set(x, -1 + Wheel.radius, z);

        scene.add( this.wheel );
    }

    update = function() {
        this.wheel.rotateY(Car.distanceByFrame / Wheel.radius);
    }
  }


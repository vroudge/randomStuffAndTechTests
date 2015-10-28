"use strict";

/**
 *  OOP JS test
 *
 * Small town, 4 buildings (ABCD), they have 2, 3, 4 and 5 floors each.
 * A & B have small appartments (4 per floor), C and D big appartments (2 per floor)
 * Small appartments have a shower and a sink, big ones have a bathtub and 2 sinks
 * Sinks consume 2 liters/min, showers 1 liter/min, bathtubs 5 liters/min
 * Describe consumption for whole town, each building, each floor and each appartment
 *
 * Someone decides to add a jacuzzi on first appartment of first floor of D building (10L/min)
 * Add it to your code
 *
 * GL&HF
 *
 */

var global = {
    rezDeChausseeInclus:false
};


/**
 * Holder for consumption calculation
 * @param cons consumption
 * @constructor adds getConsumption method
 */
function WaterConsumer(cons){
    this.consumption = cons;
}
WaterConsumer.prototype.getConsumption = function(){
    return this.consumption;
};

/*********************/

function Residence(buildingArray){
    var self = this,
        consommation = 0;

    this.buildingList = buildingArray;

    //immediate constructor invocation
    for(var i = 0; i<self.buildingList.length;i++){
        consommation+=self.buildingList[i].getConsumption();
    }

    //for recalc when a change occurs in appartments
    this.recalculate = function(){
        consommation = 0;
        for(var i =0; i<self.buildingList.length; i++){
            for(var j=0; j<self.buildingList[i].floorList.length;j++){
                for(var k=0; k<self.buildingList[i].floorList[j].appartList.length;k++){
                    self.buildingList[i].floorList[j].appartList[k].recalculateConsommation();
                }
                self.buildingList[i].floorList[j].recalculateConsommation();
            }
            self.buildingList[i].recalculateConsommation();
            consommation += self.buildingList[i].getConsumption();
        }
        WaterConsumer.call(this,consommation);
    };

    WaterConsumer.call(this,consommation);
}

Residence.prototype = Object.create(WaterConsumer.prototype);
Residence.prototype.constructor = WaterConsumer;

function Batiment(name, floors, bigBuilding){
    var self = this,
        consommation = 0;

    this.floorList = [];
    this.name = name;

    //on compte les rez de chaussees ? :)
    if(global.rezDeChausseeInclus)
        floors+=1;

    for(var i=0; i<floors;i++){
        self.floorList.push(new Floor(bigBuilding));
        consommation+=self.floorList[i].getConsumption();
    }

    this.recalculateConsommation=function(){
        consommation = 0;
        for(var i = 0; i<self.floorList.length;i++){
            consommation+=self.floorList[i].getConsumption();
        }
        WaterConsumer.call(this,consommation);
    };

    WaterConsumer.call(this,consommation);
}

Batiment.prototype = Object.create(WaterConsumer.prototype);
Batiment.prototype.constructor = WaterConsumer;

function Floor(bigBuilding){
    var self = this,
        consommation=0;

    this.appartNbr = 4;
    this.appartList = [];

    if (bigBuilding) { //petit vs grand appart
        self.appartNbr = 2;
    }

    for(var i = 0; i<self.appartNbr;i++){
        self.appartList.push(new Appart(bigBuilding));
        consommation+=self.appartList[i].getConsumption();
    }

    this.recalculateConsommation=function(){
        consommation = 0;
        for(var i = 0; i<self.appartNbr;i++){
            consommation+=self.appartList[i].getConsumption();
        }
        WaterConsumer.call(this,consommation);
    };

    WaterConsumer.call(this,consommation);
}

Floor.prototype = Object.create(WaterConsumer.prototype);
Floor.prototype.constructor = WaterConsumer;

function Appart(bigBuilding){
    var self = this,
        consommation;

    this.douche = 1;
    this.evier = 1;
    this.baignoire = 0;
    this.jacuzzi = 0;

    if (bigBuilding) {
        this.douche=0;
        this.evier=2;
        this.baignoire=1;
    }

    consommation = this.douche +  this.baignoire*5 + this.evier*2 + self.jacuzzi*10;

    WaterConsumer.call(this,consommation);

    this.recalculateConsommation=function(){
        consommation = self.douche + self.baignoire*5 + self.evier*2 + self.jacuzzi*10;
        WaterConsumer.call(this,consommation);
    };
}

Appart.prototype = Object.create(WaterConsumer.prototype);
Appart.prototype.constructor = WaterConsumer;

/**
 * Calcul et display des consommations
 */
function mousson(){
    console.log("La conso de la residence est de: "+residence.getConsumption()+"L/min");
    for(var i =0; i<residence.buildingList.length; i++){
        console.log("La conso de l'immeuble "+ residence.buildingList[i].name +" est de "+ residence.buildingList[i].getConsumption() +"L/min");
        for(var j=0; j<residence.buildingList[i].floorList.length;j++){
            console.log("La conso de l'etage "+ (j+1) + " est de "+ residence.buildingList[i].floorList[j].getConsumption() +"L/min");
            for(var k=0; k<residence.buildingList[i].floorList[j].appartList.length;k++){
                console.log("La conso de l'appart "+ (k+1) + " est de "+ residence.buildingList[i].floorList[j].appartList[k].getConsumption() +"L/min");
            }
        }
    }
}

var residence = new Residence([new Batiment("A", 2,false), new Batiment("B", 3,false), new Batiment("C", 4,true), new Batiment("D",5,true)]);

console.log("---------------- CAS 1 --------------------");
mousson();
console.log("-------------------------------------------");

console.log("---------------- CAS 2 --------------------");
residence.buildingList[3].floorList[0].appartList[0].jacuzzi = 1;
residence.buildingList[3].floorList[0].appartList[0].recalculateConsommation();
residence.recalculate();
mousson();
console.log("-------------------------------------------");



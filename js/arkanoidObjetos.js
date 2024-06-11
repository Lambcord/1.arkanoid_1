class Ladrillo {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    isBroken = false;
    w = 128;
    h = 10; //no está en el constructor porque en el constructor solo se ponen las variables que van a ser definidas por el usuario (el largo y el ancho es siempre el mismo). El ususario puedo ser yo. En este caso, lo único que diferencia a un ladrillo de otro es su posición (x,y), el tamaño es siempre el mismo
    dibujar() {
        rect(this.x, this.y, this.w, this.h)
    }
    romper() {
        this.isBroken = true;
    }

}
class Pala { // como solo es una pala, realmente no haría falta una clase (a no ser que quieras un power up que te de varias palas)
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    w = 60;
    h = 10;
    dibujar() {
        rect(this.x, this.y, this.w, this.h)
    }
    moverse() {
        if (keyIsDown(37) && this.x > 0) {
            this.x = this.x - 10;
        }
        if (keyIsDown(39) && this.x < (1280 - 60)) {
            this.x = this.x + 10;
        }
    }
    moverseConPowerup(){
        if (keyIsDown(37) && this.x > 0) {
            this.x = this.x-10;
          }
          if(keyIsDown(39) && this.x < (1280-60)){
            this.x = this.x +10;
            
          }
          if (keyIsDown(38) && this.y > 0) {
            this.y = this.y -10;
          }
          if (keyIsDown(40) && this.y < (720 - 20)){
            this.y = this.y +10;
          }
}
}

   

class Bola {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    w = 10;
    h = 10;
    vx = 2;
    vy = -2;
    dibujar() {
        ellipse(this.x, this.y, this.w, this.h)
    }
    moverse() {
        this.x += this.vx;
        this.y += this.vy;
    }
    comprobarSiChocaConPala(pala) {
        if (this.y == pala.y && (this.x >= pala.x && this.x <= pala.x + 60)) {
            this.vy = this.vy * -1;
            if (Math.random()>0.5){
               this.vx = this.vx * Math.random()*2+1; 
            }else{
                this.vx = this.vx * Math.random()*2-1; 
            }
            
        }
    }
    comprobarSiChocaConParedes() {
        //Aqui comprobamos si la bola choca con los bordes de la pantalla
        if (this.x <= 0 || this.x >= 1280) {
            this.vx = this.vx * -1;
        }
        if (this.y <= 0) {
            this.vy = this.vy * -1;

        }
        //Recargamos la ventana cuando la bola choca con el fondo
        if (this.y == 720) {
            location.reload()
        }
    }
    comprobarSiChocaConLadrillo(ladrillo,arrayPowerups) {
        if (this.y == ladrillo.y && (this.x >= ladrillo.x && this.x <= ladrillo.x + 128)) {
            ladrillo.romper();  
            if(Math.random () > 0.5){
                arrayPowerups.push(new Powerup (ladrillo.x+ladrillo.w/2, ladrillo.y))
            }
            this.vy = this.vy * -1;
        }        
    }

}

class Powerup {
    constructor (x,y){
        this.x = x;
        this.y = y;
    }
    w = 10;
    h = 10;
    vy = 4;
    dibujar (){
        ellipse (this.x, this.y, this.w, this.h)
    }
    moverse (){
        this.y+=this.vy;
    }
    comprobarSiChocaConPala (pala){
        if (this.y == pala.y && (this.x >= pala.x && this.x <= pala.x + 60)){
            return true
        }
        return false;

    }
}

var timer = 0
var arrayPowerUps = []
var ladrillos = [];
var pala = new Pala(610, 700);
var bola = new Bola(640, 690);

function preload() {

}
function setup() {
    background(220);

    createCanvas(1280, 720);
    var x = 0;
    var y = 0;
   //Este bucle anidado crea el array de ladrillos
    for(let j = 0; j<3;j++){
        for (let index = 0; index < 10; index++) {
            let ladrillo = new Ladrillo(x,y);
            ladrillos.push(ladrillo)
            x=x+128;   
        }
        x=0;
        y=y+10;
    }
}
let estado = false;
function draw() {
    background(220);
    ladrillos.forEach(ladrillo => {
        if(!ladrillo.isBroken){
            ladrillo.dibujar();
            bola.comprobarSiChocaConLadrillo(ladrillo,arrayPowerUps);
        }
    });
    


    arrayPowerUps.forEach (powerup => {
        powerup.dibujar();
        powerup.moverse();
        if(powerup.comprobarSiChocaConPala(pala)){
            timer = 480;
        }
       
    })

    if(timer !=0){
        pala.moverseConPowerup()
        timer--;

    }else{
        pala.y = 700;
        pala.moverse();
    }



    pala.dibujar();
    bola.dibujar();
    bola.moverse();

    bola.comprobarSiChocaConPala(pala);
    bola.comprobarSiChocaConParedes();

}

//framecount para lo de parar el powerup
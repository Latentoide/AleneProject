let simbolos = "$#_-.,'¿?!¡%&/()";
let mayusculas = "ABCDEFGHIJKLMOPQRSTUVWXYZ";
let minusculas = "abcdefghijklmnopqrsetuvwxyz";
let numeros = "1234567890";

let random = simbolos+mayusculas+minusculas+numeros;

let haveMayus = false;
let haveMinus = false;
let havaNum = false;
let haveSim = false;

let theChar = '';
let i = 0;

let str = "";

export const password = () => {
    do{
        i = getRandomNum();
        theChar = random.charAt(i);
        if(simbolos.includes(theChar)){
            haveSim = true;
            i++;
        }
        if(mayusculas.includes(theChar)){
            haveMayus = true;
            i++;
        }
        if(minusculas.includes(theChar)){
            haveMinus = true;
            i++;
        }
        if(numeros.includes(theChar)){
            havaNum = true;
            i++;
        }
        str += theChar;
        if(str.length > 9){
            str ="";
            theChar = '';
            haveMayus = false;
            haveMinus = false;
            havaNum = false;
            haveSim = false;
        }
    }while(str.length > 8 && haveMayus && haveMinus && havaNum && haveSim);
    return str;
}

function getRandomNum(){
    return Math.floor((Math.random()*(random,length-0+1)+0));
}
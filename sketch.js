//fontes
let fontRegular;
let txtSize = 65;
let bgMenu;
let bgVitoria;
function preload() {
  fontRegular = loadFont('assets/funny.ttf');
  song = loadSound('assets/fantasia.mp3');
  bgMenu = loadImage('assets/bg-menu.jpg');
  bgVitoria = loadImage('assets/bg-vitoria.jpg');
}

//telas do menu
let tela = 1; //padrão: 1

let largura = 200;
let altura = 50;
let xMenu = 387;
let yMenu1 = 175;
let yMenu2 = 266;
let xMenu3 = 350;
let yMenu3 = 410;
let largura4 = 225;
let xMenu4 = 355;


//definição de cores das faces e peças (RGB)
const azul = '30, 144, 255',
      laranja = '255, 165, 0',
      vermelho = '200, 20, 60',
      amarelo = '255, 215, 0',
      verde = '50, 205, 50',
      roxo = '148, 0, 211';

//todos começam como 'não agarrados' pois o mouse não está clicando neles
let grabbed = [false, false, false, false, false, false];
let dimensoesXY = 100;
blocos =[
  [80, 150, dimensoesXY, laranja, 'laranja'],
  [230, 150, dimensoesXY, vermelho, 'vermelho'],
  [80, 270, dimensoesXY, amarelo, 'amarelo'],
  [230, 270, dimensoesXY, roxo, 'roxo'],
  [80, 390, dimensoesXY, verde, 'verde'],
  [230, 390, dimensoesXY, azul, 'azul']
]


//faces do cubo, um array composto por 6 arrays
const faces = [
// x   y   z corFace
  [0,   0, 0, azul],
  [0,  90, 0, vermelho],
  [0, 180, 0, verde],
  [0, -90, 0, amarelo],
  [90,  0, 0, roxo],
  [270, 0, 0, laranja],
];

//tamanho da aresta do cubo
const tamanhoAresta = 155;
//totalmente solido: 1; transparente: 0.1 e 0.9
const transparencia = 1

//variáveis de controle de rotação
let rotacaoY = 0;
let rotacaoX = 0;

//sliders para rotacionar
let sliderHorizontal;
let sliderVertical;

//arnazena a face visualizada
let faceVisualizada;

function setup() {
  angleMode(DEGREES);
  let canv = createCanvas(900, 550, WEBGL); //padrão 1150 550
  canv.parent("canvas-container");
  
  //toca a música automaticamente
  song.play();
  
  //configurações dos sliders
  push();
  sliderHorizontal = createSlider(0, 270, 0);
  sliderHorizontal.position(550, 430);
  sliderHorizontal.style('width', '255px');
  sliderHorizontal.style('cursor', 'pointer');
  pop();
  push();
  sliderVertical = createSlider(0, 270, 0);
  sliderVertical.position(730, 280);
  sliderVertical.style('width', '255px');
  sliderVertical.style('transform: rotate(270deg)');
  sliderVertical.style('cursor', 'pointer');
  pop();
  //impede que os sliders apareçam em outra tela que não a do jogo
  if(tela != 2){
    sliderHorizontal.hide();
    sliderVertical.hide();
  }

  rectMode(CENTER);
  
  //controle de loop da função draw
  frameRate(15);
}//fecha setup

function draw() {
  translate(-350,-250, 0);
  textAlign(CENTER);
  //conteúdo tela menu inicial
  if(tela == 1){
    image(bgMenu, -100, -25);
    menu();
  }
    
  //conteúdo tela do jogo
  else if(tela == 2){
    translate(-100, 0, 0);
    background('rgba(5, 216, 230, 0.7)');
    sliderHorizontal.show();
    sliderVertical.show();
    
    //cria blocos
    for(let i = 0; i < blocos.length; i++){
        rectMode(CENTER);
        push();
        fill(`rgb(${blocos[i][3]})`);
        rect(blocos[i][0], blocos[i][1], blocos[i][2], blocos[i][2]);
        pop();
    }
    //armazena valores de rotação dos sliders (de 0 a 270º)
    let valorSliderH = sliderHorizontal.value();
    let valorSliderV = sliderVertical.value();  
    
    //constrói as faces do cubo 3D
    push();
    translate(660, 260, 0);
    noStroke();
    rotateY(valorSliderH);
    rotateX(valorSliderV);
    rotateZ(0)
    faces.forEach(face => {
          fill(`rgba(${face[3]}, ${transparencia})`);
        push();
        [rotateX, rotateY, rotateZ].forEach((fn, i) => 
                fn(face[i]));
        translate(0, 0, 79);
        plane(tamanhoAresta);
        pop();
      });
    pop();
    
    //função que detecta a face que está na frente
    detectaFace(valorSliderH, valorSliderV);
    
    //dimensões X e Y da hitbox
    let hitboxXmin = 650;
    let hitboxXmax = hitboxXmin + 65;
    let hitboxYmin = 225;
    let hitboxYmax = hitboxYmin + 65;
    
    //verifica se a peça está na hitbox
    if((blocos[0][0] >= hitboxXmin && blocos[0][1] <= hitboxXmax) && (blocos[0][1] >= hitboxYmin && blocos[0][1] <= hitboxYmax)){
      if(blocos[0][4] == faceVisualizada){ //match laranja
          blocos[0][0] = blocos[0][1] = blocos[0][2] = 0;
      }
    }
    else if((blocos[1][0] >= hitboxXmin && blocos[1][1] <= hitboxXmax) && (blocos[1][1] >= hitboxYmin && blocos[1][1] <= hitboxYmax)){
      if(blocos[1][4] == faceVisualizada){//match vermelho
        blocos[1][0] = blocos[1][1] = blocos[1][2] = 0;
      }
    }
    else if((blocos[2][0] >= hitboxXmin && blocos[2][1] <= hitboxXmax) && (blocos[2][1] >= hitboxYmin && blocos[2][1] <= hitboxYmax)){
      if(blocos[2][4] == faceVisualizada){//match amarelo
        blocos[2][0] = blocos[2][1] = blocos[2][2] = 0;
      }
    }
    else if((blocos[3][0] >= hitboxXmin && blocos[3][1] <= hitboxXmax) && (blocos[3][1] >= hitboxYmin && blocos[3][1] <= hitboxYmax)){
      if(blocos[3][4] == faceVisualizada){//match roxo
        blocos[3][0] = blocos[3][1] = blocos[3][2] = 0;
      }
    }
    else if((blocos[4][0] >= hitboxXmin && blocos[4][1] <= hitboxXmax) && (blocos[4][1] >= hitboxYmin && blocos[4][1] <= hitboxYmax)){
      if(blocos[4][4] == faceVisualizada){//match verde
        blocos[4][0] = blocos[4][1] = blocos[4][2] = 0;
      }
    }
    else if((blocos[5][0] >= hitboxXmin && blocos[5][1] <= hitboxXmax) && (blocos[5][1] >= hitboxYmin && blocos[5][1] <= hitboxYmax)){
      if(blocos[5][4] == faceVisualizada){//match azul
        blocos[5][0] = blocos[5][1] = blocos[5][2] = 0;
      }
    }
    //condicao de vitoria (compara se as dimensões de todos os blocos são iguais a 0)
    if(blocos[0][2] == 0 && blocos[1][2] == 0 && blocos[2][2] == 0 && blocos[3][2] == 0 && blocos[4][2] == 0 && blocos[5][2] == 0){
      tela = 4;
      sliderHorizontal.hide();
      sliderVertical.hide();
    }
  }
  
  //conteúdo tela informações
  else if(tela == 3){
    menu();
    push();
    translate(340, 100 ,0)
    textAlign(CENTER);
    fill('white');
    noStroke();
    textSize(40);
    textFont(fontRegular);
    text("1: Cada face do cubo representa o espaço certo para uma peça;", 0, 0);
    text("2: As peças deverão ser encaixadas no cubo de acordo com a cor correspondente;", 0, 50);
    text("3: Para girar o cubo, clique nas setas ao seu redor;", 0, 100);
    text("4: Para encaixar uma peça, clique sobre ela e arraste até a respectiva cor no cubo;", 0, 150);
    text("5: Coloque todas as peças na posição correta para vencer o jogo.", 0, 200);
    pop();

  }
  
  //tela de vitória
  else if(tela == 4){
    image(bgVitoria, -100, -25);
    menu();
    push();
    translate(350, 250 ,0)
    fill('white');
    noStroke();
    textSize(110);
    textFont(fontRegular);
    text("Você venceu! :]", 0, 0);
    pop();
  }
}//fecha draw

//função que constrói o menu
function menu(){
    if(tela == 1){
      //hover da opção "iniciar" 
      if(mouseX > xMenu && mouseX < xMenu + largura && mouseY > yMenu1 && mouseY < yMenu1 + altura){
        push();
        stroke('white');
        fill('rgba(5, 216, 230, 0.7)');
        rect(xMenu, yMenu1, largura, altura, 15);
        pop();
        //se clicar em iniciar, irá para a tela 2 (jogo)
        if(mouseIsPressed){
           alternaTela(2);
         }
      }
      push();
      translate(390, 200 ,0)
      fill('rgb(47, 96, 130)');
      noStroke();
      textSize(txtSize);
      textFont(fontRegular);
      text('Iniciar', 0, 0);
      pop();
  
      //hover da opção "informações" 
      if(mouseX > xMenu && mouseX < xMenu + largura && mouseY > yMenu2 && mouseY < yMenu2 + altura){
       push();
        //translate(0, 0, 0);
        stroke('white');
        fill('rgba(5, 216, 230, 0.7)');
        rect(xMenu, yMenu2, largura, altura, 15);
        pop();
        //se clicar em iniciar, irá para a tela 2 (jogo)
        if(mouseIsPressed){
          alternaTela(3);
         }
      }
      push();
      translate(390, 290 ,0)
      fill('rgb(47, 96, 130)');
      noStroke();
      textSize(txtSize);
      textFont(fontRegular);
      text('Informações', 0, 0);
      pop();
    }

  else if(tela == 3){
    background(237, 163, 217);
    //hover da opção "voltar" 
    if(mouseX > xMenu && mouseX < xMenu + largura && mouseY > yMenu3 && mouseY < yMenu3 + altura){
      push();
      stroke('white');
      fill('rgba(5, 216, 230, 0.7)');
      rect(xMenu3, yMenu3, largura, altura, 15);
      pop();
      //se clicar em iniciar, irá para a tela 2 (jogo)
      if(mouseIsPressed){
        alternaTela(1);
      }
    }
    push();
    translate(355, 435 ,0)
    fill('rgb(47, 96, 130)');
    noStroke();
    textSize(txtSize);
    textFont(fontRegular);
    text('Voltar', 0, 0);
    pop();
  }
  else if(tela == 4){
    //hover da opção "voltar" 
    if(mouseX > xMenu4 && mouseX < xMenu4 + largura4 && mouseY > yMenu3 && mouseY < yMenu3 + altura){
      push();
      stroke('white');
      fill('rgba(5, 216, 230, 0.7)');
      rect(xMenu4, yMenu3, largura4, altura, 15);
      pop();
      //se clicar em iniciar, irá para a tela 2 (jogo)
      if(mouseIsPressed){
        alternaTela(1);
      }
    }
    push();
    translate(355, 435 ,0)
    fill('rgb(255, 0, 60)');
    noStroke();
    textSize(txtSize);
    textFont(fontRegular);
    text('Voltar ao menu', 0, 0);
    pop();
  }
}
//função que cambia as telas
function alternaTela(n){
  tela = n;
}
//detecta se o mouse está na area da peça
function mouseIsInRect(x, y, width, height, rectModeCenter = false){
  if(rectModeCenter){
    return (
      mouseX > x - width/2 && mouseX < x + width/2 && mouseY > y - height/2 && mouseY < y + height/2
    );
  }
  else{
    return (mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height);
  }
  
}
//pega a peça quando pressiona o botão do mouse
function mousePressed(){
  if(mouseIsInRect(blocos[5][0], blocos[5][1], 200, 200)){ 
    grabbed[5] = true;
  }
  else if(mouseIsInRect(blocos[4][0], blocos[4][1], 200, 200)){
    grabbed[4] = true;
  }
  else if(mouseIsInRect(blocos[3][0], blocos[3][1], 200, 200)){
    grabbed[3] = true;
  }
  else if(mouseIsInRect(blocos[2][0], blocos[2][1], 200, 200)){
    grabbed[2] = true;
  }
  else if(mouseIsInRect(blocos[1][0], blocos[1][1], 200, 200)){
    grabbed[1] = true;
  }
  else if(mouseIsInRect(blocos[0][0], blocos[0][1], 200, 200)){
    grabbed[0] = true;
  }
}
//muda status de "segurado" quando o bloco é solto
function mouseReleased(){
  grabbed[5] = false;
  grabbed[4] = false;
  grabbed[3] = false;
  grabbed[2] = false;
  grabbed[1] = false;
  grabbed[0] = false;
}
//função de arraste da peça
function mouseDragged(){
  if(grabbed[5]){
    blocos[5][0] = mouseX;
    blocos[5][1] = mouseY;
  }
  else if(grabbed[4]){
    blocos[4][0] = mouseX;
    blocos[4][1] = mouseY;
  }
  else if(grabbed[3]){
    blocos[3][0] = mouseX;
    blocos[3][1] = mouseY;
  }
  else if(grabbed[2]){
    blocos[2][0] = mouseX;
    blocos[2][1] = mouseY;
  }
  else if(grabbed[1]){
    blocos[1][0] = mouseX;
    blocos[1][1] = mouseY;
  }
  else if(grabbed[0]){
    blocos[0][0] = mouseX;
    blocos[0][1] = mouseY;
  }
}
//função de detecção da face que está na frente (baseia-se nos valores vindos dos sliders (0 a 270))
function detectaFace(sliderH, sliderV){
  if(((sliderH >= 0) && (sliderH <= 32)) && ((sliderV == 0))){
     faceVisualizada = 'azul'
     //console.log(faceVisualizada);
  }
  else if(((sliderH >= 33) && (sliderH <= 119)) && ((sliderV == 0))){
     faceVisualizada = 'amarelo'
     //console.log(faceVisualizada);
  }
    else if(((sliderH >= 120) && (sliderH <= 206)) && ((sliderV == 0))){
     faceVisualizada = 'verde'
     //console.log(faceVisualizada);
  }
  else if(((sliderH >= 207) && (sliderH <= 270)) && ((sliderV == 0))){
     faceVisualizada = 'vermelho'
     //console.log(faceVisualizada);
  }
  else if((sliderH == 0) &&((sliderV >= 47) &&(sliderV <= 131))){
     faceVisualizada = 'laranja'
     //console.log(faceVisualizada);
  }
  else if((sliderH == 0) &&((sliderV >= 132) &&(sliderV <= 221))){
     faceVisualizada = 'verde'
     //console.log(faceVisualizada);
  }
  else if((sliderH == 0) &&((sliderV >= 222) &&(sliderV <= 269))){
     faceVisualizada = 'roxo'
     //console.log(faceVisualizada);
  }
}
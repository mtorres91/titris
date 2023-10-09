import './style.css'
import {BLOCK_SIZE,BOARD_WITH,BOARD_WEIHTH,EVENT_MOVEMENTS} from './const'

const topButton = document.getElementById("topBtn");
const bottomButton = document.getElementById("bottomBtn");
const leftButton = document.getElementById("leftBtn");
const rightButton = document.getElementById("rightBtn");


const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

const $score = document.querySelector('span')
let score =0

canvas.width=BLOCK_SIZE * BOARD_WITH
canvas.height=BLOCK_SIZE* BOARD_WEIHTH

context.scale(BLOCK_SIZE,BLOCK_SIZE)

//board
/*
const board=[
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,0,1,1,1,1]
]
*/
const board = createboard(BOARD_WITH,BOARD_WEIHTH)

function createboard(width,height){
  return Array(height).fill().map(() => Array(width).fill(0))
}
//4 piezas
const piece = {
  position : {x: 5 , y:5},
  shape:[
    [1,1],
    [1,1]
  ]
}

//randon piezas
const pieces=[
  [
    [1,1],
    [1,1]
  ],
  [
    [1,1,1,1]
  ],
  [
    [0,1,0],
    [1,1,1]
  ],
  [
    [1,1,0],
    [0,1,1]
  ],
  [
    [1,0],
    [1,0],
    [1,1],
  ],
]
//game loop
let dropcounter = 0
let lasttime =0

function update(time = 0){
  const deltatime = time - lasttime
  lasttime = time
  dropcounter +=deltatime
  if(dropcounter > 1000){
    piece.position.y++
    dropcounter=0
    if(checkcollision()){
      piece.position.y--
      solidifypiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)


}

function draw(){

  context.fillStyle='#000'
  context.fillRect(0,0,canvas.width,canvas.height)

  board.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if(value === 1){
        context.fillStyle='yellow'
        context.fillRect(x,y,1,1)
      }
    })
  })

  piece.shape.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if(value){
        context.fillStyle='red'
        context.fillRect(x+ piece.position.x ,y+ piece.position.y,1,1)
      }
    })
  })
  $score.innerText = score
}

topButton.addEventListener("click", function() {
  // Acción para el botón superior (↑)
  const rotated = []
     for ( let i=0; i<piece.shape[0].length; i++){
      const row = []
     for ( let j=piece.shape.length-1 ;j>=0 ; j--){
      row.push(piece.shape[j][i])

     }
     rotated.push(row)
    }
    const previus = piece.shape
    piece.shape = rotated
    if(checkcollision()){
      piece.shape=previus
    }
});

bottomButton.addEventListener("click", function() {
  // Acción para el botón inferior (↓)
  piece.position.y++
    if(checkcollision()){
      piece.position.y--
      solidifypiece()
      removeRows()
      console.log('colisionabajo')
    }
});

leftButton.addEventListener("click", function() {
  // Acción para el botón izquierdo (←)
  piece.position.x--
  if(checkcollision()){
    piece.position.x++
    console.log('colision')
  }
});

rightButton.addEventListener("click", function() {
  // Acción para el botón derecho (→)
  piece.position.x++
    if(checkcollision()){
      piece.position.x--
      console.log('colision')
    }
});


document.addEventListener('keydown', event=>{
  if(event.key === EVENT_MOVEMENTS.LEFT)
  {
  piece.position.x--
  if(checkcollision()){
    piece.position.x++
    console.log('colision')
  }}
  if(event.key === EVENT_MOVEMENTS.RIGHT){
    piece.position.x++
    if(checkcollision()){
      piece.position.x--
      console.log('colision')
    }
  }
  if(event.key ===EVENT_MOVEMENTS.DOWN )
  {
    piece.position.y++
    if(checkcollision()){
      piece.position.y--
      solidifypiece()
      removeRows()
      console.log('colisionabajo')
    }}
  if(event.key === EVENT_MOVEMENTS.ROTAR){
    // piece.position.y--
     const rotated = []
     for ( let i=0; i<piece.shape[0].length; i++){
      const row = []
     for ( let j=piece.shape.length-1 ;j>=0 ; j--){
      row.push(piece.shape[j][i])

     }
     rotated.push(row)
    }
    const previus = piece.shape
    piece.shape = rotated
    if(checkcollision()){
      piece.shape=previus
    }
  }
 
})
 
function checkcollision (){
  return piece.shape.find((row, y)=>{
    return row.find((value,x)=>{
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0

        )

    })
  })
}

function solidifypiece (){
  piece.shape.forEach((row, y)=>{
    return row.find((value,x)=>{
      if(value === 1){
        board[y + piece.position.y][x + piece.position.x]= 1
      }

    })
  })

  //reset position
  piece.position.x=Math.floor(BOARD_WITH/ 2-2)
  piece.position.y=0
  piece.shape = pieces[Math.floor(Math.random() * pieces.length)]
  const audio= new window.Audio('./line.mp3 ')
  audio.volume=0.5
  audio.play()
 
  if(checkcollision()){
    alert('game over')
    board.forEach((row)=> row.fill(0))
  }
}

function removeRows(){
  const rowsToRemove = []

  board.forEach((row, y)=>{
    if(row.every(value => value === 1)){
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach( y=>{
    board.splice(y,1)
    const newRow = Array(BOARD_WITH).fill(0)
    board.unshift(newRow)
    score +=10
    const audio= new window.Audio('./linea.mp3 ')
  audio.volume=0.5
  audio.play()
  })


}

document.querySelector('section').addEventListener('click',()=> {
   update()

  const audio= new window.Audio('./tetrisaudio.mp3 ')
  audio.volume=0.5
  audio.play()
})




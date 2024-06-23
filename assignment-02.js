

//tested with Win10 Chrome

//get refercences to html elements. 
//This means we don't have to use OnClick in the html doc
const startButton = document.querySelector(".startbutton");
const scoreDisplay = document.querySelector("#current");
const topScoreDisplay = document.querySelector("#top");
const green = document.querySelector("#green");
const red = document.querySelector("#red");
const yellow = document.querySelector("#yellow");
const blue = document.querySelector("#blue");
const info = document.querySelector("#info");

//This is a general wait delay which allows us to wait when the start button is pressed
// as well as wait for flashes see https://www.sitepoint.com/delay-sleep-pause-wait/ for more details
const delay = (delay) => new Promise((resolve) => setTimeout(resolve, delay))//creats a delay

let computerSequence=[];   //stores the randomly generated computer sequence (sequence = flash of a light) during computer phase of game
let userSequence=[];       //stores which button is pressed by the user during the userpick phase of gams
let playingGame;           // when true we ae in the game loop playing the game
let score=0;               //current user score for "that" game loop. Resets every game loop
let topScore=0;            //highest score acheived from all game loops . Resets when browers is refreshed.
let level=1;               //keep track of what level we are on. Timer will decreases at certain levels
let timer=1000;            //this is how fast the lights will flash. Over the levels it will decrese. This is an input parameter to the delay.


//listen for the start button to be clicked
 startButton.addEventListener('click',async(event)=>{
   document.getElementById("led").style.background="green";
   info.innerHTML="Waiting...."
   startButton.disabled=true;  //disable the start button
   await delay(3000) ;         //wait 3s after the start button is pressed
   info.innerHTML="Computers turn"
   playingGame=true;           //we are playing the game
   
   startGame();                //start the game

  
 })


async function endGame()
{

   info.innerHTML="Game Over" //display game over
   document.getElementById("led").style.background="red"; //change led to red
   computerSequence=[];//reset the comp sequence
   userSequence=[];
   playingGame=false;
   level=0;
   timer=1000;
   score=0;
   scoreDisplay.value=score;

   for(let i=0;i<5;i++)//flasg buttons 5 times
   {
   flashColor();
   await delay(500);
   clearColor(); 
   await delay(500);
  
}
startButton.disabled=false;
info.innerHTML="Press start to begin"

}
  function flashColor() {
  green.style.backgroundColor = "#AAFF00";
  red.style.backgroundColor = "#FF5733";
  yellow.style.backgroundColor = "#FFFF00";
  blue.style.backgroundColor = "#0096FF";
  
}
function clearColor() {
      green.style.backgroundColor = "green";
      red.style.backgroundColor =  "darkred"
      yellow.style.backgroundColor = "#8B8000";
      blue.style.backgroundColor =  "darkblue";
   }
async function startGame()
{
   while(playingGame) //game loop
   {

      var rand=Math.floor(Math.random() * 4); //generate a random number 0-green,1-red,2-yellow,3-blue
      computerSequence.push(rand);//add to computerSequence
      //increase the flash speed at level 5,9 and 13
      if(level==5)
      {
         timer=timer-200;
      }
      else if(level==9)
      {
         timer=timer-300;
      }
       else  if(level==13)
      {
         timer=timer-400;
      }
     //This for loop represents the computers turn. Goes thru comp sequence and flashes buttons
     info.innerHTML="Computers turn";
      for (let i = 0; i < computerSequence.length; i++) {
         
         if(computerSequence[i]==0){
            document.getElementById("green").style.background="#AAFF00";
            await delay(timer);
            document.getElementById("green").style.background="green";
         }
         else if(computerSequence[i]==1)
         {
            document.getElementById("red").style.background="#FF5733";
            await delay(timer);
            document.getElementById("red").style.background="darkred";
         }
         else if(computerSequence[i]==2)
         {
            document.getElementById("yellow").style.background="#FFFF00";
            await delay(timer);
            document.getElementById("yellow").style.background="#8B8000";
         }
         else if(computerSequence[i]==3)
         {
            document.getElementById("blue").style.background="#0096FF";
            await delay(timer);
            document.getElementById("blue").style.background="darkblue";
           
         }
            await delay(timer/2);
      }
      //After the computer is done we start the user phase here
      //Every user phase we clear the user sequence
      userSequence=[];
      
    
         myVar = setTimeout( endGame, 5000);//start a global 5s timer
         info.innerHTML="Users turn"
         await userPicks();//wait for the user to pick 
         clearTimeout(myVar);//restart the timer
         
      level++; 
    
   }

}


async function userPicks() {
   // this function listens for which button is pressed and waits until the user has pressed enough buttons to match the current
   // sequence.
   green.addEventListener('click',btnResolverGreen);
   red.addEventListener('click',btnResolverRed);
   yellow.addEventListener('click',btnResolverYellow);
   blue.addEventListener('click',btnResolverBlue);

   for (let c = 0; c < computerSequence.length; c ++) {
    
    
      await waitForPress();//wait for user press to match comp 
    }


   green.removeEventListener('click', btnResolverGreen);
   red.removeEventListener('click', btnResolverRed);
   yellow.removeEventListener('click', btnResolverYellow);
   blue.removeEventListener('click', btnResolverBlue);
  
 }

 //adapted from https://stackoverflow.com/questions/65915371/how-do-i-make-the-program-wait-for-a-button-click-to-go-to-the-next-loop-iterati
let waitForPressResolve;

function waitForPress() {
   
         return new Promise(resolve => waitForPressResolve = resolve); 
}


//if green has been pressed store this in the sequence array and check if the user made a mistake with the input sequence
async function btnResolverGreen() {
   userSequence.push(0);
   document.getElementById("green").style.background="#AAFF00";
   await delay(50);
   document.getElementById("green").style.background="green";
   await delay(50);
   check();
   if (waitForPressResolve) waitForPressResolve();
 }
 //if red has been pressed store this in the sequence array and check if the user made a mistake with the input sequence
 async function btnResolverRed() {
   userSequence.push(1);
   document.getElementById("red").style.background="#FF5733";
   await delay(50);
   document.getElementById("red").style.background="darkred";
   await delay(50);
   check();
   if (waitForPressResolve) waitForPressResolve();
 }
 //if yellow has been pressed store this in the sequence array and check if the user made a mistake with the input sequence
 async function btnResolverYellow() {
   userSequence.push(2);
   document.getElementById("yellow").style.background="#FFFF00";
   await delay(50);
   document.getElementById("yellow").style.background="#8B8000";
   await delay(50);
   check();
   if (waitForPressResolve) waitForPressResolve();
 }
 //if blue has been pressed store this in the sequence array and check if the user made a mistake with the input sequence
 async function btnResolverBlue() {
   userSequence.push(3);
   document.getElementById("blue").style.background="#0096FF";
   await delay(50);
   document.getElementById("blue").style.background="darkblue";
   await delay(50);
   check();
   if (waitForPressResolve) waitForPressResolve();
 }

 
 function check()
 {
   //checks if the user has inputed a matching sequence if so we increase the score else we end the game
   let pass=true;
   for (let i = 0; i < userSequence.length; i ++) {

      if(computerSequence[i]!=userSequence[i])
      {
         endGame();
         pass=false;
      }
      
    }
    //keeping track of the score
    if(pass)
    {
      score++;
      if(topScore<score)
      {
         topScore=score;
      }
    }
   scoreDisplay.value=score;//display current score
   topScoreDisplay.value=topScore;//display top socre
 }
 //END of Assignment
 /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Rough work below

 //  async function startGame()
// // {
// //    while(isPlaying)
// //    {
      
// //       if(compTurn)
// //       {
// //       var rand=Math.floor(Math.random() * 4); //generate a random number 0-green,1-red,2-yellow,3-blue
 
// //       sequence.push(rand);//add to squence
      
// //       for (let i = 0; i < sequence.length; i++) {
         
// //          if(sequence[i]==0){
// //             document.getElementById("green").style.background="#AAFF00";
// //             await delay(1000);
// //             document.getElementById("green").style.background="green";
        
// //          }
// //          else if(sequence[i]==1)
// //          {
// //             document.getElementById("red").style.background="#FF5733";
// //             await delay(1000);
// //             document.getElementById("red").style.background="red";
// //          }
// //          else if(sequence[i]==2)
// //          {
// //             document.getElementById("yellow").style.background="#FFFF00";
// //             await delay(1000);
// //             document.getElementById("yellow").style.background="#8B8000";
// //             }
// //             else if(sequence[i]==3)
// //             {
// //                 document.getElementById("blue").style.background="#0096FF";
// //                 await delay(1000);
// //                 document.getElementById("blue").style.background="blue";
           
// //                }
// //                await delay(500);

// //                turn++;
// //                if(turn=level)
// //                 {
// //                   compTurn=false;
// //                 }
// //      }
// //    }
// //    }
// // }


// let order = [];
// let playerOrder = [];
// let round;
// let turn;
// let good;
// let compTurn;
// let intervalId;
// let current=0;

// let isPlaying=false;
// //const turnCounter = document.querySelector("#turn");
// const greenPad = document.querySelector("#green");
// const redPad = document.querySelector("#red");
// const yellowPad = document.querySelector("#yellow");
// const bluePad = document.querySelector("#blue");
// const startButton = document.querySelector("#startbutton");


// const currentScore = document.querySelector("#current");
// // onButton.addEventListener('click', (event) => {
// //   if (onButton.checked == true) {
// //     on = true;
// //     turnCounter.innerHTML = "-";
// //   } else {
// //     on = false;
// //     turnCounter.innerHTML = "";
// //     clearColor();
// //     clearInterval(intervalId);
// //   }
// // });

// const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))//creats a delay

//  startButton.addEventListener('click',async(event)=>{
//    await sleepNow(3000) ;
//    document.getElementById("led").style.background="green";
//    isPlaying=true;
//    startGame();
   
// })

// function endGame()
// {
//   isPlaying==false;

//        flashColor();
//       // sleepNow(500);
//       // clearColor();
//       // sleepNow(500);
//       // flashColor();
     

  
//    document.getElementById("led").style.background="red";
//    currentScore.value= current=0;
// }
// function startGame() {

//   order = [];
//   playerOrder = [];
//   round = 0;
//   currentScore.value= current;
//   intervalId = 0;
//   turn = 1;
//   for (var i = 0; i < 20; i++) {
//     order.push(Math.floor(Math.random() * 4) );
//   }
//   compTurn = true;
// if(isPlaying===true)
// {
//    intervalId = setInterval(gameTurn, 800); // game turn every 800ms
// }

// }
 

// function gameTurn() {
  
//   if (round == turn) {
//     clearInterval(intervalId);
//     compTurn = false;
//     clearColor();
   
//   }

//   if (compTurn) {
//     clearColor();
//     //every 200ms flash a color
//     setTimeout(() => {
//       if (order[round] == 0) one();
//       if (order[round] == 1) two();
//       if (order[round] == 2) three();
//       if (order[round] == 3) four();
//       round++;
//     }, 200);
//   }

// }

// function one() {
 
//    greenPad.style.backgroundColor = "lightgreen";
// }

// function two() {
 
//   redPad.style.backgroundColor = "tomato";
// }

// function three() {

//   yellowPad.style.backgroundColor = "#FFFF00";
// }

// function four() {

//   bluePad.style.backgroundColor = "lightskyblue";
// }

// function clearColor() {
//    greenPad.style.backgroundColor = "green";
//    redPad.style.backgroundColor = "red";
//    yellowPad.style.backgroundColor = "#8B8000";
//    bluePad.style.backgroundColor = "blue";
// }

// function flashColor() {
//   greenPad.style.backgroundColor = "lightgreen";
//   redPad.style.backgroundColor = "tomato";
//   yellowPad.style.backgroundColor = "#FFFF00";
//   bluePad.style.backgroundColor = "lightskyblue";
// }

// greenPad.addEventListener('click', (event) => {
 
//     playerOrder.push(0);
//     check();
//     one();
    
//       setTimeout(() => {
//         clearColor();
//       }, 300);
    
  
// })

// redPad.addEventListener('click', (event) => {
  
//     playerOrder.push(1);
//     check();
//     two();
   
//       setTimeout(() => {
//         clearColor();
//       }, 300);
    
  
// })

// yellowPad.addEventListener('click', (event) => {
 
//     playerOrder.push(2);
//     check();
//     three();
   
//       setTimeout(() => {
//         clearColor();
//       }, 300);
    
  
// })

// bluePad.addEventListener('click', (event) => {
  
//     playerOrder.push(3);
//     check();
//     four();
 
//       setTimeout(() => {
//         clearColor();
//       }, 300);
    
  
// })


// function check() {

// console.log(playerOrder);
// console.log(order);
//   if (playerOrder[playerOrder.length -1] !== order[playerOrder.length - 1])
//     {
//       endGame();
//     }
    
//     if (turn == playerOrder.length) {
//       turn++;
//       playerOrder = [];
//       compTurn = true;
//       round = 0;
//        console.log("kf");
//       intervalId = setInterval(gameTurn, 800);
//     }
//    }


 







































// // let sequence=[]; //keep track of randomly generated sequence
// // let userSequence=[]; //keep track of user generated sequence
// // let currentScore;
// // let topScore;
// // let level;
// // let turn;

// // const startButton= document.querySelector("#startbutton");
// // // const led= document.querySelector("#led");

// // const delay = (delay) => new Promise((resolve) => setTimeout(resolve, delay))//creats a delay

// //  startButton.addEventListener('click',async(event)=>{
// //    await delay(3000) ;
// //    document.getElementById("led").style.background="green";
// //    isPlaying=true;
// //    compTurn=true;
// //    level=1;
// //    turn=0;
// //    startGame();

// // })
// //  async function startGame()
// // {
// //    while(isPlaying)
// //    {
      
// //       if(compTurn)
// //       {
// //       var rand=Math.floor(Math.random() * 4); //generate a random number 0-green,1-red,2-yellow,3-blue
 
// //       sequence.push(rand);//add to squence
      
// //       for (let i = 0; i < sequence.length; i++) {
         
// //          if(sequence[i]==0){
// //             document.getElementById("green").style.background="#AAFF00";
// //             await delay(1000);
// //             document.getElementById("green").style.background="green";
        
// //          }
// //          else if(sequence[i]==1)
// //          {
// //             document.getElementById("red").style.background="#FF5733";
// //             await delay(1000);
// //             document.getElementById("red").style.background="red";
// //          }
// //          else if(sequence[i]==2)
// //          {
// //             document.getElementById("yellow").style.background="#FFFF00";
// //             await delay(1000);
// //             document.getElementById("yellow").style.background="#8B8000";
// //             }
// //             else if(sequence[i]==3)
// //             {
// //                 document.getElementById("blue").style.background="#0096FF";
// //                 await delay(1000);
// //                 document.getElementById("blue").style.background="blue";
           
// //                }
// //                await delay(500);

// //                turn++;
// //                if(turn=level)
// //                 {
// //                   compTurn=false;
// //                 }
// //      }
// //    }
// //    }
// // }
// // function startGame()
// // {
// //     sequence=[]; //keep track of randomly generated sequence
// //     userSequence=[]; //keep track of user generated sequence
// //     currentScore=0;
// //     round =1;

// //    for(var i=0;i<20;i++)
// //    {
// //       sequence.push(Math.floor(Math.random()*4));
// //    }
// //    console.log(sequence);
// // }
// // function round()
// // {
// //   setTimeout(()=>{
// //    if(sequence[round]==0)
// //    {

// //    }
// //   },200);
  
// // }

// // // var current_score=0;
// // // var top_score=0;
// // // const sequence = [];//keep track of randomly generated sequence
// // // const userSequence=[]; 
// // // var isPlaying=true;

// // // // let wait;

// // // // function waitForPress()
// // // // {
// // // //    return new Promise(resolve => wait=resolve);
// // // // }
// // // // const greenPressed=document.getElementById("green");

// // // // function btnResolver() {
// // // //    if (wait) wait();
// // // //  }
 
// // // //   function doIt() {
// // // //    greenPressed.addEventListener('click', btnResolver);
  
// // // //    while(true){
// // // //        waitForPress();
// // // //       break;
// // // //    }
     
   
// // // //    greenPressed.removeEventListener('click', btnResolver);
// // // //    console.log('Finished');
// // // //  }
 




// // // async function startRound()
// // // {
// // //    while(isPlaying)
// // //    {
// // //       var rand=Math.floor(Math.random() * 4); //generate a random number 0-green,1-red,2-yellow,3-blue
 
// // //       sequence.push(rand);//add to squence
      
// // //       for (let i = 0; i < sequence.length; i++) {
         
// // //          if(sequence[i]==0){
// // //             document.getElementById("green").style.background="#AAFF00";
// // //             await sleepNow(1000);
// // //             document.getElementById("green").style.background="green";
        
// // //          }
// // //          else if(sequence[i]==1)
// // //          {
// // //             document.getElementById("red").style.background="#FF5733";
// // //             await sleepNow(1000);
// // //             document.getElementById("red").style.background="red";
// // //          }
// // //          else if(sequence[i]==2)
// // //          {
// // //             document.getElementById("yellow").style.background="#FFFF00";
// // //             await sleepNow(1000);
// // //             document.getElementById("yellow").style.background="#8B8000";
// // //             }
// // //             else if(sequence[i]==3)
// // //             {
// // //                 document.getElementById("blue").style.background="#0096FF";
// // //                 await sleepNow(1000);
// // //                 document.getElementById("blue").style.background="blue";
           
// // //                }
// // //                await sleepNow(500);
// // //      }
     

// // //      //create a new promise every round to win the round
// // //             let winRound = new Promise((resolve,reject) =>{
              
// // //                      if(winCurrentRound()===true)
                     
// // //                      { 
// // //                         console.log("winCurrentRound()");
// // //                         console.log(winCurrentRound());
// // //                         resolve();
// // //                      }
// // //                      else{
// // //                         console.log("loseCurrentRound()");
// // //                         isPlaying=false;
// // //                        // reject();
// // //                      }
                  
               
              
              
              
              
// // //             })
             
// // //             await winRound;
          
         
        
// // //    }

// // // }
// // // async function lose()
// // // {
  
// // //    // for(let i=0;i<5;i++)
// // //    // {
// // //    //    document.getElementById("green").style.background="#AAFF00";
// // //    //    document.getElementById("red").style.background="#FF5733";
// // //    //    document.getElementById("yellow").style.background="#FFFF00";
// // //    //    document.getElementById("blue").style.background="#0096FF";        
// // //    //    await sleepNow(500);
// // //    //    document.getElementById("green").style.background="green";
// // //    //    document.getElementById("red").style.background="red";
// // //    //    document.getElementById("yellow").style.background="#8B8000";
// // //    //    document.getElementById("blue").style.background="blue";
// // //    //    await sleepNow(500);
// // //    // }
  
// // // }


// // // async function winCurrentRound()
// // // {
// // //   //make a new promise to wait for user input

// // //   let pressed = new Promise((resolve,reject) =>{
// // //    for(let i=0;i<sequence.length;i++)
// // //    {
// // //       document.getElementById("green").addEventListener("click",function(){
// // //          userSequence.push(0);
// // //          resolve();
// // //       })
// // //    }
  
  

// // // })
// // // await pressed;


   
// // //    for(let i=0;i<sequence.length;i++)
// // //    {
// // //       if(sequence[i]!=userSequence[i])
// // //       { 
// // //          return false;
// // //       }
// // //    }
// // //   return true;
   
// // // }

// // //    //  if(sequence[i]!=userSequence[i])
// // //    //     { 
// // //    //        return false;
// // //    //     }
// // //    // }
// // //    // return true;
// // // //  for (let i = 0; i < userSequence.length; i++) {
// // // //    console.log(userSequence[i]+" user");

// // // //    if(sequence[i]!=userSequence[i])
// // // //    { console.log(" false");
// // // //       return false;
// // // //    }
  
 
// // // //  }
    


 

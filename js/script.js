let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){
  currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let resposne = await a.text();
  
    let div = document.createElement("div")
    div.innerHTML = resposne;
    let as = div.getElementsByTagName("a")
     songs = []
    for(let index = 0; index<as.length; index++){
       const elemet = as[index];
       if(elemet.href.endsWith(".mp3")){
        songs.push(elemet.href.split(`/${folder}/`)[1])
       }
    }

    let songUrl = document.querySelector(".songList").getElementsByTagName("ul")[0] 
    songUrl.innerHTML = ""
    for(const song of songs){
        // let formattedSong = song.substring(1);
        songUrl.innerHTML = songUrl.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Song Artist</div>
        </div>
        <div class="playnow"><span>playnow</span>
        <img class="invert" src="img/play.svg" alt="">
      </div>
      </li>`;
      
    }
    
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", elemet=>{
           
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
        
    })


    return songs
    
}

const playMusic = (tract, pause=false) =>{
//   let audio = new Audio("/songs/" + tract)
currentSong.src = `/${currfolder}/` + tract
if(!pause){
  currentSong.play()
  let play = document.querySelector("#play");
  play.src = "img/pause.svg"
}
  
 
  document.querySelector(".songinfo").innerHTML = decodeURI(tract)
  document.querySelector(".songtime").innerHTML = "00:00"
}

async function displayAlbum(){
  let a = await fetch(`http://127.0.0.1:5500/songs/`)
 
  let resposne = await a.text();
  

  let div = document.createElement("div")
  div.innerHTML = resposne;
  let anchors = div.getElementsByTagName("a")
 
  Array.from(anchors).forEach(async e=>{

    if(e.href.includes("/songs")){
      let folder = new URL(e.href).pathname.split("/")[2];
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      
 
     let resposne = await a.json();
     console.log(resposne)
    }
  })
 
}

async function main(){

// get list of all song
await getSongs("songs/pop")
playMusic(songs[0], true)

// dispaly all the ablums on the page

// displayAlbum()

// Attach an evengt listner play next previous
let play = document.querySelector("#play");
play.addEventListener("click", ()=>{
    if(currentSong.paused){
    currentSong.play()
    play.src = "img/pause.svg"
}
else{
        currentSong.pause()
        play.src = "img/play.svg"
    }
})

//  Listen for timeupdate event
currentSong.addEventListener("timeupdate", () => {
 
  document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%";
})
 
// Add an event listner to sekbar
document.querySelector(".seekbar").addEventListener("click", e=>{
  let percent =  (e.offsetX/e.target.getBoundingClientRect().width) * 100;
 
  document.querySelector(".circle").style.left = percent + "%";
  currentSong.currentTime = ((currentSong.duration) * percent)/100
})

// Add an event listner for hamburger
document.querySelector(".hamburger").addEventListener("click", ()=>{
  document.querySelector(".left").style.left = "0"
})

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-120%"
})

// Add an event listner for previous and next
let previos = document.querySelector("#previos")
previos.addEventListener("click", () => {
  currentSong.pause()
 
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if (index === 0) {
    playMusic(songs[songs.length - 1]);
  } else {
    playMusic(songs[index - 1]);
  }
})

let next = document.querySelector("#next")
next.addEventListener("click", () => {
  currentSong.pause()
 

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
  }
  else if((index+1) >= songs.length){
    playMusic(songs[0])
  }
  
});



document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=> {
 
  currentSong.volume = parseInt(e.target.value)/100
})

// load the playsist when card is clicked 
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click", async item => {
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    // item.dataset.folder
  })
})

}


main()
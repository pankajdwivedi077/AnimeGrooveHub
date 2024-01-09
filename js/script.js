let currentSong = new Audio();

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let resposne = await a.text();
    // console.log(resposne)
    let div = document.createElement("div")
    div.innerHTML = resposne;
    let as = div.getElementsByTagName("a")
    let songs = []
    for(let index = 0; index<as.length; index++){
       const elemet = as[index];
       if(elemet.href.endsWith(".mp3")){
        songs.push(elemet.href.split("/songs")[1])
       }
    }
    return songs
    
}

const playMusic = (tract) =>{
//   let audio = new Audio("/songs/" + tract)
currentSong.src = "/songs/" + tract
  currentSong.play()
}

async function main(){

// get list of all song
let songs = await getSongs()
// console.log(songs)

let songUrl = document.querySelector(".songList").getElementsByTagName("ul")[0]
for(const song of songs){
    let formattedSong = song.substring(1);
    songUrl.innerHTML = songUrl.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
    <div class="info">
      <div>${formattedSong.replaceAll("%20", " ")}</div>
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
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML)
    })
    
})

}

main()
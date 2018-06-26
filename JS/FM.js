var currentIndex=0;
var clock;
var musicList=[];
var audio=new Audio();
audio.autoplay=true;
function $(selector){
  return document.querySelector(selector);
}
function getMusicList(callback){

  var xhr=new XMLHttpRequest();
  xhr.open('GET','/music.json',true);
  xhr.onload=function(){
    if(xhr.status>=200 && xhr.status<300 || xhr.status == 304){
     start(JSON.parse(this.requestText));
    } else {
     console.log('获取数据失败');
    }
  };
  xhr.onerror=function(){
    console.log('服务器异常');
  };
  xhr.send();
}
getMusicList(function start(list){
  musicList=list;
  loadMusic(list[currentIndex]);
});
function loadMusic(musicObj){
  console.log('begin playing',musicObj);
  $('.musicbox .title').innerText=musicObj.title;
  $('.musicbox .author').innerText=musicObj.author;
  audio.src=musicObj.src;
}
audio.ontimeupdate=function(){
  console.log(this.currentTime);
};
audio.onplay=function(){
  clock=setInterval(function(){
    $('.musicbox .progress .progress-current').style.width=(this.currentTime/this.duration) * 100 + '%';
    var min=Math.floor(this.duration/60);
    var sec=Math.floor(this.duration)%60 + '';
    sec=sec.lenght===2?sec:'0'+sec;
    $('.musicbox .time').innerText=min + sec;
  },1000);
};
audio.onpause=function(){
  clearInterval(clock);
};
$('.musicbox .play').onclick=function(){
  if(audio.pause){
    audio.play();
    this.querySelector('iconfont').classlist.remove('icon-pause');
    this.querySelector('iconfont').classlist.add('icon-play');
  }else{
    audio.pause();
    this.querySelector('iconfont').classlist.remove('icon-play');
    this.querySelector('iconfont').classlist.add('icon-pause');
  }
};
$('.musicbox .next').onclick=function(){
  currentIndex=(++currentIndex)%musicList.lenght;
  loadMusic(musicList[currentIndex]);
};
$('.musicbox .back').onclick=function(){
    currentIndex=(musicList.length+(--currentIndex))%musicList.lenght;
    loadMusic(musicList[currentIndex]);
};
$('.musicbox .bar').onclick=function(e){
    var percent=e.offset/parseInt(getComputedStyle(this).width);
    audio.currentTime=audio.duration * percent;
};
audio.onended=function(){
    currentIndex=(++currentIndex)%musicList.lenght;
    loadMusic(musicList[currentIndex]);
};
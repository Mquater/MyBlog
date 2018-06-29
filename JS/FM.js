var currentIndex = 0;
var clock;
var musicList=[];
var audio=new Audio();
audio.autoplay=true;
function $(selector){
  return document.querySelector(selector);
}
getMusicList(function(list){
  musicList=list;
  loadMusic(list[currentIndex]);
  updateList(list,currentIndex)=setInterval(function(){
    nextIndex=(currentIndex+1)%musicList.length;
    $('.list .current').innerText=(list[currentIndex]).title + '-' + (list[currentIndex]).author;
    $('.list .nextone').innerText=(list[nextIndex]).title + '-' + (list[nextIndex]).author;
  },0);
});
//获取音乐数据
function getMusicList(callback){
  var xhr=new XMLHttpRequest();
  xhr.open('GET','../music.json',true);
  xhr.onload=function(){
    if((xhr.status>=200 && xhr.status<300) || xhr.status == 304){
     callback(JSON.parse(this.responseText));
    } else {
     console.log('获取数据失败');
    }
  };
  xhr.onerror=function(){
    console.log('服务器异常');
  };
  xhr.send();
}
//音乐进度条,歌曲信息更新
function loadMusic(musicObj){
  $('.musicbox .title').innerText=musicObj.title;
  $('.musicbox .author').innerText=musicObj.author;
  audio.src=musicObj.src;
}
audio.ontimeupdate=function(){
  $('.musicbox .progress .progress-current').style.width=(this.currentTime/this.duration) * 100 + '%';
};
audio.onplay=function(){
  clock=setInterval(function(){
    var min=Math.floor(audio.currentTime/60);
    var sec=Math.floor(audio.currentTime)%60 + '';
    sec=sec.length===2?sec:'0' + sec;
    $('.musicbox .time').innerText=min +':' + sec;
  },1000);
};
audio.onpause=function(){
  clearInterval(clock);
};
//暂停 播放(图标切换未实现)
$('.musicbox .play').onclick=function(){
  if(audio.paused){
    audio.play();
    this.querySelector('iconfont').classList.remove('icon-pause');
    this.querySelector('iconfont').classList.add('icon-play');
  }else{
    audio.pause();
    this.querySelector('iconfont').classList.remove('icon-play');
    this.querySelector('iconfont').classList.add('icon-pause');
  }
};
//下一首
$('.musicbox .next').onclick=function(){
  currentIndex=(++currentIndex)%musicList.length;
  loadMusic(musicList[currentIndex]);
};
//上一首
$('.musicbox .back').onclick=function(){
    currentIndex=(musicList.length+(--currentIndex))%musicList.length;
    loadMusic(musicList[currentIndex]);
};
//拖动时间条
$('.musicbox .bar').onclick=function(e){
    var percent=e.offsetX/parseInt(getComputedStyle(this).width);
    audio.currentTime=audio.duration * percent;
};
//自动播放下一首
audio.onended=function(){
    currentIndex=(++currentIndex)%musicList.length;
    loadMusic(musicList[currentIndex]);
};
$('.list .current').onclick=function(){
  loadMusic(musicList[currentIndex]);
};
$('.list .nextone').onclick=function(){
  currentIndex=(currentIndex+1)%musicList.length;
  loadMusic(musicList[currentIndex]);
};

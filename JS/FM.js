var hxr=new XMLHttpRequest()
xhr.open('GET','/music.json',true)
xhr.onload=function(){
  if(xhr.status>=200 && xhr.status<300 || xhr.status == 304){
  console.log(Json.Parse(this.requestText))
  } else {
  console.log('服务器异常')
}
}
xhr.onerror=function(){
  console.log('服务器异常')
}
xhr.send()
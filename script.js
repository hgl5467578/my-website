//=========================
// إعداد Firebase
//=========================

const firebaseConfig = {
  apiKey: "AIzaSyAUBbxDZY31hQPhAq1wQXUAct3c1XsJhto",
  authDomain: "myschoolplatform-d5981.firebaseapp.com",
  projectId: "myschoolplatform-d5981",
  storageBucket: "myschoolplatform-d5981.firebasestorage.app",
  messagingSenderId: "1054891628593",
  appId: "1:1054891628593:web:9d4cf4908caf64c82e1d10",
  measurementId: "G-WNOMSJDLXP"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();


//=========================
// صفحة الأستاذ
//=========================

const uploadBtn = document.getElementById("uploadBtn");
const videoTitle = document.getElementById("videoTitle");
const videoUrl = document.getElementById("videoUrl");

if(uploadBtn){

uploadBtn.addEventListener("click", async ()=>{

const title = videoTitle.value.trim();
const url = videoUrl.value.trim();

if(title==="" || url===""){
alert("يرجى إدخال عنوان الدرس ورابط اليوتيوب.");
return;
}

let videoId="";

if(url.includes("watch?v=")){
videoId=url.split("watch?v=")[1].split("&")[0];
}
else if(url.includes("youtu.be/")){
videoId=url.split("youtu.be/")[1].split("?")[0];
}
else{
alert("رابط اليوتيوب غير صحيح.");
return;
}

const embed="https://www.youtube.com/embed/"+videoId;

try{

uploadBtn.disabled=true;
uploadBtn.innerText="جاري الحفظ...";

await db.collection("lessons").add({

title:title,

url:embed,

createdAt:new Date()

});

alert("تمت إضافة الدرس بنجاح ✅");

videoTitle.value="";
videoUrl.value="";

}
catch(error){

console.log(error);

alert("حدث خطأ أثناء الحفظ.");

}

uploadBtn.disabled=false;

uploadBtn.innerText="رفع الدرس";

});

}



//=========================
// صفحة الطلاب
//=========================

const videoContainer=document.getElementById("videoContainer");

if(videoContainer){

loadVideos();

}

async function loadVideos(){

videoContainer.innerHTML="";

const snapshot=await db.collection("lessons").orderBy("createdAt","desc").get();

if(snapshot.empty){

videoContainer.innerHTML="<p>لا توجد دروس حالياً.</p>";

return;

}

snapshot.forEach(doc=>{

const lesson=doc.data();

const card=document.createElement("div");

card.className="video-card";

card.innerHTML=`

<h3>${lesson.title}</h3>

<iframe
width="100%"
height="400"
src="${lesson.url}"
title="${lesson.title}"
frameborder="0"
allowfullscreen>
</iframe>

`;

videoContainer.appendChild(card);

});

}

// إعدادات الاتصال الخاصة بمنصتك (مأخوذة من حسابك)
const firebaseConfig = {
  apiKey: "AIzaSyAUBbxDZY31hQPhAq1wQXUAct3c1XsJhto",
  authDomain: "myschoolplatform-d5981.firebaseapp.com",
  projectId: "myschoolplatform-d5981",
  storageBucket: "myschoolplatform-d5981.firebasestorage.app",
  messagingSenderId: "1054891628593",
  appId: "1:1054891628593:web:9d4cf4908caf64c82e1d10",
  measurementId: "G-WNOMSJDLXP"
};

// تشغيل Firebase بالطريقة المتوافقة محلياً
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();

// ==========================================
// 👨‍🏫 أولاً: كود صفحة المعلم (رفع الدروس)
// ==========================================
const uploadBtn = document.getElementById('uploadBtn');
const videoTitleInput = document.getElementById('videoTitle');
const videoFileInput = document.getElementById('videoFile');

if (uploadBtn) {
    uploadBtn.addEventListener('click', async () => {
        const title = videoTitleInput.value.trim();
        const file = videoFileInput.files[0];

        if (!title || !file) {
            alert('رجاءً اكتب عنوان الدرس واختر ملف الفيديو أولاً!');
            return;
        }

        try {
            // تغيير نص وحالة الزر لمنع التكرار
            uploadBtn.disabled = true;
            uploadBtn.innerText = 'جاري الرفع السحابي الآن... انتظر قليلاً ⏳';

            // أ) إنشاء مسار الرفع السحابي للملف
            const storageRef = storage.ref('lessons/' + Date.now() + '_' + file.name);
            
            // ب) بدء رفع الملف الفعلي للـ Storage
            const snapshot = await storageRef.put(file);
            
            // ج) جلب الرابط السحابي للملف المرفوع
            const downloadURL = await snapshot.ref.getDownloadURL();

            // د) حفظ العنوان والرابط في قاعدة بيانات Firestore
            await db.collection("lessons").add({
                title: title,
                url: downloadURL,
                createdAt: new Date()
            });

            alert('تم رفع الدرس بنجاح تام ووصل إلى السحاب 🎉');
            videoTitleInput.value = '';
            videoFileInput.value = '';

        } catch (error) {
            console.error("خطأ أثناء الرفع:", error);
            alert('حدث خطأ أثناء الرفع! تأكد من تفعيل قواعد الحماية Rules في حساب Firebase الخاص بك لـ Storage و Firestore.');
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.innerText = 'اضغط هنا للرفع فوراً 🚀';
        }
    });
}

// ==========================================
// 👨‍🎓 ثانياً: كود صفحة الطلاب (عرض الدروس)
// ==========================================
const videoContainer = document.getElementById('videoContainer');

async function loadVideos() {
    if (!videoContainer) return;
    
    try {
        videoContainer.innerHTML = '';
        
        // جلب جميع المستندات المرفوعة من السحابة مرتبة
        const querySnapshot = await db.collection("lessons").get();
        
        if (querySnapshot.empty) {
            videoContainer.innerHTML = "<p style='color: #7f8c8d; text-align:center;'>لا توجد دروس مرفوعة حالياً.</p>";
            return;
        }

        querySnapshot.forEach((doc) => {
            const lesson = doc.data();
            const card = document.createElement("div");
            card.className = "video-card";
            card.innerHTML = `
                <h3>🎬 ${lesson.title}</h3>
                <video controls style="width:100%; border-radius:8px;">
                    <source src="${lesson.url}" type="video/mp4">
                    متصفحك لا يدعم تشغيل هذا الفيديو.
                </video>
            `;
            videoContainer.appendChild(card);
        });
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        videoContainer.innerHTML = "<p style='color: #e74c3c; text-align:center;'>حدث خطأ أثناء جلب الدروس، تأكد من إعدادات الـ Rules في Firestore Database.</p>";
    }
}

if (videoContainer) {
    loadVideos();
}
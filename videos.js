
const videos = [
    { title: "الدرس الأول", url: "https://www.youtube.com/embed/OvsP1rkS7Yw" }
];

const container = document.getElementById('videos');

// مسح أي محتوى قديم لعرض الجديد فقط
container.innerHTML = '';

videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${video.title}</h3>
        <iframe width="100%" height="315" src="${video.url}" frameborder="0" allowfullscreen></iframe>
    `;
    container.appendChild(card);
});

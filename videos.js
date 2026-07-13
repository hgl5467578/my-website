const videos = [
    { title: "الدرس الأول", url: "https://www.youtube.com/embed/VIDEO_ID_1" },
    { title: "الدرس الثاني", url: "https://www.youtube.com/embed/VIDEO_ID_2" },
    { title: "الدرس الثالث", url: "https://www.youtube.com/embed/VIDEO_ID_3" }
];

const container = document.getElementById('videos');

videos.forEach(video => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h2>${video.title}</h2>
        <iframe src="${video.url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `;
    container.appendChild(card);
});

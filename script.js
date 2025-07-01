const qr = new Html5Qrcode("reader");
const startBtn = document.getElementById("startBtn");
const codeText = document.getElementById("codeText");

startBtn.addEventListener("click", () => {
    qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            console.log("読み取ったデータ:", qrCodeMessage);
            codeText.innerText = qrCodeMessage;

            // スプレッドシートに送信
            fetch('https://script.google.com/macros/s/AKfycbxIPXNwF7WNKFB55pbJetDUIWMDWEwsw-43jXA1659QaICvtMuW14gjuv0yEaL45VY/exec', {
                method: 'POST',
                body: JSON.stringify({ code: qrCodeMessage }),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                alert('スプレッドシートに送信しました: ' + JSON.stringify(data));
            })
            .catch(err => {
                alert('送信エラー: ' + err);
            });

            qr.stop();
        },
        errorMessage => {
            // 読み取り失敗時は何もしない
        }
    );
});


const scoreList = document.getElementById("scoreList");
const modal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const closeBtn = document.getElementById("closeBtn");

fetch('https://script.google.com/macros/s/AKfycbxIPXNwF7WNKFB55pbJetDUIWMDWEwsw-43jXA1659QaICvtMuW14gjuv0yEaL45VY/exec')
  .then(res => res.json())
  .then(data => {
data.forEach(item => {
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="col fifty">${item.fiftySound}</span>
    <span class="col title">${item.title}</span>
    <span class="col genre">${item.genre}</span>
    <span class="col arrangement">${item.arrangement}</span>
  `;
  li.addEventListener("click", () => showDetail(item));
  scoreList.appendChild(li);
});

  })
  .catch(err => alert("データ取得エラー: " + err));

function showDetail(item) {
detailContent.innerHTML = `
  <h2>${item.title}</h2>
  <div class="detail-block">
    <span class="label">楽譜番号</span><br>
    <span class="value">${item.scoreNo}</span>
  </div>
　<div class="detail-block">
    <span class="label">曲名（ふりがな）</span><br>
    <span class="value">${item.titleKana}</span>
  </div>
  <div class="detail-block">
    <span class="label">曲名（English）</span><br>
    <span class="value">${item.titleEn}</span>
  </div>
  <div class="detail-block">
    <span class="label">作曲者</span><br>
    <span class="value">${item.composer}</span>
  </div>
  <div class="detail-block">
    <span class="label">アーティスト</span><br>
    <span class="value">${item.artist}</span>
  </div>
  <div class="detail-block">
    <span class="label">50音</span><br>
    <span class="value">${item.fiftySound}</span>
  </div>
  <div class="detail-block">
    <span class="label">アルファベット</span><br>
    <span class="value">${item.alphabet}</span>
  </div>
  <div class="detail-block">
    <span class="label">ジャンル</span><br>
    <span class="value">${item.genre}</span>
  </div>
  <div class="detail-block">
    <span class="label">編成</span><br>
    <span class="value">${item.arrangement}</span>
  </div>
  <div class="detail-block">
    <span class="label">課題曲年</span><br>
    <span class="value">${item.taskYear}</span>
  </div>
  <div class="detail-block">
    <span class="label">備考</span><br>
    <span class="value">${item.memo}</span>
  </div>
`;

  modal.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

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
    <h2>${item.title} (${item.titleKana})</h2>
    <p>英語タイトル：${item.titleEn}</p>
    <p>楽譜番号：${item.scoreNo}</p>
    <p>作曲者：${item.composer}</p>
    <p>アーティスト：${item.artist}</p>
    <p>50音：${item.fiftySound}</p>
    <p>アルファベット：${item.alphabet}</p>
    <p>ジャンル：${item.genre}</p>
    <p>編成：${item.arrangement}</p>
    <p>課題曲年：${item.taskYear}</p>
    <p>備考：${item.memo}</p>
  `;
  modal.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

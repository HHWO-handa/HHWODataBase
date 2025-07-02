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
const placeholder = document.getElementById("placeholderMessage");

const btnScore = document.getElementById("btnScore");
const btnInstrument = document.getElementById("btnInstrument");
const btnRepair = document.getElementById("btnRepair");
const pageTitle = document.getElementById("pageTitle");

fetch('https://script.google.com/macros/s/AKfycbxIPXNwF7WNKFB55pbJetDUIWMDWEwsw-43jXA1659QaICvtMuW14gjuv0yEaL45VY/exec')
  .then(res => res.json())
  .then(data => {
          allData = data;  // 追加
    renderList(allData);  // 関数化
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
  document.getElementById("bottomNav").classList.add("hidden");
      document.getElementById("topBar").classList.add("hidden"); 
}

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("bottomNav").classList.remove("hidden");
      document.getElementById("topBar").classList.remove("hidden"); // 追加
});

btnScore.addEventListener("click", () => {
  pageTitle.textContent = "楽譜データベース";
  scoreList.classList.remove("hidden");
  placeholder.classList.add("hidden");
});

btnInstrument.addEventListener("click", () => {
  pageTitle.textContent = "楽器一覧";
  scoreList.classList.add("hidden");
  placeholder.textContent = "表示問題なし";
  placeholder.classList.remove("hidden");
});

btnRepair.addEventListener("click", () => {
  pageTitle.textContent = "修理記録";
  scoreList.classList.add("hidden");
  placeholder.textContent = "表示問題なし";
  placeholder.classList.remove("hidden");
});


//新規追加部分
let allData = []; // 追加：全データ保持

function renderList(data) {
  scoreList.innerHTML = "";
  placeholder.classList.add("hidden");

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
}

document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(keyword)
    )
  );
  renderList(filtered);
});

document.getElementById("filterBtn").addEventListener("click", () => {
  const genreFilter = prompt("ジャンル名を入力してください：");
  if (!genreFilter) return;
  const filtered = allData.filter(item => item.genre.includes(genreFilter));
  renderList(filtered);
});


// 楽譜用検索バーと楽器用検索バーの分離・QRコード対応版

const qr = new Html5Qrcode("reader");
const startBtn = document.getElementById("startBtn");
const codeText = document.getElementById("codeText");

startBtn.addEventListener("click", () => {
  qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      console.log("読み取ったデータ:", qrCodeMessage);
      codeText.innerText = qrCodeMessage;

      fetch('https://script.google.com/macros/s/AKfycbzGdT1xAFE4IuxK5gTC3Eh2iLE2r9Wr5tbuNci7fDm63zXnWfahGufyPJS1roj15Aw/exec', {
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

const searchScoreInput = document.getElementById("searchScoreInput");
const searchInstrumentInput = document.getElementById("searchInstrumentInput");
const qrInstrumentBtn = document.getElementById("qrInstrumentBtn");

let allData = [];
let allInstrumentData = [];

fetch('https://script.google.com/macros/s/AKfycbzGdT1xAFE4IuxK5gTC3Eh2iLE2r9Wr5tbuNci7fDm63zXnWfahGufyPJS1roj15Aw/exec')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderList(allData);
  })
  .catch(err => alert("データ取得エラー: " + err));

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

document.getElementById("searchScoreInput").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allData.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(keyword)));
  renderList(filtered);
});

document.getElementById("filterBtn").addEventListener("click", () => {
  const genreFilter = prompt("ジャンル名を入力してください：");
  if (!genreFilter) return;
  const filtered = allData.filter(item => item.genre.includes(genreFilter));
  renderList(filtered);
});

fetch('https://script.google.com/macros/s/AKfycbzGdT1xAFE4IuxK5gTC3Eh2iLE2r9Wr5tbuNci7fDm63zXnWfahGufyPJS1roj15Aw/exec?sheet=InstrumentDataBase')
  .then(res => res.json())
  .then(data => {
    allInstrumentData = data;
  })
  .catch(err => alert("楽器データ取得エラー: " + err));

const instrumentList = document.getElementById("instrumentList");

function renderInstrumentList(data) {
  instrumentList.innerHTML = "";
  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="instrument-left">
        <img src="${item.image}" alt="画像">
        <div class="instrument-info">
          <span>${item.instrumentName}</span>
          <span> ${item.equipmentNo}</span>
        </div>
      </div>
      <span>${item.instrumentNo}</span>
    `;
    li.addEventListener("click", () => showInstrumentDetail(item));
    instrumentList.appendChild(li);
  });
}

document.getElementById("searchInstrumentInput").addEventListener("input", e => {
  const keyword = e.target.value.toLowerCase();
  const filtered = allInstrumentData.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(keyword)));
  renderInstrumentList(filtered);
});

qrInstrumentBtn.addEventListener("click", () => {
  qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      searchInstrumentInput.value = qrCodeMessage;
      const filtered = allInstrumentData.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(qrCodeMessage.toLowerCase())));
      renderInstrumentList(filtered);
      qr.stop();
    },
    errorMessage => {
      // 読み取り失敗時は何もしない
    }
  );
});

btnScore.addEventListener("click", () => {
  pageTitle.textContent = "楽譜データベース";
  scoreList.classList.remove("hidden");
  instrumentList.classList.add("hidden");
  placeholder.classList.add("hidden");
  document.getElementById("searchScoreArea").classList.remove("hidden");
  document.getElementById("searchInstrumentArea").classList.add("hidden");
});

btnInstrument.addEventListener("click", () => {
  pageTitle.textContent = "楽器一覧";
  scoreList.classList.add("hidden");
  instrumentList.classList.remove("hidden");
  placeholder.classList.add("hidden");
  document.getElementById("searchScoreArea").classList.add("hidden");
  document.getElementById("searchInstrumentArea").classList.remove("hidden");
  renderInstrumentList(allInstrumentData);
});

btnRepair.addEventListener("click", () => {
  pageTitle.textContent = "修理記録";
  scoreList.classList.add("hidden");
  instrumentList.classList.add("hidden");
  placeholder.textContent = "表示問題なし";
  placeholder.classList.remove("hidden");
  document.getElementById("searchScoreArea").classList.add("hidden");
  document.getElementById("searchInstrumentArea").classList.add("hidden");
});

function showDetail(item) {
  detailContent.innerHTML = `
    <h2>${item.title}</h2>
    ${generateDetailBlock("楽譜番号", item.scoreNo)}
    ${generateDetailBlock("曲名（ふりがな）", item.titleKana)}
    ${generateDetailBlock("曲名（English）", item.titleEn)}
    ${generateDetailBlock("作曲者", item.composer)}
    ${generateDetailBlock("アーティスト", item.artist)}
    ${generateDetailBlock("50音", item.fiftySound)}
    ${generateDetailBlock("アルファベット", item.alphabet)}
    ${generateDetailBlock("ジャンル", item.genre)}
    ${generateDetailBlock("編成", item.arrangement)}
    ${generateDetailBlock("課題曲年", item.taskYear)}
    ${generateDetailBlock("備考", item.memo)}
  `;
  modal.classList.remove("hidden");
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("topBar").classList.add("hidden");
}

function showInstrumentDetail(item) {
  detailContent.innerHTML = `
          <div class="instrument-detail">
        <img src="${item.image}" alt="画像">
        </div>
    <h2>${item.instrumentName}</h2>
    ${generateDetailBlock("楽器番号", item.instrumentNo)}
    ${generateDetailBlock("QRコード", item.qr)}
    ${generateDetailBlock("楽器コード", item.instrumentCode)}
    ${generateDetailBlock("管理開始日", item.startDate)}
    ${generateDetailBlock("楽器メーカー", item.manufacturer)}
    ${generateDetailBlock("製品名", item.productName)}
    ${generateDetailBlock("所有元", item.owner)}
    ${generateDetailBlock("楽器状態", item.status)}
    ${generateDetailBlock("備品番号", item.equipmentNo)}
  `;
  modal.classList.remove("hidden");
  document.getElementById("bottomNav").classList.add("hidden");
  document.getElementById("topBar").classList.add("hidden");
}

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  document.getElementById("bottomNav").classList.remove("hidden");
  document.getElementById("topBar").classList.remove("hidden");
});

function generateDetailBlock(label, value) {
  return `
    <div class="detail-block">
      <span class="label">${label}</span><br>
      <span class="value">${value}</span>
    </div>
  `;
}


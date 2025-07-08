
// 共通要素取得
const scoreList = document.getElementById("scoreList");
const instrumentList = document.getElementById("instrumentList");
const modal = document.getElementById("detailModal");
const detailContent = document.getElementById("detailContent");
const closeBtn = document.getElementById("closeBtn");
const placeholder = document.getElementById("placeholderMessage");
const btnScore = document.getElementById("btnScore");
const btnInstrument = document.getElementById("btnInstrument");
const btnRepair = document.getElementById("btnRepair");
const pageTitle = document.getElementById("pageTitle");
const topBar = document.getElementById("topBar");
const searchInput = document.getElementById("searchInput");
const filterBtn = document.getElementById("filterBtn");
const bottomNav = document.getElementById("bottomNav");

let allData = [];
let allInstrumentData = [];

// 楽譜データ取得
fetch("https://script.google.com/macros/s/AKfycbzGdT1xAFE4IuxK5gTC3Eh2iLE2r9Wr5tbuNci7fDm63zXnWfahGufyPJS1roj15Aw/exec?sheet=ScoreDataBase")
    .then(res => res.json())
    .then(data => {
        allData = data;
        renderList(allData);
    })
    .catch(err => alert("データ取得エラー: " + err));

function renderList(data) {
  const list = document.getElementById("scoreList");
  list.innerHTML = "";  // リストだけ消去
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
    bottomNav.classList.add("hidden");
    topBar.classList.add("hidden");
}

// 楽器データ取得
fetch("https://script.google.com/macros/s/AKfycbzGdT1xAFE4IuxK5gTC3Eh2iLE2r9Wr5tbuNci7fDm63zXnWfahGufyPJS1roj15Aw/exec?sheet=InstrumentDataBase")
    .then(res => res.json())
    .then(data => allInstrumentData = data)
    .catch(err => alert("楽器データ取得エラー: " + err));

function renderInstrumentList(data) {
      const list = document.getElementById("instrumentList");
  list.innerHTML = "";  // リストだけ消去
    data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="instrument-left">
                <img src="${item.image}" alt="画像">
                <div class="instrument-infoA">
                    <span>${item.instrumentName}</span>
                    <div class="instrument-infoB">
                       <span>${item.equipmentNo}</span>
                    </div>
                </div>
            </div>
            <span> ${item.instrumentNo}</span>
        `;
        li.addEventListener("click", () => showInstrumentDetail(item));
        instrumentList.appendChild(li);
    });
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
    bottomNav.classList.add("hidden");
    topBar.classList.add("hidden");
}

// 共通イベント
closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    bottomNav.classList.remove("hidden");
    topBar.classList.remove("hidden");
});


btnScore.addEventListener("click", () => {
  pageTitle.textContent = "楽譜データベース";
  scoreList.classList.remove("hidden");
  instrumentList.classList.add("hidden");
  placeholder.classList.add("hidden");

  document.getElementById("searchInstrumentArea").classList.add("hidden");
});

btnInstrument.addEventListener("click", () => {
  pageTitle.textContent = "楽器一覧";
  scoreList.classList.add("hidden");
  instrumentList.classList.remove("hidden");
  placeholder.classList.add("hidden");

  document.getElementById("searchInstrumentArea").classList.remove("hidden");

  renderInstrumentList(allInstrumentData);
});

btnRepair.addEventListener("click", () => {
  pageTitle.textContent = "修理記録";
  scoreList.classList.add("hidden");
  instrumentList.classList.add("hidden");
  placeholder.textContent = "表示問題なし";
  placeholder.classList.remove("hidden");

  document.getElementById("searchInstrumentArea").classList.add("hidden");
});

// 楽譜データベース検索・フィルター
document.getElementById("searchInput").addEventListener("input", (e) => {
  const keyword = e.target.value.toLowerCase();

  if (currentPage === "score") {
    const filtered = allData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(keyword)
      )
    );
    renderList(filtered);
  }

  if (currentPage === "instrument") {
    const filtered = allInstrumentData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(keyword)
      )
    );
    renderInstrumentList(filtered);
  }
});


let currentPage = "score";

btnScore.addEventListener("click", () => {
  currentPage = "score";
  pageTitle.textContent = "楽譜データベース";
  scoreList.classList.remove("hidden");
  instrumentList.classList.add("hidden");
  placeholder.classList.add("hidden");
  document.getElementById("searchInput").value = "";
});

btnInstrument.addEventListener("click", () => {
  currentPage = "instrument";
  pageTitle.textContent = "楽器一覧";
  scoreList.classList.add("hidden");
  instrumentList.classList.remove("hidden");
  placeholder.classList.add("hidden");
  document.getElementById("searchInput").value = "";
  renderInstrumentList(allInstrumentData);
});



// 詳細表示共通ブロック生成
function generateDetailBlock(label, value) {
    return `
        <div class="detail-block">
            <span class="label">${label}</span><br>
            <span class="value">${value}</span>
        </div>
    `;
}


//QRコード読み込み機能
const qr = new Html5Qrcode("reader");

document.getElementById("qrInstrumentBtn").addEventListener("click", () => {
  // 強制的に楽器一覧を表示
  btnInstrument.click();
  document.getElementById("reader").style.display = "block";  

  qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      document.getElementById("searchInput").value = qrCodeMessage;

      const filtered = allInstrumentData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(qrCodeMessage.toLowerCase())
        )
      );
      renderInstrumentList(filtered);

      qr.stop();
  document.getElementById("reader").style.display = "none";
    },
    errorMessage => {
      // 読み取り失敗時は無視
    }
  );
});


const closeCameraBtn = document.getElementById("closeCameraBtn");

closeCameraBtn.addEventListener("click", () => {
  qr.stop().then(() => {
    document.getElementById("reader").style.display = "none";
  }).catch(err => {
    alert("カメラ停止時にエラーが発生しました: " + err);
  });
});

//以下、楽譜追加機能
//以下、楽譜追加機能

const addScoreBtn = document.getElementById("addScoreBtn");
const addScoreModal = document.getElementById("addScoreModal");
const cancelAddBtn = document.getElementById("cancelAddBtn");
const addScoreForm = document.getElementById("addScoreForm");

// モーダル開く
addScoreBtn.addEventListener("click", () => {
  // 最大の楽譜番号を取得して+1（文字列→数値）
  const maxScoreNo = allData.reduce((max, item) => {
    const num = parseInt(item.scoreNo);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  document.getElementById("scoreNo").value = maxScoreNo + 1;

  addScoreModal.classList.remove("hidden");
  topBar.classList.add("hidden");
  bottomNav.classList.add("hidden");
});

// モーダル閉じる
cancelAddBtn.addEventListener("click", () => {
  addScoreModal.classList.add("hidden");
  topBar.classList.remove("hidden");
  bottomNav.classList.remove("hidden");
});

// フォーム送信
addScoreForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const formData = {
    scoreNo: document.getElementById("scoreNo").value,
    title: document.getElementById("title").value,
    titleKana: document.getElementById("titleKana").value,
    titleEn: document.getElementById("titleEn").value,
    composer: document.getElementById("composer").value,
    artist: document.getElementById("artist").value,
    fiftySound: document.getElementById("fiftySound").value,
    alphabet: document.getElementById("alphabet").value,
    genre: document.getElementById("genre").value,
    arrangement: document.getElementById("arrangement").value,
    taskYear: document.getElementById("taskYear").value,
    memo: document.getElementById("memo").value
  };

  // バリデーション通過済みなので送信
  fetch("https://script.google.com/macros/s/AKfycby0TWNJHuU6iAKvC6t5pC0RblNxqSzh4aYW2L9NzgQzOqMtFzDtUE4eVr7AayXrcH0/exec", {
    method: "POST",
    body: JSON.stringify({ action: "addScore", data: formData }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.json())
  .then(res => {
    alert("追加完了");
    addScoreModal.classList.add("hidden");
    topBar.classList.remove("hidden");
    bottomNav.classList.remove("hidden");
    location.reload(); // 再読み込みで反映
  })
  .catch(err => alert("送信失敗: " + err));
});

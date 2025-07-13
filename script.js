
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

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwqUadxcvgCw3yoZLR2-U_VYmfcv1_jZA7lhs2P_SM3SF-niCNjDXS2c6C3zdWddBQ/exec';


function fetchScores() {
  const params = new URLSearchParams();
  params.append("mode", "getScores");

  fetch(GAS_URL, {
    method: "POST",
    body: params
  })
    .then(res => res.json())
    .then(data => {
      const formatted = data.scores.map(row => ({
        scoreNo: row["楽譜番号"] || "",
        title: row["曲名"] || "",
        titleEn: row["曲名（English）"] || "",
        titleKana: row["曲名（ふりがな）"] || "",
        composer: row["作曲者"] || "",
        artist: row["アーティスト"] || "",
        fiftySound: row["50音"] || "",
        alphabet: row["アルファベット"] || "",
        genre: row["ジャンル"] || "",
        arrangement: row["編成"] || "",
        taskYear: row["課題曲年"] || "",
        memo: row["備考"] || ""
      }));

      renderList(formatted);
    })
    .catch(err => {
      console.error("取得エラー:", err);
    });
}

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

function generateDetailBlock(label, value) {
  return `<p><strong>${label}：</strong> ${value || "-"}</p>`;
}


window.addEventListener("DOMContentLoaded", fetchScores);




// 楽器データ取得現在動作しません。
//fetch("https://script.google.com/macros/s/AKfycbzh-QqWa71HAgFGe4_68pK84PJOoKeGDECwt3U0sr825mLn9KA2Y0mgVFkGkctVKpE/exec?sheet=InstrumentDataBase")
//    .then(res => res.json())
 //   .then(data => allInstrumentData = data)
 //   .catch(err => alert("楽器データ取得エラー: " + err));

// 楽器データ取得（POST版）
const instrumentDataForm = new URLSearchParams();
instrumentDataForm.append("action", "getScoreData");
instrumentDataForm.append("sheet", "InstrumentDataBase");

fetch(GAS_URL, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: instrumentDataForm.toString()
})
  .then(res => res.json())
  .then(data => {
    allInstrumentData = data;
  })
  .catch(err => alert("楽器データ取得エラー: " + err.message));



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

function openAddScoreModal() {
  document.getElementById("addScoreModal").style.display = "block";

  // 自動採番処理（最大番号＋1）
  fetch(`${GAS_URL}?mode=getScoreList`)
    .then(res => res.json())
    .then(data => {
      const max = data.scores.reduce((max, row) => {
        const num = parseInt(row.scoreNumber);
        return (!isNaN(num) && num > max) ? num : max;
      }, 0);
      document.getElementById("scoreNumber").value = (max + 1).toString().padStart(5, '0');
    });
}

function closeAddScoreModal() {
  document.getElementById("addScoreModal").style.display = "none";
}

document.getElementById("scoreForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = e.target;

  if (!form.checkValidity()) {
    alert("入力内容を確認してください");
    return;
  }

  const formData = new FormData(form);
  const params = new URLSearchParams();
  params.append("mode", "addScore");
  for (const [key, val] of formData.entries()) {
    params.append(key, val);
  }

  fetch(GAS_URL, {
    method: "POST",
    body: params
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "score added") {
        alert("登録完了しました");
        closeAddScoreModal();
        form.reset();
      } else {
        alert("登録に失敗しました");
      }
    })
    .catch(err => {
      console.error(err);
      alert("通信エラー");
    });
});



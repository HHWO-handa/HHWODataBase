
// 共通要素取得
const scoreList = document.getElementById("scoreList");
const instrumentList = document.getElementById("instrumentList");

const repairList = document.getElementById("repairList");

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
let allRepairData = [];

const GAS_URL = 'https://script.google.com/macros/s/AKfycbyeck-PKgZX4bNpU9sfxiHozkShZQBfezA8tO9y6LC2ZTyDXij8_Jb9xAEUGAzOfBc/exec';


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
        scoreNo: row["scoreNumber"] || "",
        title: row["title"] || "",
        titleEn: row["titleEn"] || "",
        titleKana: row["titleKana"] || "",
        composer: row["composer"] || "",
        artist: row["artist"] || "",
        fiftySound: row["kanaIndex"] || "",
        alphabet: row["alphaIndex"] || "",
        genre: row["genre"] || "",
        arrangement: row["formation"] || "",
        taskYear: row["contestYear"] || "",
        memo: row["note"] || ""
      }));
console.log("取得データ:", data);
       allData = formatted; // 検索機能で使用するため保持
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


window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("scoreList").classList.remove("hidden");
  fetchScores();
  fetchInstruments();
});



function fetchInstruments() {
  const params = new URLSearchParams();
  params.append("mode", "getInstruments");

  fetch(GAS_URL, {
    method: "POST",
    body: params
  })
    .then(res => res.json())
    .then(data => {
      const formatted = data.scores.map(row => ({
        instrumentNo: row["instNumber"] || "",
        qr: row["QR"] || "",
        instrumentCode: row["instCode"] || "",
        instrumentName: row["instName"] || "",
        startDate: row["startDate"] || "",
        manufacturer: row["Maker"] || "",
        productName: row["ProductName"] || "",
        owner: row["owner"] || "",
        status: row["status"] || "",
        image: row["image"] || "",
        equipmentNo: row["EquipNumber"] || ""
      }));
console.log("取得データ:", data);
       allInstrumentData = formatted; // 検索機能で使用するため保持
      renderList(formatted);
    })
    .catch(err => {
      console.error("取得エラー:", err);
    });
}



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

function fetchRepairList() {
  const params = new URLSearchParams();
  params.append("mode", "getRepairList");

  fetch(GAS_URL, {
    method: "POST",
    body: params
  })
    .then(res => res.json())
    .then(data => {
      const formatted = data.repairs.map(row => {
        // 楽器番号から楽器名を取得
        const inst = allInstrumentData.find(i => i.instrumentNo === row["instrumentNo"]) || {};
        return {
          repairId: row["repairId"] || "",
          instrumentNo: row["instrumentNo"] || "",
          instrumentName: inst.instrumentName || "",
          repairDate: row["repairDate"] || "",
          qr: row["QR"] || "",
          status: row["status"] || "",
          instrumentCode: row["instrumentCode"] || "",
          inspectionItems: row["inspectionItems"] || "",
          repairContent: row["repairContent"] || "",
          repairPhoto: row["repairPhoto"] || "",
          completionDate: row["completionDate"] || ""
        };
      });

      console.log("修理リスト取得:", formatted);
      allRepairData = formatted; // 検索や詳細表示で使用
      renderRepairList(formatted);
    })
    .catch(err => {
      console.error("修理リスト取得エラー:", err);
    });
}

function renderRepairList(data) {
  const list = document.getElementById("repairList");
  list.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="instrument-left">
        <img src="${getInstrumentImage(item.instrumentNo)}" alt="画像">
        <div class="instrument-infoA">
          <span>${item.instrumentName}</span>
          <div class="instrument-infoB">
            <span>${item.status}</span>
          </div>
        </div>
      </div>
      <span>${item.repairDate}</span>
    `;
    li.addEventListener("click", () => showRepairDetail(item));
    Repairlist.appendChild(li);
  });
}


function getInstrumentImage(instrumentNo) {
  const inst = allInstrumentData.find(i => i.instrumentNo === instrumentNo);
  return inst ? inst.image : "";
}


function showRepairDetail(item) {
  const detailContent = document.getElementById("repairDetailContent");

  detailContent.innerHTML = `
    <div class="instrument-detail">
      <img src="${item.repairPhoto || getInstrumentImage(item.instrumentNo)}" alt="修理写真">
    </div>
    <h2>${item.instrumentName}</h2>
    ${generateDetailBlock("修理・点検ID", item.repairId)}
    ${generateDetailBlock("楽器番号", item.instrumentNo)}
    ${generateDetailBlock("楽器コード", item.instrumentCode)}
    ${generateDetailBlock("QRコード", item.qr)}
    ${generateDetailBlock("修理日", item.repairDate)}
    ${generateDetailBlock("ステータス", item.status)}
    ${generateDetailBlock("点検・修理項目", item.inspectionItems)}
    ${generateDetailBlock("修理内容", item.repairContent)}
    ${generateDetailBlock("完了提示日", item.completionDate)}
  `;

  document.getElementById("repairDetailModal").style.display = "block";
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
  Repairlist.classList.add("hidden");

  document.getElementById("searchInstrumentArea").classList.add("hidden");
});

btnInstrument.addEventListener("click", () => {
  pageTitle.textContent = "楽器一覧";
  scoreList.classList.add("hidden");
  instrumentList.classList.remove("hidden");
  Repairlist.classList.add("hidden");

  renderInstrumentList(allInstrumentData);
});

btnRepair.addEventListener("click", () => {
  pageTitle.textContent = "修理記録";
  scoreList.classList.add("hidden");
  instrumentList.classList.add("hidden");
  Repairlist.classList.remove("hidden");
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

  // Web内の allData から最大の楽譜番号を探す
  const max = allData.reduce((acc, item) => {
    const num = parseInt(item.scoreNo, 10);
    return (!isNaN(num) && num > acc) ? num : acc;
  }, 0);

  // 次の番号を5桁ゼロ埋めで設定
  const next = (max + 1).toString().padStart(5, '0');

  const input = document.getElementById("scoreNumber");
  input.value = next;
  input.readOnly = false; // 自由に編集できるようにする
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
        fetchScores();
      } else {
        alert("登録に失敗しました");
      }
    })
    .catch(err => {
      console.error(err);
      alert("通信エラー");
    });
});

//以下、楽器追加機能
//以下、楽器追加機能
function closeAddInstrumentModal() {
  document.getElementById("addScoreModal").style.display = "none";
}

// 自動入力ロジック
function openAddInstrumentModal() {
  document.getElementById("addInstrumentModal").style.display = "block";

  const cls = document.getElementById("instrClass");
  const mid = document.getElementById("instrMid");
  const end = document.getElementById("instrEnd");
  const qr = document.getElementById("instrQRCode");
  const today = new Date().toISOString().slice(0,10);
  document.getElementById("startDate").value = today;

  cls.addEventListener("change", () => {
    const c = cls.value;
    const filtered = allInstrumentData.filter(i => i.instrumentNo.startsWith(c));
    const mids = filtered.map(i => parseInt(i.instrumentNo.slice(1,3),10)||0);
    const largestMid = mids.length?Math.max(...mids):0;
    mid.value = String(largestMid+1).padStart(2,'0');

    const ends = filtered.map(i => parseInt(i.instrumentNo.slice(-3),10)||0);
    const largestEnd = ends.length?Math.max(...ends):0;
    end.value = String(largestEnd+1).padStart(3,'0');

    qr.value = c + mid.value + end.value + document.getElementById("instrCode").value;
  });
}

//新規システムじどうにゅうりょく
document.getElementById("part1").addEventListener("change", () => {
  const part1 = document.getElementById("part1").value;
  if (!part1) return;

  // 楽器データ（すでに fetch されているデータ）を使用
  const filtered = allInstrumentData.filter(item => item.instrumentNo && item.instrumentNo.startsWith(part1));

  // 最大の part2 を取得（2〜3桁目）
  let maxPart2 = 0;
  filtered.forEach(item => {
    const val = parseInt(item.instrumentNo.slice(1, 3));
    if (!isNaN(val)) maxPart2 = Math.max(maxPart2, val);
  });

  // 全体で最大の part3（下3桁）
  let maxPart3 = 0;
  allInstrumentData.forEach(item => {
    const val = parseInt(item.instrumentNo.slice(-3));
    if (!isNaN(val)) maxPart3 = Math.max(maxPart3, val);
  });

  // 自動入力（padStartで桁をそろえる）
  document.getElementById("part2").value = (maxPart2 + 1).toString().padStart(2, "0");
  document.getElementById("part3").value = (maxPart3 + 1).toString().padStart(3, "0");
});


// 画像撮影
document.getElementById("btnCaptureImage").addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    document.getElementById("cameraContainer").style.display = "block";
  } catch (err) {
    alert("カメラの起動に失敗しました: " + err.message);
  }
});


// フォーム送信
document.getElementById("instrumentForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  if (!f.checkValidity()) {alert("必須項目を入力してください");return;}
  const fd = new FormData(f);
  fd.append("mode","addInstrument");
  fd.append("imageData", previewImg.src);

  fetch(GAS_URL, { method:"POST", body:fd })
    .then(r=>r.json()).then(js=>{
      if(js.status==="ok"){ alert("登録OK");
        allInstrumentData.push(js.record);
        renderInstrumentList(allInstrumentData);
        f.reset();
        document.getElementById("addInstrumentModal").style.display="none";
      } else alert("登録失敗");})
    .catch(e=>alert(e));
});



const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const previewImg = document.getElementById("previewImg");
let stream;

// 撮影ボタン押下 → カメラ起動

// 写真を撮る
document.getElementById("takePhotoBtn").addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // DataURL 形式で画像データ取得
  const imageData = canvas.toDataURL("image/png");

  // プレビューに表示
  previewImg.src = imageData;
  previewImg.style.display = "block";

  // モーダル内を閉じる
  document.getElementById("cameraContainer").style.display = "none";

  // カメラ停止
  stream.getTracks().forEach(track => track.stop());
});

// カメラを閉じる
document.getElementById("closeCamera").addEventListener("click", () => {
  document.getElementById("cameraContainer").style.display = "none";
  if (stream) stream.getTracks().forEach(track => track.stop());
});




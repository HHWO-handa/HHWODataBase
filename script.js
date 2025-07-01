const qr = new Html5Qrcode("reader");
const startBtn = document.getElementById("startBtn");
const codeText = document.getElementById("codeText");

startBtn.addEventListener("click", () => {
    qr.start({ facingMode: "environment" }, { fps: 10, qrbox: 250 },
        qrCodeMessage => {
            console.log("読み取ったデータ:", qrCodeMessage);
            codeText.innerText = qrCodeMessage;

            // スプレッドシートに送信
            fetch('https://script.google.com/macros/s/AKfycbxKFyWH7q3l4fwF8RhTyin1XmLyH5hF-6BxPrKZBWxqZZGQdPjNuFmZaScPuG7glbU/exec', {
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

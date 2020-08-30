'use strict';
const calculateButton = document.getElementById('calc');
const resultDivided = document.getElementById('result-area');
const tweetDivided = document.getElementById('tweet-area');
const scoreTable = document.getElementById('score-table');
const winnerBonus = 20; // 勝ち点
const loserBonus = -10; // 負け点
let rates = [0,0,0,0];
let count = 1;

// 引数の要素の子要素をすべて削除する関数
function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
// 昇順でソートするための関数
function compareFunc(a, b) {
    return a - b;
}

// 計算ボタンを押したときの処理
calculateButton.onclick = () => {

    // プレイヤー名を受け取る
    const userNames = [];
    for(let i = 1; i <= 4; i++) {
        userNames.push(document.getElementById('user-name' + i).value);
        if (userNames[i-1] === '') { // プレイヤー名未入力で注意書きを出す
            alert('名前が未入力のプレイヤーがいます');
            return;
        }
    }

    // 半荘の点数を受け取る(文字列を数字に変換している)
    const gameScores = [];
    for(let i = 1; i <= 4; i++) {
        if (document.getElementById('score' + i + '-' + count).value === '') {
            alert('点数が未入力のプレイヤーがいます');
            return;
        }
        gameScores.push(Number(document.getElementById('score' + i + '-' + count).value));
    }

    // 点数の合計が合わないときにお知らせしてくれる
    let scoreSum = 0;
    for (let i = 0; i < 4; i++) {
        scoreSum += gameScores[i];
    }
    if (scoreSum !== 100000) {
        alert('点数の合計が正しくありません');
        return;
    }



    // 勝ち点、負け点の付与
    const winnerScore = Math.max(gameScores[0],gameScores[1],gameScores[2],gameScores[3]);
    const loserScore = Math.min(gameScores[0],gameScores[1],gameScores[2],gameScores[3]);
    let bonusScores = [0,0,0,0];
    for (let i = 0; i < 4; i++) {
        if (gameScores[i] === winnerScore) {
            bonusScores[i] += winnerBonus;
        }
        if (gameScores[i] === loserScore) {
            bonusScores[i] += loserBonus;
        }
    }

    // レートの合計を計算する
    let gameRates = [0, 0, 0, 0];
    for(let i = 1; i <= 4; i++) {
        gameRates[i-1] = (gameScores[i-1] - 30000) * 0.001 + bonusScores[i-1];
        rates[i-1] = rates[i-1] + gameRates[i-1];
    }

    // レートを結果表示エリアに表示
    removeAllChildren(resultDivided);
    for(let i = 0; i < 4; i++) {
        const playerRate = document.createElement('p');
        playerRate.innerText = userNames[i] + '    ' + rates[i];
        resultDivided.appendChild(playerRate);
    }


    // 表の行を新しく追加
    const newTableRow = scoreTable.insertRow(count+1);
    count++;
    for(let i = 0; i < 4; i++) {
        const newTableData = document.createElement('td');
        newTableRow.appendChild(newTableData);
        const newInput = document.createElement('input');
        const newInputId = 'score' + (i+1) + '-' + count;
        newInput.setAttribute('id', newInputId);
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('size', '20');
        newInput.setAttribute('maxlength', '6');
        newInput.setAttribute('placeholder', '点数');
        newTableData.appendChild(newInput);
    }

    // ツイートエリア
    // <a href="https://twitter.com/intent/tweet?button_hashtag=麻雀レート計算結果&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data-show-count="false">Tweet #今日の麻雀</a>
    // <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    removeAllChildren(tweetDivided);
    const tweetText = userNames[0] + 'さんのレートは' + rates[0].toFixed(1) + '\n'
                    + userNames[1] + 'さんのレートは' + rates[1].toFixed(1) + '\n'
                    + userNames[2] + 'さんのレートは' + rates[2].toFixed(1) + '\n'
                    + userNames[3] + 'さんのレートは' + rates[3].toFixed(1) + ' でした。' + '\n';
    const anchor = document.createElement('a');
    const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag='
        + encodeURIComponent('今日の麻雀')
        + '&ref_src=twsrc%5Etfw';
    anchor.setAttribute('href', hrefValue);
    //anchor.className = 'twitter-hashtag-button';
    anchor.setAttribute('class', 'twitter-hashtag-button');
    anchor.setAttribute('data-text', tweetText);
    anchor.setAttribute('data-show-count', 'false');
    anchor.innerText = 'Tweet #今日の麻雀';
    tweetDivided.appendChild(anchor);

    // widgets.js 
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    tweetDivided.appendChild(script);
};
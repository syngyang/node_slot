// 1. 기본금 적립 입력
// 2. 베팅라인 수 결정 입력
// 3. 베팅금액 결정(라인 당) 입력
// 4. Math.random()으로 reel 당 이미지 축출
// 5. user 의 승리 여부 판단

const prompt = require("prompt-sync")({sigint: true});

const ROWS = 3;
const COLS = 3;

const SYMBOL_COUNTS = {
    A: 2,
    B: 4,
    C: 6,
    D: 8,
}
// 심볼의 종류에 따라서 차등 곱으로 배팅금액을 지급
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
}

const deposit = () => {
  while (true) {
    const depositAmount = prompt("Enter a deposit amount:  ");
    const numberDepositAmount = parseFloat(depositAmount);

    if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
      console.log("Invalid deposit amount, try again.");
    } else {
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = ()=> {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3):  ")
        const numberOfLines = parseInt(lines)

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid number of lines, try again.")
        } else {
            return numberOfLines;
        }
    }
}

const getBet = (balance, lines)=> {
    while (true) {
        const bet = prompt("Enter the bet per line:  ")
        const numberOfBet = parseFloat(bet)

        if (isNaN(numberOfBet) || numberOfBet <= 0 || numberOfBet > (balance / lines)) {
            console.log("Invalid bet, try again.")
        } else {
            return numberOfBet;
        }
    }
}

const spin = ()=> {
    // 심볼은 SYMBOLS_COUNT에 있는 KEY별로 VALUE인 갯수 만큼 symbols라는 어레이에 넣어서 풀을 만든다.
    const symbols = []
    for (const [ symbol, count] of Object.entries(SYMBOL_COUNTS)){
        for (let i = 0; i < count ; i++) {
            symbols.push(symbol)
        }
        // console.log(symbol, count)
        // console.log(symbols)
    }
    // console.log(symbols)
    
    // const reels = [[],[],[]];
    // for (let i= 0; i<COLS; i++){
    // 위의 경우는 reels 의 갯수 즉 COLS의 변화에 대응을 못하여 아래 처럼 함 
    const reels = [];
    for (let i= 0; i<COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random()*reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex]
            reels[i].push(selectedSymbol)
            // 한번 선택 된 것은 풀에서 제외 시킴
            const selected = reelSymbols.splice(randomIndex, 1)
            // console.log(selected)
        }
    }
    // console.log("reels ",reels)
    return reels;
}

// transposing a matrix 
// reels: [ [ 'B', 'D', 'C' ], [ 'D', 'C', 'B' ], [ 'B', 'D', 'B' ] ]를 아래 처럼
// [ [ 'B', 'D', 'B' ], [ 'D', 'C', 'D' ], [ 'C', 'B', 'B' ] ] 처럼
const transpose = (reels)=> {
    const rows = []
    for (let i=0; i< ROWS; i++){
        rows.push([]);
        for (let j=0; j< COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows)=> {
   
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i !=row.length -1) {
                rowString += " | "
            }
        }
        console.log(rowString)
       
    }
}

const getWinnings = ( rows, bet, lines)=> {
    let winnings = 0;

    for (let row= 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (let symbol of symbols){
            if (symbol !=symbols[0]){
                allSame = false;
                break;
            }
        }
        if (allSame){
            winnings += bet*SYMBOL_VALUES[symbols[0]]
        }

    }
    return winnings;
}


const game = ()=> {
    let balance = deposit();

    while (true){
        console.log(` You have a balance of $${balance}.`)
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines)
        // console.log('numberOfLines: ', numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin()
        const rows = transpose(reels)
        console.log('reels: ', reels);
        console.log('rows: ', rows);
        printRows(rows)

        const winnings = getWinnings(rows, bet, numberOfLines)
        balance += winnings;
        console.log(`You win $${winnings.toString()}.`)

        if (balance <=0){
            console.log("You run out of money!!")
            console.log("다시 만나길 기대합니다.")
            console.log("")
            break;
        }

        const playAgain = prompt("게임을 다시 하겠습니까? (y/n) ")
        if (playAgain !="y") {
            console.log("")
            console.log(`You have the remain balance $${balance}`)
            console.log("")
            console.log("다시 만나길 기대합니다.")
            console.log("")
            break;
        }
    }
    

}
game()
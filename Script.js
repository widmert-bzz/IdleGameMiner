const minerFlex = document.getElementById('MinerFlex');
const addButton = document.getElementById('AddButton');

const startPriceAddMiner = 30;
const startPriceUpgrade = 5;

const multiUpgradePriceInput = 1.3;
const multiMPSInput = 1.2;


let balance = 0;
let MoneyPerTimeUnit = 0;
let minerList = [];


//Input Values
let upgradePriceInput = startPriceUpgrade;
let MoneyPerSecondInput =1;

let priceForNewMiner = 0;

//AddMiner Button Setup
const newMinerButton = document.createElement("button");
newMinerButton.textContent = "Free";
newMinerButton.className = "text bold"
newMinerButton.id = "newMinerButton"
newMinerButton.onclick = function () {
    createNewMiner();
};

function createNewMiner(LevelInput = 1, isFree = false) {
    if (balance >= priceForNewMiner || isFree) {
        if (!isFree) {
            balance -= priceForNewMiner;
        }
        if (priceForNewMiner !== 0) {
            priceForNewMiner = priceForNewMiner * 3;
        } else {
            priceForNewMiner += startPriceAddMiner;
        }

        let cost = String(priceForNewMiner);
        if (cost.length >= 5) {
            cost = cost.replace(/(\d)(?=(\d{3})+$)/g, '$1\'');
        }
        newMinerButton.textContent = cost + "$"

        //Add new Miner
        minerList.push(new Miner(minerList.length + 1, upgradePriceInput, MoneyPerSecondInput, LevelInput))
        upgradePriceInput = Math.round(upgradePriceInput * multiUpgradePriceInput);
        MoneyPerSecondInput = MoneyPerSecondInput * multiMPSInput;
    }
}

addButton.append(newMinerButton);

const moneyText = document.getElementById('Balance');
UpdateBalance();

setInterval(UpdateBalance, 100)

openData(true)
document.getElementById("settings").style.visibility='hidden';

function UpdateBalance() {
    balance += MoneyPerTimeUnit;
    UpdateBalanceText()
}

function UpdateBalanceText() {
    let displayBalance = String(Math.floor(balance));
    if (displayBalance.length >= 5) {
        displayBalance = displayBalance.replace(/(\d)(?=(\d{3})+$)/g, '$1\'');
    }
    moneyText.textContent = "Balance: " + String(displayBalance) + "$"
}

function AddMoneyPerTimeUnit(amount) {
    MoneyPerTimeUnit += (amount * 0.1);
}

function updateAllPrices(int) {
    for (let i = 0; i < minerList.length; i++) {
        minerList[i].updateUpgradeCost(int)
    }
}

function saveData() {
    document.cookie = "balance=" + Math.floor(balance) + "; expires=Thu, 18 Dec 2023 12:00:00 UTC"
    document.cookie = "amountOfMiners=" + minerList.length + "; expires=Thu, 18 Dec 2023 12:00:00 UTC"

    for (let i = 0; i < minerList.length; i++) {
        document.cookie = "Miner" + i + "=" + minerList[i].level + "; expires=Thu, 18 Dec 2023 12:00:00 UTC"
    }
}

function openData(isAutostart = false) {
    if (!isAutostart) {
        document.location.reload()
    }
    let cookie = document.cookie.split("; ")
    if (cookie.length > 2) {
        balance = getValueOfCookie(cookie, "balance");
        for (let i = 0; i < getValueOfCookie(cookie, "amountOfMiners"); i++) {
            createNewMiner(getValueOfCookie(cookie, "Miner" + i), true)
        }
    } else {
        balance = Number(0)
    }

}

function getValueOfCookie(list, name) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].indexOf(name) === 0) {
            return Number(list[i].split("=").pop());
        }
    }
}

function deleteCookieData() {
    deleteAllElements()
    document.cookie = "balance=; expires=Thu, 18 Dec 2000 12:00:00 UTC"
    document.cookie = "amountOfMiners=; expires=Thu, 18 Dec 2000 12:00:00 UTC"
    for (let i = 0; i < 1000; i++) {
        document.cookie = "Miner" + i + "=; expires=Thu, 18 Dec 2000 12:00:00 UTC"
    }
    document.location.reload()
}

function deleteAllElements() {
    const elements = document.querySelectorAll('.delete');
    elements.forEach(element => {
        element.remove();
    });
    balance = 0
    MoneyPerTimeUnit = 0
    minerList = []
    priceForNewMiner = upgradePriceInput
}
function openSettings(){
    document.getElementById("settings").style.visibility='visible';
    document.getElementById("confirmChoice").style.visibility='hidden';

}
function closeSettings(){
    document.getElementById("settings").style.visibility='hidden';
    document.getElementById("confirmChoice").style.visibility='hidden'

}
function confirmDelete(){
    document.getElementById("confirmChoice").style.visibility='visible'
}
function cancelDelete(){
    document.getElementById("confirmChoice").style.visibility='hidden'
}


let upgradePriceMulti = 1.2;


class Miner {

    constructor(numberInput, priceInput, moneyPerSecond, levelInput = 1) {
        this.level = 0;
        this.upgradePrice = priceInput;
        this.number = numberInput;
        this.moneyPerSecond = moneyPerSecond;
        this.currentIconIndex = 0;
        AddMoneyPerTimeUnit(this.moneyPerSecond);

        this.createContainerElements()

        this.importIcons()
        this.createButton()

        this.minerContainer.append(this.minerName, this.minerLevel, this.upgradeButton, this.minerMPS, this.currentIcon);

        this.updateMinerMPSDisplay()


        for (let i = 0; i < levelInput; i++) {
            this.upgradeMiner(true, true)
        }
    }

    createContainerElements() {
        this.minerContainer = document.createElement('MinerContainer');
        this.minerContainer.className = "container delete"
        minerFlex.append(this.minerContainer)

        this.minerName = document.createElement("minerName");
        this.minerName.innerHTML = "Miner " + this.number;
        this.minerName.className = "name text bold delete"

        this.minerMPS = document.createElement("minerMPS");
        this.minerMPS.innerHTML = "0/s"
        this.minerMPS.className = "MPS text delete"

        this.minerLevel = document.createElement("minerLevel");
        this.minerLevel.innerHTML = String(this.level);
        this.minerLevel.className = "level text delete"
    }

    importIcons() {
        this.sourceList = ["Images/PC1.png", "Images/PC2.png", "Images/PC3.png", "Images/PC4.png", "Images/PC5.png", "Images/PC6.png"]
        this.currentIcon = document.createElement("img")
        this.currentIcon.src = this.sourceList[0];
        this.currentIcon.className = "icon"
    }

    upgradeMiner(isFree = false, forceMulti = false) {

        let currentMulti = 1;
        if (!forceMulti) {
            currentMulti = this.multi
        }

        let price = this.getUpgradeCost()
        if ((balance >= price && currentMulti + this.level <= 100) || isFree) {
            if (!isFree) {
                balance -= Math.round(price);
            }
            for (let i = 0; i < currentMulti; i++) {
                this.level += 1;
                this.upgradePrice = (this.upgradePrice * upgradePriceMulti) + 1;
                this.updateUpgradeCost();

                switch (this.level) {
                    case 10:
                    case 25:
                    case 50:
                    case 75:
                        this.upgradeIconsAndMPS(1.5)
                        break;
                    case 100:
                        this.upgradeIconsAndMPS(2)
                        break;
                    default:
                        this.upgradeIconsAndMPS(1.15, false)
                }
            }
            this.minerLevel.textContent = String(this.level);
        }
        this.updateMinerMPSDisplay()
    }

    createButton() {
        this.upgradeButton = document.createElement("button");
        this.upgradeButton.innerHTML = "$" + this.upgradePrice;
        this.upgradeButton.classList.add("upgrade")
        this.upgradeButton.classList.add("delete")
        this.upgradeButton.onclick = () => {
            this.upgradeMiner()
        }
    }

    upgradeIconsAndMPS(multi, switchPicture = true) {
        if (switchPicture) {
            this.currentIconIndex += 1;
            setTimeout(() => {
                this.currentIcon.src = this.sourceList[this.currentIconIndex]
            }, 200);
        }

        AddMoneyPerTimeUnit(this.moneyPerSecond * (multi - 1))
        this.moneyPerSecond = this.moneyPerSecond * multi;
    }

    getUpgradeCost(InputMulti = this.multi) {
        let value = 0;
        for (let i = 0; i < InputMulti; i++) {
            value += Math.round(this.upgradePrice * (upgradePriceMulti ** i))
        }
        return value;
    }

    updateUpgradeCost(InputMulti) {
        let cost = String(this.getUpgradeCost(InputMulti));
        if (cost.length >= 5) {
            cost = cost.replace(/(\d)(?=(\d{3})+$)/g, '$1\'');
        }
        this.upgradeButton.textContent = "$" + cost
    }

    updateMinerMPSDisplay() {
        this.minerMPS.textContent = String(Math.round(this.moneyPerSecond * 10) / 10) + "/s";
    }

    get multi() {
        let multi;
        if (document.getElementById("1x").checked) {
            multi = 1
        } else if (document.getElementById("5x").checked) {
            multi = 5
        } else if (document.getElementById("10x").checked) {
            multi = 10
        }
        return multi
    }
}

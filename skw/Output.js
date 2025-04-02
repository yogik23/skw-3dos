const Table = require('cli-table3');
const chalk = require('chalk').default;

class Output {
    constructor() {
        this.table = new Table({
            head: [
                chalk.hex('#C0C0C0')('Status Klaim'),
                chalk.hex('#C0C0C0')('Email'),
                chalk.hex('#C0C0C0')('Earnings'),
                chalk.hex('#C0C0C0')('Ping Status')
            ],
            colWidths: [15, 30, 15, 15],
            style: {
                head: ['cyan'],
                border: ['gray'],
                'padding-left': 1,
                'padding-right': 1
            }
        });
    }

    updateRow(email, statusClaim, earnings, pingStatus) {
        let rowIndex = this.table.findIndex(row => row[1] === email);

        if (rowIndex !== -1) {
            this.table[rowIndex] = [
                statusClaim === 'Sukses' ? chalk.green('✔ Sukses') : chalk.red('❌ Gagal'),
                chalk.hex('#00FFFF')(email),
                chalk.hex('#F0E68C')(earnings),
                chalk.hex('#DC143C')(pingStatus)
            ];
        } else {
            this.table.push([
                statusClaim === 'Sukses' ? chalk.green('✔ Sukses') : chalk.red('❌ Gagal'),
                chalk.hex('#00FFFF')(email),
                chalk.hex('#F0E68C')(earnings),
                chalk.hex('#DC143C')(pingStatus)
            ]);
        }
    }

    printTable() {
        console.clear();
        console.log(this.table.toString());
    }

    clearTable() {
        this.table.length = 0;
    }
}


module.exports = Output;

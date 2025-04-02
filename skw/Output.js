const Table = require('cli-table3');
const chalk = require('chalk').default;

class Output {
    constructor() {
        this.table = new Table({
            head: [chalk.blue('Email'), chalk.green('Daily Claim'), chalk.yellow("Today's Earnings"), chalk.cyan('Ping Status')],
            colWidths: [30, 20, 20, 15]
        });

        this.data = {};
        console.clear();
        console.log(this.table.toString());
    }

    updateRow(email, field, value) {
        if (!this.data[email]) {
            this.data[email] = { email, dailyClaim: "-", earnings: "-", pingStatus: "-" };
        }

        this.data[email][field] = value;

        this.table = new Table({
            head: [chalk.blue('Email'), chalk.green('Daily Claim'), chalk.yellow("Today's Earnings"), chalk.cyan('Ping Status')],
            colWidths: [30, 20, 20, 15]
        });

        Object.values(this.data).forEach(row => {
            this.table.push([row.email, row.dailyClaim, row.earnings, row.pingStatus]);
        });

        console.clear();
        console.log(this.table.toString());
    }
}

module.exports = Output;

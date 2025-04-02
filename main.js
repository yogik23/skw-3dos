const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk').default;
const Table = require('cli-table3');
const ora = require('ora');
const userAgents = require('./skw/userAgents');
const Output = require('./skw/Output');
const outputTable = new Output();

const API_dan_Bearer = 'data.txt';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getRandomUserAgent = () => {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const spinner = ora({
  color: "cyan",
});

async function spinnerCD(seconds) {
    const spinner = ora().start();

    return new Promise((resolve) => {
        let countdown = seconds;
        const countdownInterval = setInterval(() => {
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                spinner.succeed();
                resolve();
            } else {
                spinner.text = chalk.cyan(`${countdown} detik...`);
                countdown--;
            }
        }, 1000);
    });
}

async function getprofile(bearerToken) {
    const url = `https://api.dashboard.3dos.io/api/profile/me`;
    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': getRandomUserAgent(),
                'Accept': '*/*',
                'Origin': 'chrome-extension://lpindahibbkakkdjifonckbhopdoaooe',
            }
        });

        const email = response.data?.data?.email || "Email not found";
        return email;
    } catch (error) {
        console.error(chalk.red("Error fetching email:"), error.response?.data || error.message);
        return null;
    }
}

async function daily(bearerToken) {
    const url = `https://api.dashboard.3dos.io/api/claim-reward`;
    try {
        const response = await axios.post(url, { id: "daily-reward-api" }, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': getRandomUserAgent(),
                'Accept': '*/*',
                'Origin': 'chrome-extension://lpindahibbkakkdjifonckbhopdoaooe',
            }
        });

        if (response.data?.flag === true) {
            return 'Success';
        } else {
            return 'Error';
        }

    } catch (error) {
        return 'Sudah Claim';
    }
}

async function ping(apiSecret, bearerToken) {
    const url = `https://api.dashboard.3dos.io/api/profile/api/${apiSecret}`;
    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'User-Agent': getRandomUserAgent(),
                'Accept': '*/*',
                'Origin': 'chrome-extension://lpindahibbkakkdjifonckbhopdoaooe',
            }
        });

        if (response.data?.status === "Success") {
            const earnings = response.data?.data?.todays_earning ?? "0";
            return { earnings, status: "Success" };
        } else {
            return { earnings: 0, status: "Error" };
        }
    } catch (error) {
        return { earnings: 0, status: "Error" };
    }
}

async function startBot() {
    console.clear();
    try {
        const apiSecretsAndTokens = fs.readFileSync(API_dan_Bearer, 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);

        if (apiSecretsAndTokens.length === 0) {
            return;
        }

        outputTable.clearTable();

        for (const line of apiSecretsAndTokens) {
            spinner.start();
            const [apiSecret, bearerToken] = line.split(':').map(item => item.trim());
            if (!apiSecret || !bearerToken) {
                continue;
            }

            const email = await getprofile(bearerToken);
            await delay(1000);
            const dailyClaimStatus = await daily(bearerToken);
            await delay(1000);
            const { earnings, status } = await ping(apiSecret, bearerToken);
            await delay(1000);
            spinner.succeed();

            outputTable.updateRow(email, dailyClaimStatus, earnings, status);
            outputTable.printTable();

        }

    } catch (error) {
        spinner.fail();
        console.error('Error:', error.message);
    }
}

async function main() {
    try {
        while (true) {
            await startBot();
            await spinnerCD(30);
        }
    } catch (error) {
        console.error('Error in main loop:', error.message);
    }
}

main();

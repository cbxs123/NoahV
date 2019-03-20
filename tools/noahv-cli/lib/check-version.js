/**
 * NoahV-Cli
 * Copyright (c) 2019 Baidu, Inc. All Rights Reserved.
 *
 * @file check version
 * @author darren(darrenywyu@gmail.com)
 */

const request = require('request');
const semver = require('semver');
const chalk = require('chalk');
const inquirer = require('inquirer');
const packageConfig = require('../package.json');

module.exports = done => {
    // Ensure minimum supported node version is used
    if (!semver.satisfies(process.version, packageConfig.engines.node)) {
        return console.log(chalk.red(
            '  You must upgrade node to >=' + packageConfig.engines.node + '.x to use noahv-cli'
        ));
    }

    request({
        url: 'https://registry.npmjs.com/package/noahv-cli',
        timeout: 10000
    }, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            const latestVersion = JSON.parse(body)['dist-tags'].latest;
            const localVersion = packageConfig.version;
            if (semver.lt(localVersion, latestVersion)) {
                console.log(chalk.yellow('  A newer version of noahv-cli is available.'));
                console.log();
                console.log('  latest:    ' + chalk.green(latestVersion));
                console.log('  installed: ' + chalk.red(localVersion));
                console.log();
                inquirer.prompt([
                    {
                        type: 'input',
                        message: 'upgrade noahv-cli? [yn]' + '\n',
                        name: 'type',
                        default: 'y'
                    }
                ]).then(function (answers) {
                    if (answers.type === 'y') {
                        require('./upgrade')();
                        done();
                    }
                    else {
                        done();
                    }
                });
            }
            else {
                done();
            }
        }
        else {
            done();
        }
    });
};

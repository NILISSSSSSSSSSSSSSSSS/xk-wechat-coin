const gulp = require('gulp');
const scp = require('gulp-scp2');
const ssh = require('gulp-ssh');
const zip = require('gulp-zip');
const fs = require('fs');
const minimist = require('minimist');
const gulpSequence = require('gulp-sequence');
const moment = require('moment');
const path = require('path');
const os = require('os');


const remotePath = "/data/web"; // 生产zip资源路径
const remotePathTest = "/data/web/test";  //test zip资源路径
const remotePathBeta = "/opt/nginx/test";  //beta zip资源路径
const remotePathDev = "/data/web/dev";  //dev zip资源路径
const resourcesName = "resources"; //zip资源文件夹名称
const fileName = "coin"; // 需要发布的文件名
let rasPth = "/Users/qiuzhaojun/Documents/project/serviceKey/id_rsa";  //私钥路径
if(os.type() === 'Windows_NT'){
    rasPth = "C:/Users/Administrator/.ssh_net/id_rsa";  //预发布环境
}

const fullName = `${fileName}${moment().format('YYYYMMDDHHmmss')}.zip`; // zip文件全称
const sshConfig = {
    dev: {
        host: '192.168.2.218',
        username: 'root',
        password: '123',
        dest: remotePathDev,
        port: '22'
    },
    test: {
        host: '192.168.2.218',
        username: 'root',
        password: '123',
        dest: remotePathTest,
        port: '22'
    },
    beta: {
        host: '39.104.149.243',
        username: 'root',
        dest: remotePathBeta,
        privateKey: fs.readFileSync(rasPth),
        port: '9822'
    },
    production: {
        host: '47.99.236.207',
        username: 'root',
        password: 'scxkkj123#',
        dest: remotePath,
        port: '9822'
    }
}

const knownOptions = [
    {
        string: 'env',
        default: {env: 'dev'}
    }
];
const options = minimist(process.argv.slice(2), knownOptions);
let service = null;

gulp.task('deploy', () => {
    service = sshConfig[options.env];
    if (service) {
        // shell.task(['rm -rf dist']);
        gulpSequence('zip', 'resources', 'shell', function () {

        });
    } else {
        console.error('发布失败！！！，未指定资源服务器')
    }
})


gulp.task('zip', () => {
    let zipStream = gulp.src('dist/**/*')
        .pipe(zip(fullName))
        .pipe(gulp.dest('dist_zip'))
        .on('error', (err) => {
            console.log('资源压缩ZIP失败', err)
        })
    return zipStream
})

gulp.task('resources', ['zip'], () => {
    service.destination = service.dest;
    service.dest = `${service.dest}/${resourcesName}/${fileName}`;
    let upStream = gulp.src(`dist_zip/${fullName}`)
        .pipe(scp({
            ...service,
            watch: function(client) {
                client.on('write', function(o) {
                    console.log('write %s', o.destination);
                });
            }
        }))
        .on('error', (err) => {
            console.log('资源上传失败', err);
        });
    return upStream
})

gulp.task('shell', () => {
    const gulpSSH = new ssh({
        ignoreErrors: false,
        sshConfig: service
    })
    const commands = [`cd ${service.destination}/${fileName} && rm -rf ./* && cd ${service.dest} && unzip -o -d ${service.destination}/${fileName} ${fullName} && chmod 755 -R ${service.destination}/${fileName}/*`];
    gulpSSH.shell(commands)
})

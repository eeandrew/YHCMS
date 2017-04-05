'use strict'
const fs = require('fs');
const path = require('path');
const http = require('http');
const ttf2woff = require('ttf2woff2');
const svgicons2svgfont = require('svgicons2svgfont');
const parseString = require('xml2js').parseString;
const TTFStream = require('./utils/svg2ttfstream');
const writeFile = require('./utils/writeFile');
const Unicode = require('./utils/Unicode');
const removeDir = require('./utils/removeDir');

// 基础unicode
let current_code = 1000;
const message = {
    success: {
        result: true
    },
    failure: {
        result: false
    }
}

/**
 * [入口文件]
 * @param  {[type]} options [{baseDir __引用path, cssDir __生成css path, iconName __图标前缀名称}]
 * @return {[type]}         [null]
 */
module.exports = function(options, cb) {
    console.time('pass time');
    if (!options.baseDir) {
        console.log('require baseDir');
        return;
    }
    if (!options.svgDir) {
        console.log('require svgDir');
        return;
    }
    if (!options.iconName || options.iconName === '') {
        console.log('require iconName');
        return;
    }
    if (!options.modulePath || options.modulePath === '') {
        console.log('require modulePath');
        return;
    }
    // css模板文件path
    const cssFilePath = path.join(options.modulePath, 'tmplete', 'base.css');
    const fontDir = path.join(options.baseDir, 'fonts');
    const cssDir = path.join(options.baseDir, 'css');
    const baseDir = path.join(options.baseDir, options.svgDir);
    if (!fs.existsSync(baseDir)) {
        console.log('vgDir not exits');
        return;
    }
    if (!fs.existsSync(fontDir)) {
        fs.mkdirSync(fontDir);
    }
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir);
    }
    const svgFilePath = path.join(fontDir, 'Glyphter.svg');
    const ttfFilePath = path.join(fontDir, 'Glyphter.ttf');
    const targetCssPath = path.join(cssDir, 'Glyphter.css');
    const baseDirs = [];
    fs.readdirSync(baseDir, 'utf8').map((dir) => {
        if (/.\.svg$/.test(dir)) {
            baseDirs.push({
                path: path.join(baseDir, dir),
                name: dir.split('.')[0]
            });
        }
    });
    // create a svg_multiple stream
    const svgStream = svgicons2svgfont({fontName: 'svgFont', normalize: true});
    // 将管道定向到 svgFilePath
    svgStream.pipe(fs.createWriteStream(svgFilePath));
    baseDirs.map((key) => {
        const glyph = fs.createReadStream(key.path);
        // 设置生成的svg文件的unicode以及glyph-name
        glyph.metadata = {
            unicode: [String.fromCharCode(current_code++)],
            name: key.name
        };
        // 当前流的写入会定向到svgFilePath的写入流，最终在fonts目录生成svg合并后的文件
        svgStream.write(glyph);
    });
    console.log('Glyphter.svg created.  path:' + svgFilePath);

    // 再将svg流定向到生成ttf文件的可写流中
    const ttfStream = svgStream.pipe(new TTFStream({fp: ttfFilePath}));
    ttfStream.on('svgsuccess', function(data) {
        console.log('Glyphter.ttf created.  path:' + ttfFilePath);
        var ttfcontent = new Uint8Array(data);
        var woffcontent = new Buffer(ttf2woff(ttfcontent).buffer);
        const woffbase64 = new Buffer(ttfcontent, 'binary').toString('base64');
        const ttfbase64 = new Buffer(woffcontent, 'binary').toString('base64');
        fs.readFile(svgFilePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('svg' + err);
            }
            parseString(data, (err, res) => {
                if (err) {
                    console.error('parse' + err);
                    cb(message.failure);
                }
                fs.readFile(cssFilePath, 'utf-8', (err, data) => {
                    if (err) {
                        console.error('css' + err);
                    }
                    let css = data;
                    css = css.replace('_woff', woffbase64).replace('_ttf', ttfbase64).replace('_icon', options.iconName);
                    res.svg.defs[0].font[0].glyph.map((key, index) => {
                        const name = key.$['glyph-name'];
                        const css_before = `.${options.iconName}-${name}:before{content:'${Unicode.stringify(key.$.unicode)}';}\n`;
                        css += css_before;
                    });
                    writeFile(targetCssPath, css, 'utf-8', function(err) {
                        console.log('Glyphter.css created.  path:' + targetCssPath);
                        removeDir(fontDir);
                        console.log('Glyphter.svg removed.  path:' + svgFilePath);
                        console.log('Glyphter.ttf removed.  path:' + ttfFilePath);
                        console.timeEnd('pass time');
                        message.success.path = targetCssPath;
                        message.success.name = (new Date()).getTime() + '.css';
                        cb(message.success);
                    });
                });
            });
        })
    });
    svgStream.end();
}

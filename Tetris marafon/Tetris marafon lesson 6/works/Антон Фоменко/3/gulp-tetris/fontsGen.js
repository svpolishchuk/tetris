import fs from "fs";
import path from "path";

// Функція для генерації правил @font-face
function generateFontFace(fontName, fontPath, fontWeight) {
    return `@font-face {
    font-family: '${fontName}';
    src: url('${fontPath}.woff2') format('woff2'), 
         url('${fontPath}.woff') format('woff'),
         url('${fontPath}.ttf') format('truetype');
    font-weight: ${fontWeight};
    font-style: normal;
}`;
}

// Директорія, в якій знаходяться ваші шрифти
const fontsDir = './src/fonts/';
const fontBuildDir = "./../fonts/";
let fontsInSCSS = new Set();

// Зчитуємо список файлів у директорії шрифтів
fs.readdir(fontsDir, (err, files) => {
    if (err) {
        console.error('Failed to read fonts directory:', err);
        return;
    }

    // Генеруємо CSS правила @font-face для кожного файлу шрифта
    const fontFaceRules = files.map(file => {
        const fontName = path.basename(file, path.extname(file));
        const fontNameArr = fontName.split("-");
        let fontWeight =  fontNameArr[fontNameArr.length - 1];
        switch (fontWeight) {
            case "Thin": fontWeight = 100;
                break;
            case "ExtraLight": fontWeight = 200;
                break;
            case "Light": fontWeight = 300;
                break;
            case "SemiLight": fontWeight = 350;
                break;
            case "Medium": fontWeight = 500;
                break;
            case "SemiBold": fontWeight = 600;
                break;
            case "Bold": fontWeight = 700;
                break;
            case "ExtraBold": fontWeight = 800;
                break;
            case "Black": fontWeight = 900;
                break;
            case "ExtraBlack": fontWeight = 950;
                break;
            default: fontWeight = 400;
                break;
        }
        const fontPath = path.join(fontBuildDir, fontName).replace(/\\/g, '/');
        
        if ( fontsInSCSS.has(fontName) ) {
            return;
        } else {
            fontsInSCSS.add(fontName);
            return generateFontFace(fontName, fontPath, fontWeight);
        }
    });

    // Записуємо згенеровані правила у файл fonts.css
    fs.writeFile('./src/scss/base/_fonts.scss', fontFaceRules.join('\n'), err => {
        if (err) {
            console.error('Failed to write CSS file:', err);
            return;
        }
        console.log('Font CSS file generated successfully!');
    });
});
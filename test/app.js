const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/update-server-property', (req, res) => {
  const property = req.body.property;
  const value = req.body.value;

  // server.properties ファイルのパス
  const propertiesFilePath = path.join(__dirname, 'server.properties');

  // ファイルを同期的に読み取り
  let properties = {};
  try {
    const data = fs.readFileSync(propertiesFilePath, 'utf8');
    properties = parseProperties(data);

    // 指定されたプロパティの値を設定
    properties[property] = value;

    // オブジェクトを文字列に変換
    const newPropertiesString = stringifyProperties(properties);

    // ファイルを同期的に書き込み
    fs.writeFileSync(propertiesFilePath, newPropertiesString, 'utf8');

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ success: false, error: 'Error updating property' });
  }
});

// server.properties ファイルの内容をオブジェクトに変換する関数
function parseProperties(data) {
  const properties = {};
  const lines = data.split('\n');
  for (const line of lines) {
    const parts = line.split('=');
    if (parts.length === 2) {
      properties[parts[0].trim()] = parts[1].trim();
    }
  }
  return properties;
}

// オブジェクトを server.properties ファイルの形式に変換する関数
function stringifyProperties(properties) {
  let result = '';
  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      result += `${key}=${properties[key]}\n`;
    }
  }
  return result;
}

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

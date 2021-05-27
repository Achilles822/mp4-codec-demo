# React 应用判断mp4文件是h264、h265编码的方法

日常开发中，遇到一个需求是视频文件上传之前，判断用户选择的 mp4 文件编码格式，若不是期望的编码，则不予上传。分析一下，这是一个比较 basic 的需求，我们只需要获取到视频文件的 MINE 信息，就可以判断视频编码。由于网上没有比较完整的文章，所以著文分享。

### 依赖

我们会使用到**mp4box**这个工具库。首先安装它：

```
yarn add mp4box
```

如果你使用**Typescript**，请参考[Typescript Support](https://github.com/gpac/mp4box.js/issues/233)添加声明。

接着引入库和声明一个 FileReader 用于协助读取文件

```
import MP4Box from 'mp4box'
var reader: FileReader = new FileReader()
```

创建 Input 和处理 onChange，这里我们使用HTML5的accept属性限制只能选择mp4格式的文件。

```
 <Input type="file" onChange={onFileSelected} accept="video/mp4"></Input>
```

```
const onFileSelected = (e: any) => {
    reader.readAsArrayBuffer(e.target.files[0]);
  }
```

接着通过 FileReader 的 loadend 事件进行后续处理，这里记得要回收reader变量。

```
useEffect(() => {
   reader.addEventListene  ('loadend', function () {
     let result: any = reader.result;
     result.fileStart = 0;
     let mp4boxfile = MP4Box.createFile()
     mp4boxfile.onReady = mp4Parsed
     mp4boxfile.appendBuffer(result);
   });
   return () => {
     (reader as any) = null
   }
}, [])
```
获取到文件后，解析文件MINE类型，后续可以自行添加提示信息。
```
const mp4Parsed = (info: any) => {
  var codecs = [];
  for (var t = 0; t < info.tracks.length; ++t) {
    codecs.push(info.tracks[t].codec);
  }
  let fileCode = analysisCode(codecs[0])
  console.log(fileCode)
};

const analysisCode = (code: string) => {
  if (code.startsWith('avc')) {
    // h264
    return 'h264'
  } else if (code.startsWith('hvc')) {
    // h265
    return 'h265'
  } else {
    throw new Error('unknown video code')
  }
}
```


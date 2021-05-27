import './App.css';
import { useEffect, useState } from 'react'
import MP4Box from 'mp4box'
var reader = new FileReader()



function App() {
  const [codec, setCodec] = useState('')
  const mp4Parsed = (info) => {
    var codecs = [];
    for (var t = 0; t < info.tracks.length; ++t) {
      codecs.push(info.tracks[t].codec);
    }
    let fileCode = analysisCode(codecs[0])
    setCodec(fileCode)
    console.log(fileCode)
  };

  const analysisCode = (code) => {
    if (code.startsWith('avc')) {
      // h264
      return 'h264'
    } else if (code.startsWith('hvc')) {
      // h265
      return 'h265'
    } else {
      throw new Error('unknown video file code')
    }
  }

  const onFileSelected = (e) => {
    reader.readAsArrayBuffer(e.target.files[0]);
  }
  useEffect(() => {
    reader.addEventListener('loadend', function () {
      let result = reader.result;
      result.fileStart = 0;
      let mp4boxfile = MP4Box.createFile()
      mp4boxfile.onReady = mp4Parsed
      mp4boxfile.appendBuffer(result);
    });
    return () => {
      reader = null
    }
  }, [])
  return (
    <div className="App">
      <input type="file" onChange={onFileSelected} accept="video/mp4" />
      <div>file codec:{codec}</div>
    </div>
  );
}

export default App;

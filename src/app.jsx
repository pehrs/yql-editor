import React, { useCallback, useEffect, useRef } from "react";
import MonacoEditor, { monaco } from 'react-monaco-editor';
import { YQL_DOC_TYPE, configureYqlReqLanguage, modelUri, yqlReqLanguageInit } from "./monaco.utils";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MenuBar from "./MenuBar";
const { ipcRenderer } = window.require('electron');

yqlReqLanguageInit();


// export function readFile(filePath, callback) {
//   fs.readFile(
//     path.resolve(__dirname, filePath),
//     'utf-8',
//     (err, data) => {
//       if (err) throw err;

//       return callback(data.toString());
//     }
//   );
// }

function App() {

  const [yqlRequest, setYqlRequest] = React.useState("");
  const [tabIndex, setTabIndex] = React.useState(0);


  configureYqlReqLanguage();

  // Callback from electron main.js for open-file message
  useEffect(() => {
    // Listen for the event
    ipcRenderer.on("open-file", (event, txt) => {
      console.log("open-file", event)
      localStorage.setItem('yqlRequest', txt);
      setYqlRequest(txt);
    });

    // Clean the listener after the component is dismounted
    return () => {
      ipcRenderer.removeAllListeners();
    };
  }, []);


  // var model = monaco.editor.createModel(yqlSample, "json", modelUri);
  // monaco.editor.create(document.getElementById("container"), {
  //   model: model
  // });



  const editorRef = useRef();

  function executeQuery() {
    console.log("EXECUTE QUERY HERE!!!");
    setTabIndex(1);
  }


  function handleEditorDidMount(monacoEditor, m) {

    var storedYqlRequest = localStorage.getItem('yqlRequest');
    if (storedYqlRequest === undefined) {
      localStorage.setItem('yqlRequest', "");
      storedYqlRequest = "";
    }
    setYqlRequest(storedYqlRequest);

    // console.log('editorDidMount', monaco, monacoEditor);
    editorRef.current = monacoEditor


    // FIXME: on mac we need:
    // monacoEditor.addCommand(monaco.KeyMod.WinCtrl | monaco.KeyCode.Enter, () => console.log("hello world"))
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => executeQuery())

    // editorRef.current.onDidChangeModelContent(ev => {
    //   console.log(editorRef.current.getValue());
    // });


    // const existingModel = monacoEditor.getModel(modelUri);
    // const model = existingModel || monacoEditor.createModel(yqlSampleTxt, "yql-req", modelUri);
    // // window.ipcRenderer.on('execute-query', (event) => {
    //   console.log("execute-query", event);
    // })

    //  monacoEditor.setModel(model);
  }

  function editorWillMount(monaco, monacoEditor) {
    // editor.focus();

  }

  function onYqlRequestChange(newValue, e) {
    console.log("onYqlRequestChange", newValue)
    localStorage.setItem('yqlRequest', newValue);

    // console.log("storage:", localStorage.getItem( 'yqlRequest'));
  }


  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }


  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function formatCallback() {


    const model = editorRef.current.getModel();
    const value = model.getValue();
    try {
      const oldObj = JSON.parse(value);
      const newValue = JSON.stringify(oldObj, null, 2);
      data.yqlRequest = newValue;
      // setState({
      //   yqlRequest: newValue,
      // });     
      editorState.yqlRequest = newValue;
    } catch (err) {
      console.log(err)
    }
  }

  return (

    <>
      <MenuBar formatCallback={formatCallback} executeCallback={executeQuery} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Editor" {...a11yProps(0)} />
          <Tab label="Result" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabIndex} index={0}>
        <div className="maindiv">
          <MonacoEditor
            height="90vh"
            language={YQL_DOC_TYPE}
            value={yqlRequest}
            onChange={onYqlRequestChange}
            editorDidMount={handleEditorDidMount}
            editorWillMount={editorWillMount}
          />
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={tabIndex} index={1}>
        RESULTS HERE!
      </CustomTabPanel>
    </>

  );
}
export default App;

import * as nearley from 'nearley/lib/nearley.js';
import * as grammar from './livelang.js';
import IRToJavascript from '../IR/IR.js'

var parserStartPoint;
let processor = nearley.Grammar.fromCompiled(grammar);
let parser = new nearley.Parser(processor);
parserStartPoint = parser.save();
console.log('Nearley parser loaded')

var ts = 0;
onmessage = (m) => {
  // console.log(m.data);
  if (m.data !== undefined) {
    try {
      parser.feed(m.data);
      // console.log(parser.results)
      postMessage({
        "treeTS": 1
      });
      console.log(JSON.stringify(parser.results));
      let jscode = IRToJavascript.treeToCode(parser.results);
      jscode.paramMarkers = JSON.stringify(jscode.paramMarkers);
      console.log(jscode);
      postMessage(jscode);
    } catch (err) {
      console.log("Error" + err); // "Error at character 9"
    }
  }
  parser.restore(parserStartPoint);
};

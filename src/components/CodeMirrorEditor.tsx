import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

interface Props {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
}

export default function CodeMirrorEditor({ value, onChange, darkMode }: Props) {
  return (
    <CodeMirror
      value={value}
      height="100%"
      theme={darkMode ? oneDark : 'light'}
      extensions={[markdown()]}
      onChange={onChange}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLineGutter: true,
        highlightActiveLine: true,
        indentOnInput: true,
        bracketMatching: true,
        autocompletion: false,
        tabSize: 2,
      }}
      style={{ height: '100%', fontSize: '14px' }}
    />
  );
}

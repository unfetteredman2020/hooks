import { customRequest } from '../../utils/upload';
import { AxiosInstance } from 'axios';
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { forwardRef, useState, useEffect, useImperativeHandle } from 'react'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

// 修复 Prism.js 导入顺序和初始化问题
import 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

interface Props {
  uploadUrl: string
  value?: string
  showToolbar?: boolean
  onChange?: (val?: string) => void
  request: AxiosInstance
  children?: React.ReactNode // ✅ 添加这行
  toolbarConfig?: Partial<IToolbarConfig>
  editorConfig?: Partial<IEditorConfig>

}

interface EditorRef {
  clear: () => void
  getHtml: () => string | undefined
  getText: () => string | undefined
}

const Quill: React.FC<Props> = forwardRef<EditorRef, Props>(({ request, uploadUrl, value, onChange, showToolbar = true, toolbarConfig, editorConfig, children }, ref) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null)

  useImperativeHandle(ref, () => {
    return {
      getHtml: () => editor?.getHtml(),
      getText: () => editor?.getText(),
      clear: () => editor?.clear(),
    }
  })

  // 工具栏配置
  const toolbarConfigs: Partial<IToolbarConfig> = {
    ...(toolbarConfig || {}),
    toolbarKeys: [
      'headerSelect',
      'bold',
      'color',
      'bulletedList',
      'numberedList',
      {
        key: 'group-justify',
        title: '对齐',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M768 793.6v102.4H51.2v-102.4h716.8z m204.8-230.4v102.4H51.2v-102.4h921.6z m-204.8-230.4v102.4H51.2v-102.4h716.8zM972.8 102.4v102.4H51.2V102.4h921.6z"></path></svg>',
        menuKeys: ['justifyLeft', 'justifyRight', 'justifyCenter', 'justifyJustify'],
      },

      {
        key: 'group-image',
        title: '图片',
        iconSvg:
          '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
        menuKeys: ['uploadImage'],
      },
    ],
    excludeKeys: ['group-video', 'group-more-style'],
  }

  const editorConfigs: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    readOnly: false,
    ...(editorConfig || {}),
    MENU_CONF: {
      ...(editorConfig?.MENU_CONF || {}),
      uploadImage: {
        customUpload: async (file: File, insertFn: (url: string, alt: string, href?: string) => void) => {
          await customRequest({ request })({ 
            action: uploadUrl, 
            method: 'post', 
            file, 
            onSuccess: (res) => insertFn(res, 'image'),
            onError: (error) => console.error('Upload failed:', error)
          })
        },
      },
    },
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor === null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div>
      {showToolbar && <Toolbar editor={editor} defaultConfig={toolbarConfigs} mode='default' />}

      <Editor
        defaultConfig={editorConfigs}
        value={value}
        onCreated={setEditor}
        onChange={(editor) => {
          const text = editor.getText()
          const html = editor.getHtml()
          if (typeof text === 'string' && !text.trim()) {
            onChange?.(void 0)
          } else {
            onChange?.(html)
          }
        }}
        className='[&_.w-e-scroll>div>p]:m-1!'
        mode='default'
        style={{ height: '300px', overflowY: 'hidden' }}
      />
      {children}
    </div>
  )
})

Quill.displayName = 'Quill';

export default Quill

export type { Props }
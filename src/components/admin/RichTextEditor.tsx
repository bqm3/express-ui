'use client';

import { useMemo, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';
import { Box } from '@mui/material';
import { uploadApi } from '@/lib/api/uploadApi';
import { brandColors } from '@/lib/theme';

import 'tinymce/tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — CSS side-effect import
import 'tinymce/skins/ui/oxide/skin.min.css';

import 'tinymce/plugins/advlist';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/media';
import 'tinymce/plugins/table';
import 'tinymce/plugins/help';
import 'tinymce/plugins/wordcount';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung...',
  height = 420,
  disabled = false,
}: RichTextEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);

  const init = useMemo(
    () => ({
      height,
      menubar: 'file edit view insert format tools table help',
      plugins: [
        'advlist',
        'autolink',
        'lists',
        'link',
        'image',
        'charmap',
        'preview',
        'anchor',
        'searchreplace',
        'visualblocks',
        'code',
        'fullscreen',
        'insertdatetime',
        'media',
        'table',
        'help',
        'wordcount',
      ],
      toolbar:
        'undo redo | blocks | bold italic underline strikethrough | ' +
        'alignleft aligncenter alignright alignjustify | ' +
        'bullist numlist outdent indent | link image media table | ' +
        'removeformat code fullscreen preview | help',
      placeholder,
      branding: false,
      promotion: false,
      skin: false as const,
      content_css: false as const,
      content_style: `
        body {
          font-family: Inter, system-ui, -apple-system, sans-serif;
          font-size: 15px;
          line-height: 1.6;
          color: ${brandColors.onSurface};
          padding: 12px 16px;
        }
        img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        table td, table th { border: 1px solid #ddd; padding: 8px; }
      `,
      convert_urls: false,
      automatic_uploads: true,
      images_reuse_filename: true,
      file_picker_types: 'image',
      images_upload_handler: async (blobInfo: {
        blob: () => Blob;
        filename: () => string;
      }) => {
        const blob = blobInfo.blob();
        const file = new File([blob], blobInfo.filename() || 'image.png', {
          type: blob.type || 'image/png',
        });
        const result = await uploadApi.uploadImage(file);
        return result.url;
      },
      file_picker_callback: (
        callback: (url: string, meta?: Record<string, string>) => void,
        _value: string,
        meta: { filetype: string },
      ) => {
        if (meta.filetype !== 'image') return;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/webp,image/gif';
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          try {
            const result = await uploadApi.uploadImage(file);
            callback(result.url, { title: file.name });
          } catch (err) {
            window.alert(
              err instanceof Error ? err.message : 'Upload ảnh thất bại',
            );
          }
        };
        input.click();
      },
    }),
    [height, placeholder],
  );

  return (
    <Box
      sx={{
        border: `1px solid ${brandColors.border}`,
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: '#fff',
        '& .tox-tinymce': { border: 'none !important' },
      }}
    >
      <Editor
        licenseKey="gpl"
        value={value}
        disabled={disabled}
        onInit={(_evt, editor) => {
          editorRef.current = editor;
        }}
        onEditorChange={(html) => onChange(html)}
        // TinyMCE React InitOptions is narrower than full EditorOptions
        init={init as never}
      />
    </Box>
  );
}

interface InstructionsProps {
  selectionMode: boolean;
}

export default function Instructions({ selectionMode }: InstructionsProps) {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium mb-2">使用说明</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        {selectionMode ? (
          <>
            <li>• 上传图片后，拖动选框选择需要保留的区域</li>
            <li>• 点击&quot;开始框选抠图&quot;按钮，AI将保留选中区域并移除背景</li>
          </>
        ) : (
          <>
            <li>• 上传图片后点击&quot;一键抠图&quot;按钮，AI将自动识别前景并移除背景</li>
            <li>• 可选择不同质量等级，高质量处理效果更好但速度较慢</li>
          </>
        )}
        <li>• 处理完成后可直接下载透明背景的PNG图片</li>
        <li>• 点击&quot;重新上传&quot;按钮可以上传新的图片进行处理</li>
        <li>• 所有处理在您的浏览器中完成，图片不会上传到服务器</li>
        {!selectionMode && <li>• 首次使用需要下载AI模型，请耐心等待</li>}
      </ul>
    </div>
  );
}
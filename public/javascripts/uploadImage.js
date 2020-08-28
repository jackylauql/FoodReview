FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
    stylePanelAspectRatio: 1,
    imageResizeTargetWidth: 400,
    imageResizeTargetHeight: 400
})

FilePond.parse(document.body);
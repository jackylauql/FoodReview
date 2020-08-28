FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
)

FilePond.setOptions({
<<<<<<< HEAD
    stylePanelAspectRatio: 1,
    imageResizeTargetWidth: 400,
    imageResizeTargetHeight: 400
=======
    stylePanelAspectRatio: 1
>>>>>>> 8f6380c39e3a0fe0732491e11848e99effdc6633
})

FilePond.parse(document.body);
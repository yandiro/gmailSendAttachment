function handleFileUpload(req, res) {
    const { file } = req;

    return res.json({ok: true, file})
}

module.exports = { handleFileUpload }
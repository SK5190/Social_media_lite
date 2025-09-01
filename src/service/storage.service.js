const ImageKit = require("imagekit")

var imagekit = new ImageKit({
    publicKey : process.env.PUBLIC_API_KEY,
    privateKey : process.env.PVT_API_KEY,
    urlEndpoint : process.env.URL_ENDPOINT
});

async function uploadImage(file, fileName){
    const response = await imagekit.upload({
        file : file,
        fileName : fileName,
        folder : "social_media_lite"
    })
    
    return response;

}

module.exports = uploadImage;
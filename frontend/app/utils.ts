import Resizer from "react-image-file-resizer";

const resizeFile = (image: File, maxSize = 300) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      image,
      maxSize,
      maxSize,
      'JPEG',
      80,
      0,
      (resizedImage) => {
        resolve(resizedImage)
      },
      'base64'
    )
  })

export default resizeFile
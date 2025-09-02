import React, { useState } from 'react';
import { createPost } from '../services/api';
import { useNavigate } from 'react-router-dom';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setCaption(''); // Clear previous caption
      setMessage(''); // Clear previous message
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select an image to upload.');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await createPost(formData);
      setCaption(response.data.post.caption);
      setMessage(response.data.message);
      navigate('/posts')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Image upload failed');
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 h-full w-full">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 max-h-full overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-center text-gray-800">Upload Your Image</h2>
        
        <div className="mb-5 sm:mb-6">
          <label className="block text-gray-700 text-sm sm:text-base font-bold mb-2" htmlFor="image-upload">
            Select Image
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-3 sm:file:py-2 sm:file:px-4
              file:rounded-full file:border-0
              file:text-sm sm:file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition duration-300 ease-in-out"
            onChange={handleImageChange}
          />
        </div>

        {previewImage && (
          <div className="mb-5 sm:mb-6 text-center bg-gray-50 p-3 sm:p-4 rounded-lg">
            <img src={previewImage} alt="Selected" className="max-w-full h-auto mx-auto rounded-lg mb-3 sm:mb-4 shadow-md" />
            {caption && <p className="text-gray-700 text-sm sm:text-base font-bold mb-2">AI Generated Caption:</p>}
            {caption && <p className="text-gray-600 italic text-sm sm:text-base">{caption}</p>}
          </div>
        )}

        {message && (
          <div className={`mb-5 sm:mb-6 text-center text-sm sm:text-base font-medium ${message.includes('successfully') || message.includes('Post created') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 sm:py-3 px-5 sm:px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out ${!selectedFile || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;

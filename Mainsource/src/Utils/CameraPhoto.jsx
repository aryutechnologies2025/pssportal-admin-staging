import { useRef, useState, useEffect } from "react";

function CameraPhoto({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      videoRef.current.srcObject = mediaStream;
    } catch (err) {
  console.error("Camera error:", err);

  if (err.name === "NotAllowedError") {
    alert("Camera permission denied. Please allow camera access.");
  } else if (err.name === "NotFoundError") {
    alert("No camera found on this device.");
  } else {
    alert("Camera error: " + err.message);
  }

  onClose();
}

  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "camera-photo.png", {
        type: "image/png",
      });
      onCapture(file);
      stopCamera();
      onClose();
    });
  };

  const stopCamera = () => {
    stream?.getTracks().forEach(track => track.stop());
  };

  useEffect(() => {
    if (videoRef.current) {
      openCamera();
    }

    return () => stopCamera();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-[350px]">
        <video ref={videoRef} autoPlay playsInline className="w-full rounded" />

        <div className="flex justify-between mt-3">
          <button
            onClick={takePhoto}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Capture
          </button>
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default CameraPhoto;

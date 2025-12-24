// Upload form with drag & drop, preview, optional expiry, and GSAP animations.
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useApi } from '../api';

export default function UploadForm() {
  const { uploadContent } = useApi();
  const [file, setFile] = useState(null);
  const [expiryAt, setExpiryAt] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const q = gsap.utils.selector(containerRef);
    const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } });
    tl.from(q('.upload-card'), { y: 16, opacity: 0 })
      .from(q('.upload-label'), { y: 8, opacity: 0, stagger: 0.12 }, '-=0.3')
      .from(q('.upload-drop'), { y: 8, opacity: 0 }, '-=0.35')
      .from(q('.upload-actions'), { y: 8, opacity: 0 }, '-=0.35');
  }, []);

  useEffect(() => {
    if (!dropRef.current) return;
    gsap.to(dropRef.current, {
      scale: dragActive ? 1.02 : 1,
      boxShadow: dragActive ? '0 0 0 4px rgba(37, 99, 235, 0.25)' : '0 0 0 0 rgba(0,0,0,0)',
      borderColor: dragActive ? '#2563eb' : '#cbd5e1',
      duration: 0.2,
      ease: 'power2.out',
    });
  }, [dragActive]);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };
  const onFileInput = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setStatus(null);
    setLoading(true);
    try {
      await uploadContent(file, expiryAt || null);
      setStatus({ ok: true, message: 'Uploaded successfully' });
      setFile(null);
      setExpiryAt('');
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setStatus({ ok: false, message: err?.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const isImage = file && file.type?.startsWith('image/');

  // return (
  //   // <section ref={containerRef} className="max-w-3xl mx-auto">
  //   //   <div className="upload-card bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-slate-200">
  //   //     <h2 className="text-2xl font-bold text-slate-800 mb-2">Upload Media</h2>
  //   //     <p className="text-sm text-slate-600 mb-6">Drag & drop a file or click to browse. Supports images and MP4 videos.</p>

  //   //     <form onSubmit={onSubmit} className="space-y-6">
  //   //       <div
  //   //         ref={dropRef}
  //   //         onDragOver={onDragOver}
  //   //         onDragLeave={onDragLeave}
  //   //         onDrop={onDrop}
  //   //         onClick={onBrowseClick}
  //   //         className="upload-drop relative border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
  //   //       >
  //   //         {!file ? (
  //   //           <>
  //   //             <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
  //   //               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
  //   //                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0 0l2 2m-2-2l-2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  //   //               </svg>
  //   //             </div>
  //   //             <p className="text-slate-700 font-medium">Drop file here or click to browse</p>
  //   //             <p className="text-xs text-slate-500 mt-1">Images, MP4 videos up to 50 MB</p>
  //   //           </>
  //   //         ) : (
  //   //           <div className="flex items-center justify-center gap-4">
  //   //             {isImage && (
  //   //               <img
  //   //                 src={URL.createObjectURL(file)}
  //   //                 alt="preview"
  //   //                 className="h-20 w-20 object-cover rounded-lg shadow"
  //   //               />
  //   //             )}
  //   //             <div className="text-left">
  //   //               <p className="text-base font-semibold text-slate-800">{file.name}</p>
  //   //               <p className="text-sm text-slate-600">{file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
  //   //             </div>
  //   //           </div>
  //   //         )}
  //   //         <input ref={inputRef} type="file" accept="video/mp4,image/*" onChange={onFileInput} className="hidden" />
  //   //       </div>

  //   //       <div>
  //   //         <label className="upload-label block text-sm font-medium text-slate-700 mb-2">Expiry (optional)</label>
  //   //         <input
  //   //           type="datetime-local"
  //   //           value={expiryAt}
  //   //           onChange={(e) => setExpiryAt(e.target.value)}
  //   //           className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  //   //         />
  //   //         <p className="text-xs text-slate-500 mt-1">Content auto-removes at this date and time.</p>
  //   //       </div>

  //   //       <div className="upload-actions flex items-center gap-3">
  //   //         <button
  //   //           type="submit"
  //   //           disabled={!file || loading}
  //   //           className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  //   //         >
  //   //           {loading ? 'Uploading…' : 'Upload'}
  //   //         </button>
  //   //         {file && (
  //   //           <button
  //   //             type="button"
  //   //             onClick={() => setFile(null)}
  //   //             className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition-colors"
  //   //           >
  //   //             Clear
  //   //           </button>
  //   //         )}
  //   //       </div>

  //   //       {status && (
  //   //         <div className={`p-3 rounded-lg text-sm ${status.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
  //   //           {status.message}
  //   //         </div>
  //   //       )}
  //   //     </form>
  //   //   </div>
  //   // </section>
  // );
return (
  <section
    ref={containerRef}
    className="min-h-[calc(100vh-9rem)] flex items-center justify-center bg-slate-50 px-4"
  >
    <div className="upload-card w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 sm:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Upload Media</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload images or MP4 videos for digital signage screens
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-7">
        
        {/* Drop Area */}
        <div
          ref={dropRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={onBrowseClick}
          className="upload-drop relative border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center cursor-pointer
                     bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all"
        >
          {!file ? (
            <>
              <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0 0l2 2m-2-2l-2 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-800 font-semibold">
                Drag & drop your file here
              </p>
              <p className="text-sm text-slate-500 mt-1">
                or click to browse (Images / MP4, max 50MB)
              </p>
            </>
          ) : (
            <div className="flex items-center gap-4 justify-center">
              {isImage && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded-xl shadow-md border"
                />
              )}
              <div className="text-left">
                <p className="text-base font-semibold text-slate-800">
                  {file.name}
                </p>
                <p className="text-sm text-slate-500">
                  {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,image/*"
            onChange={onFileInput}
            className="hidden"
          />
        </div>

        {/* Expiry */}
        <div>
          <label className="upload-label block text-sm font-medium text-slate-700 mb-2">
            Expiry Date & Time (Optional)
          </label>
          <input
            type="datetime-local"
            value={expiryAt}
            onChange={(e) => setExpiryAt(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-1">
            Content will auto-remove after this time
          </p>
        </div>

        {/* Actions */}
        <div className="upload-actions flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!file || loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold
                       hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Uploading…" : "Upload Media"}
          </button>

          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-6 py-2.5 rounded-xl bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status */}
        {status && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              status.ok
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {status.message}
          </div>
        )}
      </form>
    </div>
  </section>
);

}


import React, { useState } from 'react';
import { Upload, File, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const KnowledgeBase: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/knowledge/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', message: 'Document processed successfully! AI is now smarter.' });
            setFile(null);
        } catch (err: any) {
            console.error("Upload failed", err);
            setStatus({ type: 'error', message: err.response?.data || 'Failed to process document.' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8 text-gray-900 dark:text-white transition-colors duration-200">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Add PDFs to train your AI on specific business data.</p>
                    </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white dark:bg-[#171717] rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl">
                    <div
                        className={`relative border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all ${file ? 'border-blue-500 bg-blue-50/10' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                            }`}
                    >
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <div className={`p-4 rounded-full mb-4 ${file ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                            {file ? <File size={32} /> : <Upload size={32} />}
                        </div>

                        {file ? (
                            <div className="text-center">
                                <p className="font-semibold text-lg truncate max-w-xs">{file.name}</p>
                                <p className="text-sm text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="font-semibold text-lg">Click or drag PDF here</p>
                                <p className="text-sm text-gray-500 mt-1">Support for PDFs up to 10MB</p>
                            </div>
                        )}
                    </div>

                    {status && (
                        <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border ${status.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
                            }`}>
                            {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${!file || uploading
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Processing Document...
                            </>
                        ) : (
                            'Add to Knowledge Base'
                        )}
                    </button>

                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">How it works</h3>
                        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <span>Documents are split into semantic chunks for better retrieval.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <span>AI will prioritize this data when answering your questions.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowledgeBase;

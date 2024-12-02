import React, { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';

export default function TweetGeneratorApp() {
  const [topic, setTopic] = useState('');
  const [mood, setMood] = useState('');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const moods = [
    'funny', 'serious', 'inspirational', 'sarcastic', 
    'motivational', 'controversial', 'nostalgic'
  ];

  const handleGenerate = async () => {
    if (!topic || !mood) {
      setError('Please fill in both topic and mood');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tweet-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, mood }),
      });

      if (!response.ok) {
        throw new Error('Tweet generation failed');
      }

      const data = await response.json();
      setGeneratedTweet(data.tweet);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTweet);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6 flex items-center justify-center">
          <Sparkles className="mr-2 text-indigo-500" />
          AI Tweet Generator
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Tweet Topic
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., technology, sports)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-2">
              Tweet Mood
            </label>
            <select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a mood</option>
              {moods.map((moodOption) => (
                <option key={moodOption} value={moodOption}>
                  {moodOption.charAt(0).toUpperCase() + moodOption.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <>Generating...</>
            ) : (
              <>
                <Send className="mr-2" /> Generate Tweet
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          {generatedTweet && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg relative">
              <p className="text-gray-800">{generatedTweet}</p>
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 rounded text-xs hover:bg-indigo-600"
              >
                Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
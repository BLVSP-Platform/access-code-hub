/* pages/ToolDetailPage.tsx
import { useParams } from 'react-router-dom'

export default function ToolDetailPage() {
  const { id } = useParams()

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Tool Detail Page</h2>
      <p>Tool ID: {id}</p>
      {/* You can fetch full tool details based on ID here }
    </div>
  )
}
*/
import { useParams, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function ToolDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const name = location.state?.name as string | undefined
  const [textContent, setTextContent] = useState('Loading...')

  useEffect(() => {
    if (!id) return

    // Fetch from public folder
    fetch(`/${id}.txt`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('File not found')
        }
        return res.text()
      })
      .then((text) => setTextContent(text))
      .catch((error) => {
        console.error(error)
        setTextContent('Could not load tool description.')
      })
  }, [id])

  return (
    <div className="p-6 whitespace-pre-wrap">
      <h2 className="text-2xl font-bold mb-4">{name ?? 'Tool Detail Page'}</h2>
      <p className="mb-4 font-medium text-gray-700">Tool ID: {id}</p>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-gray-900 dark:text-gray-100">
        {textContent}
      </div>
    </div>
  )
}

/*
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ToolDetailPage: React.FC = () => {
  const { name } = useParams()
  const [textContent, setTextContent] = useState<string>('');
  const filePath = '/123.txt'; // Adjust the path to your .txt file

  useEffect(() => {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setTextContent(text);
      })
      .catch(error => {
        console.error('Error fetching the text file:', error);
        setTextContent('Failed to load text content.');
      });
  }, [filePath]); // Re-fetch if filePath changes

  return (
    <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Tool Detail Page</h1>
    <p>{name}</p>
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words max-w-full overflow-auto">
      {textContent}
    </div>
  </div>
  );
};

export default ToolDetailPage;*/
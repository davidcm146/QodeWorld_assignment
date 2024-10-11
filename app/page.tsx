"use client"
import { useEffect, useState } from 'react';
import { Upload, Button, List, Input, message, Card, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { RcFile } from 'antd/es/upload';
import { Photo } from '@/types/types';
import { readFileAsDataURL } from '@/helper/FileReader';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [commentContent, setCommentContent] = useState<string>('');
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/photos`);
    const data = await response.data;
    setPhotos(data);
  };

  // Read file from device and transform it to URL to upload
  const handleUpload = async (file: RcFile) => {

    const imageUrl = await readFileAsDataURL(file);
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/photos`,
      {
        url: imageUrl
      },
      {
        headers: { 'Content-Type': 'application/json' }
      });

    if (res.data) {
      message.success('Photo uploaded successfully');
      fetchPhotos();
    } else {
      message.error('Failed to upload image');
    }
  return false;
};

// Submit comment based on photoId
const handleCommentSubmit = async () => {
  if (selectedPhotoId && commentContent) {
    await axios.post(`${process.env.NEXT_PUBLIC_API_ROUTE}/api/comments`, {
      content: commentContent,
      photoId: selectedPhotoId,
    },
      {
        headers: { 'Content-Type': 'application/json' }
      });
    setCommentContent('');
    // Fetch again to get the latest comment
    fetchPhotos();
  }
};

return (
  <div className='p-5'>
    <Upload
      customRequest={({ file, onSuccess }) => {
        handleUpload(file as RcFile);
        if (onSuccess) {
          onSuccess(file); // Explicitly call onSuccess if it exists
        }
      }}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />}>Upload Photo</Button>
    </Upload>

    <Divider />

    <List
      itemLayout="vertical"
      dataSource={photos}
      renderItem={photo => (
        <List.Item>
          <Card
            hoverable
            cover={
              <div>
                <div className='text-sm text-slate-500 my-3 text-center'>
                  {new Date(photo.createdAt).toLocaleString()}
                </div>
                <img src={photo.url} alt={photo.id.toString()} className='w-48 h-48 object-cover rounded-lg mx-auto' />
              </div>
            }
            actions={[
              <Button onClick={() => setSelectedPhotoId(photo.id)} key="comment">
                Add Comment
              </Button>,
            ]}
          >
            <Card.Meta
              description={
                <>
                  <div>
                    {photo.comments.map(comment => (
                      <div key={comment.id} className='mb-2'>
                        <div className='font-semibold'>{comment.content}</div>
                        <div className='text-sm text-slate-500'>
                          {new Date(comment.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedPhotoId === photo.id && (
                    <Input
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      onPressEnter={handleCommentSubmit}
                      placeholder="Add a comment"
                      className='mt-5'
                    />
                  )}
                </>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  </div>
);
}

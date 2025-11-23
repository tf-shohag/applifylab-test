# Frontend API Integration - Quick Reference

## Setup

1. **Environment Variable** (create `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

2. **Import APIs**:
```typescript
import { login, register, getPosts, createPost, uploadImage } from '@/lib/api';
```

## API Functions

### Authentication
- `register(data)` - Register new user
- `login(data)` - Login user  
- `getCurrentUser()` - Get current user
- `logout()` - Logout user
- `isAuthenticated()` - Check if logged in
- `getStoredUser()` - Get user from localStorage

### Posts
- `createPost(data)` - Create new post
- `getPosts(page, limit)` - Get posts with pagination
- `getPost(id)` - Get single post
- `updatePost(id, data)` - Update post
- `deletePost(id)` - Delete post
- `togglePostLike(id)` - Like/unlike post
- `getPostLikes(id)` - Get users who liked

### Comments
- `createComment(postId, data)` - Create comment
- `getComments(postId)` - Get post comments
- `createReply(commentId, data)` - Reply to comment
- `getReplies(commentId)` - Get comment replies
- `deleteComment(id)` - Delete comment
- `toggleCommentLike(id)` - Like/unlike comment
- `getCommentLikes(id)` - Get users who liked

### Upload
- `uploadImage(file)` - Upload image file
- `getImageUrl(path)` - Get full image URL

## Usage Example

```typescript
'use client';
import { useState } from 'react';
import { login, getPosts, createPost } from '@/lib/api';

export default function MyComponent() {
  const [posts, setPosts] = useState([]);

  // Login
  const handleLogin = async () => {
    const { token, user } = await login({
      email: 'user@example.com',
      password: 'password123'
    });
    // Token automatically stored
  };

  // Get posts
  const loadPosts = async () => {
    const { data } = await getPosts(1, 20);
    setPosts(data);
  };

  // Create post
  const handleCreatePost = async (content: string) => {
    const post = await createPost({ content, is_private: false });
    setPosts([post, ...posts]);
  };

  return <div>...</div>;
}
```

## Features

✅ Automatic token management
✅ Auto-redirect on 401 errors
✅ TypeScript type safety
✅ Centralized error handling
✅ Response unwrapping

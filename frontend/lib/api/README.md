# API Integration Library

This directory contains all the API integration code for communicating with the Go backend.

## Structure

```
lib/api/
├── client.ts       # Axios client with interceptors
├── auth.ts         # Authentication APIs
├── posts.ts        # Post management APIs
├── comments.ts     # Comment & reply APIs
├── upload.ts       # File upload APIs
└── index.ts        # Main export file
```

## Usage

### Import APIs

```typescript
import { login, register, logout } from '@/lib/api';
import { getPosts, createPost, togglePostLike } from '@/lib/api';
import { createComment, getReplies } from '@/lib/api';
import { uploadImage } from '@/lib/api';
```

### Authentication

```typescript
// Register
const { token, user } = await register({
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  password: 'password123'
});

// Login
const { token, user } = await login({
  email: 'john@example.com',
  password: 'password123'
});

// Get current user
const user = await getCurrentUser();

// Logout
logout();

// Check if authenticated
const isAuth = isAuthenticated();
```

### Posts

```typescript
// Create post
const post = await createPost({
  content: 'Hello World!',
  image_url: '/uploads/image.jpg',
  is_private: false
});

// Get posts with pagination
const { data, page, limit, total, has_more } = await getPosts(1, 20);

// Get single post
const post = await getPost(postId);

// Update post
const updated = await updatePost(postId, {
  content: 'Updated content',
  is_private: true
});

// Delete post
await deletePost(postId);

// Toggle like
const { liked } = await togglePostLike(postId);

// Get who liked
const users = await getPostLikes(postId);
```

### Comments

```typescript
// Create comment
const comment = await createComment(postId, {
  content: 'Great post!'
});

// Get comments
const comments = await getComments(postId);

// Create reply
const reply = await createReply(commentId, {
  content: 'Thanks!'
});

// Get replies
const replies = await getReplies(commentId);

// Delete comment
await deleteComment(commentId);

// Toggle like on comment
const { liked } = await toggleCommentLike(commentId);

// Get who liked comment
const users = await getCommentLikes(commentId);
```

### File Upload

```typescript
// Upload image
const { url, filename } = await uploadImage(file);

// Get full image URL
const fullUrl = getImageUrl(url);
```

## Features

- ✅ **Automatic Authentication**: Token automatically added to all requests
- ✅ **Error Handling**: Centralized error handling with auto-redirect on 401
- ✅ **TypeScript**: Full type safety with interfaces
- ✅ **Token Management**: Automatic storage and retrieval from localStorage
- ✅ **Response Unwrapping**: Automatic extraction of data from responses

## Environment Variables

Set in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Error Handling

All API functions throw errors that can be caught:

```typescript
try {
  const posts = await getPosts();
} catch (error) {
  console.error('Failed to fetch posts:', error);
  // error contains the error response from backend
}
```

## Authentication Flow

1. User logs in/registers
2. Token and user data stored in localStorage
3. Token automatically added to all subsequent requests
4. On 401 error, token cleared and user redirected to login

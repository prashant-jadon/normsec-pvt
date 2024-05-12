import { useUserContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type PostCardProps ={
    post: Models.Document;
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();

    if (!post.creator) return null;

    const makeLinksClickable = (text: string) => {
        if (!text) return ''; 

        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: blue;">${url}</a>`);
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
<div className="post_details-card">
          <img
            src={post?.imageUrl}
            alt="creator"
            className={post.imageUrl ? "post_details-img" : "w-0 h-0"}
            
          />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className='py-4'>
                    <p className='text-lg font-semibold text-gray-900' dangerouslySetInnerHTML={{ __html: makeLinksClickable(truncateText(post.caption, 500)) }}></p>
                    <ul className='flex gap-1 mt-2 flex-wrap'>
                        {post.tags.map((tag: string) => (
                            <li key={tag} className='text-gray-600'>
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>

            {post.pdfUrl && 
                <a className='text-lg font-semibold text-gray-900 block mt-2' href={post.pdfUrl} style={{ color: 'blue' }}>CLICK HERE TO OPEN PDF</a>
            }
            <div className="w-full py-4">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
    );
};

export default PostCard;

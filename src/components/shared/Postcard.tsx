import { useUserContext } from '@/context/AuthContext';
import { formatDateString } from '@/lib/utils';
import { Models } from 'appwrite';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type PostCardProps ={
    post: Models.Document;
}

const Postcard = ({post}: PostCardProps) => {

    const {user} = useUserContext();
    if(!post.creator) return;

    // Function to convert URLs in text to clickable links
    const makeLinksClickable = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    };

    // Function to truncate text to a specified length
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    return (
        <div className='bg-white rounded-lg shadow-lg p-4 mb-4'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-center mb-3 lg:mb-0'>
                    <Link to={`/profile/${post.creator.$id}`} >
                        <img 
                            src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                            alt='creator'
                            className='rounded-full w-12 h-12 lg:w-16 lg:h-16 mr-3'/>
                    </Link>


                    <div className='flex flex-col'>
                        <p className='text-lg font-bold text-gray-800'>
                            {post.creator.name}
                        </p>
                        <div className='flex items-center text-sm text-gray-600'>
                            <p className='mr-2'>
                                {formatDateString(post.$createdAt)}
                            </p>
                            <p>-</p>
                            <p className='ml-2'>
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>

                <Link to={`/update-post/${post.$id}`}
                    className={`${user.id !== post.creator.$id && "hidden"}`}
                >
                    <img src='/assets/icons/edit.svg'
                        alt='edit'
                        width={20}
                        height={20}/>
                </Link>
            </div>
            <Link to={`/posts/${post.$id}`}>
                <div className='py-4'>
                    <p className='text-lg font-semibold text-gray-900' dangerouslySetInnerHTML={{ __html: makeLinksClickable(truncateText(post.caption, 30)) }}></p>
                    <ul className='flex gap-1 mt-2'>
                        {post.tags.map((tag:string)=>(
                            <li key={tag} className='text-gray-600' >
                              

                            </li>
                        ))}
                    </ul>
                </div>

                {post.imageUrl && 
                    <img src={post.imageUrl}
                        className='w-full h-auto rounded-lg mt-4'
                        alt='post image'/>
                }   
            </Link>

            <a className='text-lg font-semibold text-gray-900' href={post.pdfUrl}>CLICK HERE TO OPEN PDF</a>

            <PostStats post={post} userId={user.id}/>
        </div>
    )
}

export default Postcard;

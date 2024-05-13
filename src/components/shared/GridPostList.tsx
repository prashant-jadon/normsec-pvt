import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "./PostStats";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

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
    <div>
      <ul className="grid-container">
        {posts.map((post) => (
          <li key={post.$id} className="relative min-w-80 h-auto mb-4">
            <Link to={`/posts/${post.$id}`} className="block">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="w-full h-auto rounded-lg"
                />
              )}
              {!post.imageUrl && (
                <div className="bg-black bg-opacity-20 text-white p-4 rounded-lg">

<p className="text-lg font-semibold mb-20" dangerouslySetInnerHTML={{ __html: makeLinksClickable(truncateText(post.caption, 300)) }}></p>

                </div>
              )}
            </Link>
            <div className="grid-post_user mt-2">
              {showUser && (
                <div className="flex items-center justify-start gap-2">
                  <img
                    src={post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"}
                    alt="creator"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </div>
              )}
              {showStats && (
                <div className="mt-20">
                  <PostStats post={post} userId={user.id} />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GridPostList;

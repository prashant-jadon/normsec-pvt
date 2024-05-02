import { useFollowUserMutation, useGetUserById } from '@/lib/react-query/queriesAndMutations';
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

type UserId = string;
type UserIdOfOther = string;

interface FollowButtonProps {
  userId: UserId;
  userIdOfOther: UserIdOfOther;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, userIdOfOther }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { mutate: followUser } = useFollowUserMutation();

  // Fetch user information of the user to follow
  const { data: user } = useGetUserById(userIdOfOther);

  useEffect(() => {
    // Check if the current user is already in the followers list
    if (user) {
      setIsFollowing(user.followers.includes(userId));
    }
  }, [user, userId]);

  const handleFollow = async () => {
    try {
      if (user) {
        // Call the followUser mutation
        await followUser({ userId, userIdOfOther, followArray: isFollowing ? user.followers.filter((Id: string) => Id !== userId) : [...user.followers, userId] });
        setIsFollowing(!isFollowing);
      } else {
        console.error('User information not available');
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <Button onClick={handleFollow} type="button" className="shad-button_primary px-8">
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;

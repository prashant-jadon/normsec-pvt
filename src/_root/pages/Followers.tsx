import UserCardFollower from '@/components/shared/UserCardFollower';
import { useGetUserById } from '@/lib/react-query/queriesAndMutations';
import { Loader } from 'lucide-react';
import { useParams } from 'react-router-dom';

const Followers = () => {

  const { id } = useParams();
  const { data: currentUser } = useGetUserById(id || "");

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  return (
    <div>
      <UserCardFollower userID={currentUser?.$id}/>
    </div>
  )
}

export default Followers

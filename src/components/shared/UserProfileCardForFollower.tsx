import { Loader } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { Link } from "react-router-dom";

type UserProfileCardProps = {
  followerId: string;
};

const UserProfileCardForFollower = ({ followerId }: UserProfileCardProps) => {
  const { toast } = useToast();
  const { data: currentUser, isError: isErrorFollowers, isPending: isLoading } = useGetUserById(followerId || "");

  if (isErrorFollowers) {
    toast({ title: "Something went wrong." });
    return null;
  }

  if (isLoading) return <Loader />;

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <Link to={`/profile/${followerId}`} className="user-card">
        <img
          src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14"
        />
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {currentUser.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{currentUser.username}
        </p>
      </div>
    </Link>
  );
};

export default UserProfileCardForFollower;

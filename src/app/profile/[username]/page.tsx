import { getProfileByUsername, isFollowing, getUserLikedPosts, getUserPosts } from "@/actions/profile.action";
import { notFound } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";

export async function generateMetadata({ params }: { params: { username: string } }) { // No explicit type
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
    // ... other metadata properties
  };
}

async function ProfilePageServer({ params }: { params: { username: string } }) {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const user = await getProfileByUsername(params.username);
  if (!user) notFound();
  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);
  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}

export default ProfilePageServer;